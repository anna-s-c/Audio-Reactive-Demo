let ratio = 1.3333; // 4:3 aspect ratio
let globeScale; // scale factor for the globe

let mic; // microphone input and volume
let vol = 1;
let normVol; // normalized volume
let volSense = 100; // sensitivity of the volume
let sliderStep = 10; // step for the slider
let volSenseSlider; // slider to adjust sensitivity
let startAudio = false; // flag to start audio

//Frequency variables
let fft; // Fast Fourier Transform object
let spectrum; // Frequency spectrum
let waveform; // Waveform

function setup(){

    createCanvas(window.innerWidth, window.innerWidth / ratio);
    globeScale = min(width, height);
    colorMode(HSB);
    getAudioContext().suspend();

    volSenseSlider = createSlider(0, 200, volSense, sliderStep);

}

function draw() {

    background(200, 100, 100, 0.1);


    if(startAudio){

    vol = mic.getLevel(); // get the volume from the microphone
    spectrum = fft.analyze(); // get the frequency spectrum
    waveform = fft.waveform(); // get the waveform

    volSense = volSenseSlider.value(); // get the sensitivity from the slider
    normVol = vol * volSense; // normalize the volume

    waveForm(); // draw the waveform
    spectrumF(); // draw the frequency spectrum

    }

    smileyFace();
}

function mousePressed(){
    getAudioContext().resume().then(() => {

    if(!startAudio){
        mic = new p5.AudioIn();
        fft = new p5.FFT();
        fft.setInput(mic);

        mic.start();
        startAudio = true;
    }
});
}

function waveForm(){
    if(startAudio){
     // waveform visualization
     noFill();
     beginShape();
     stroke(20);
     for (let i = 0; i < waveform.length; i++) {
         let x = map(i, 0, waveform.length, 0, width);
         let y = map(waveform[i], -1, 1, 0, height);
         vertex(x, y);
     }
     endShape();
    }
}

function spectrumF(){

    if(startAudio){
        for (let i = 0; i < spectrum.length; i++) {
            
            let rectX = map(i, 0, spectrum.length, 0, width);
            let rectY = height;
            let rectW = globeScale*0.05;
            let rectH = -map(spectrum[i], 0, 255, 0, height);
            noStroke();
            fill(spectrum[i], 100, 100, 0.1);
            rect(rectX, rectY, rectW, rectH);

            let rectX2 = width - rectX - rectW;
            rect(rectX, rectY, rectW, rectH)

        }
    }
}