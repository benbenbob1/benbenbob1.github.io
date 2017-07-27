

var canvas;
var song, fft, analyzer;
var r = 0;
var rotate_E = 0;
var axis_Y = 0;
var axis_X = 0;
var position_X = 0;
var ellipse_pulse = 0;
var vol, spectrum;
var vol_scaled = 0;
var rotate_E_dots = 0;
var axis_Y_dots = 0;
var axis_X_dots = 0;
var position_X_dots = 0;
var transX, transY;

var recording = false;
var centerY = 0;
var bgColor = [0,48,81];
var ltBlueColor = [226,241,251];
var medBlueColor = [76,147,206];
var rotateDir = 1;
var langChoices = [
"ENGLISH",
"ENGLISH",
"ENGLISH",
"ENGLISH",
"SPANISH", 
"CHINESE",
"CHINESE"
];

var recordLen = 5; //s

// no song is playing variables

var r2 = 0;
var rotate_E2 = 0;
var axis_Y2 = 0;
var axis_X2 = 0;
var position_X2 = 0;
var ellipse_pulse2 = 0;
var spectrum2;

var mic, soundRecorder;
var recordingText = null, recordingText2 = null;
var micEnabled = false;
var recordingTimer = null;
var recordingSecs = 0;
var analyzing = false;

function preload() {
    mic = new p5.AudioIn();

    //soundRecorder = new p5.SoundRecorder();
    //soundRecorder.setInput(mic);

    startMic();
}

function startMic() {
    mic.start();
}

function setup() {

    canvas = createCanvas(windowWidth, windowHeight);
    background(0);
    noStroke();
    rectMode(CENTER);
    frameRate(30);
    smooth();
    analyzer = new p5.Amplitude();
    analyzer.setInput(mic);
    fft = new p5.FFT();
    fft.setInput(mic);
    canvas.position(0, 0);

    updateRecText();
}

function draw_rotate_ellipse(rotate_E, axis_Y, position_X, spectrumItem) {
    strokeWeight(5);
    rotate(rotate_E*rotateDir);
    fill(ltBlueColor[0], ltBlueColor[1], ltBlueColor[2], 255);
    ellipse(position_X, position_X, axis_X, spectrumItem*axis_Y*3);

}

function mouseClicked() {
    recording = !recording;

    if (!micEnabled) {
        recording = false;
    }
    //soundRecorder.start()

    //var newCenterY = centerY;

    if (recording) {
        bgColor = [128, 0, 128];
        ltBlueColor = [255, 255, 255];
        medBlueColor = ltBlueColor;
        newCenterY = 50;
        rotateDir = -1;
        recordingSecs = 0;
        analyzing = false;
        recordingTimer = window.setInterval(function() {
            recordingSecs += 1;
            updateRecText();
        }, 1000);
    } else {
        bgColor = [0,48,81];
        ltBlueColor = [226,241,251];
        medBlueColor = [76,147,206];
        newCenterY = 0;
        rotateDir = 1;
        window.clearInterval(recordingTimer);
        recordingTimer = null;
    }

    updateRecText();
    
    //centerY = newCenterY;
}

function updateRecText() {
    if (recordingText == null) {
        recordingText = document.getElementById("rec-span");
        recordingText2 = document.getElementById("rec-span-2");
    }

    var str = "";

    if (!mic.enabled) {
        str = "To begin, enable microphone access above";
    } else {
        var time = "";
        var after = "";
        if (recording) {
            var color = "white";
            if (recordingSecs >= recordLen) {
                color = "#0cff00";
                var newText = "Analyzing...";
                if (recordingText2.innerText != newText) {
                    recordingText2.innerText = newText;
                }

                if (!analyzing) {
                    analyzing = true;
                    window.setTimeout(function() {
                        var el = document.getElementById("center-text");
                        var choice = Math.floor(Math.random() * langChoices.length);
                        mouseClicked();
                        el.innerText = langChoices[choice];
                        updateRecText();

                        window.setTimeout(function() {
                            analyzing = false;
                            el.innerText = "";
                            updateRecText();
                        }, 8000);
                    }, 3000)
                }
            }
            if (recordingSecs > 0) {
                time = " (<span style='color:"+color+";'>"+recordingSecs+"s</span>)";
            }
        } else {
            recordingText2.innerText = "";
        }
        str = "Click to "+(recording?"end":"start")+" recording"+time;
    }

    recordingText.innerHTML = str;
}

function draw_rotate_dots(rotate_E_dots, axis_Y_dots, position_X_dots) {

    rotate(rotate_E_dots*rotateDir);
    fill(random(255,255),255);
    ellipse(position_X_dots, position_X_dots, axis_X_dots, axis_Y_dots);

}

function draw_pulse(ellipse_pulse) {

    fill(medBlueColor[0], medBlueColor[1], medBlueColor[2], 100);
    noStroke();
    ellipse(0, centerY, ellipse_pulse, ellipse_pulse);
    fill(bgColor[0], bgColor[1], bgColor[2], 150);

    var shrunk = ellipse_pulse/3;
    ellipse(0, centerY, shrunk, shrunk);

}

function draw_circle(circle, circle_stroke) {

    stroke(medBlueColor[0], medBlueColor[1], medBlueColor[2], 150 );
    strokeWeight(circle_stroke);
    noFill();
    ellipse(0, centerY, circle, circle);

}

// no song is playing function

function draw_rotate_ellipse2(rotate_E2, axis_X2, axis_Y2, position_X2) {

    rotate(rotate_E2);
    fill(76,147,206,255);
    ellipse(position_X2, position_X2, axis_X2, axis_Y2);

}

function draw() {
    vol = Math.max(analyzer.getLevel()/1.5, 0.1);
    vol_scaled = 1+vol*700;
    spectrum = fft.analyze();

    if (!mic.enabled) {

        push();
        translate(random(width), random(height));
        fill(0, 10);
        rect(0, 0, width, height);
        spectrum2 = random(100);

        for (var i = 0; i < spectrum2*2 ; i = i + 1) {  
            position_X2 =  position_X2 + i ;
            var dot_size2 = random(1.5);
            axis_Y2 = dot_size2;
            axis_X2 = dot_size2;
            rotate_E2 =  rotate_E2 + 0.01;
            draw_rotate_ellipse2(rotate_E2, axis_X2, axis_Y2, position_X2);
        }

        spectrum2 = spectrum2 + 1;
        position_X2 = 0;
        pop();

    } else {
        if (!micEnabled) {
            micEnabled = true;
            updateRecText();
        }
    }

    transX = width/2;
    transY = height/2;
    translate(transX, transY);  

    if (vol < 0) {

        vol_scaled = 0;
        spectrum = spectrum - 0.01;

        if (spectrum < 0) {

            spectrum = 0;
            //fill(0,255);
            //rect(0,0,width/height);

        }

    }

    noStroke()
    fill(bgColor[0], bgColor[1], bgColor[2], random(20,50));
    rect(0, 0, width, height);

    var sLen = spectrum.length;


    for (var i = 0; i < sLen ; i = i + 0.5) {

        var dot_size = random(1);
        position_X_dots =  i  * 1;
        axis_Y_dots = dot_size;
        axis_X_dots = dot_size;
        rotate_E_dots =  rotate_E_dots + 0.000001;
        draw_rotate_dots(rotate_E_dots, axis_Y_dots, position_X_dots);

    }

    for (var i = 0; i < (sLen*0.08); i = i += 0.7) {

        position_X = vol_scaled * 1 ;
        axis_Y =  i + vol_scaled * 1;
        axis_X =  0.5;
        rotate_E =  vol_scaled;
        draw_rotate_ellipse(rotate_E, axis_Y, position_X, spectrum[int(i)]/250.0);

    }

    draw_pulse(vol_scaled/3);

    if ( random(100) > 80 ) {

        draw_circle(vol_scaled * random(1, 2), (vol_scaled/20));

    }

}

function windowResized() {

    resizeCanvas(windowWidth, windowHeight);
    
}