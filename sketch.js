var volumeLevel;
var freq;
var wave;
var button;
var playing;
var time;
var count = "";
var freqList = "";
var sel;
var fft;
var amp;

function setup() {
	createCanvas(300, 300);
	volumeLevel = createSlider(0.05, 2, 0, 0.01);
	volumeLevel.position(80, 40);

	freq = createInput();
	freq.position(60, 90);

	time = createInput();
	time.position(60, 140);

	sel = createSelect();
	sel.position(110, 190);
	sel.option('square');
	sel.option('sine');
	sel.option('triangle');
	sel.option('sawtooth');
	sel.changed(setWave);

	button = createButton('play / stop');
	button.position(110, 240);
	button.mousePressed(toggle);

	wave = new p5.Oscillator();
	wave.setType('square');

	fft = new p5.FFT();
	fft.setInput(wave);

}

function draw() {
	background(50);

	fill(255);
	noStroke();
	text('Volume', volumeLevel.x + volumeLevel.width / 2 - 10, 40);
	text('Freqency (Hz)', freq.x + freq.width / 2 - 30, 85);
	text('Wave', sel.x + sel.width, 185);
	text('Time ' + count + ' (seconds)', time.x + time.width / 2 - 40, 135);

	noFill();
	stroke(255);
	let spectrum = fft.analyze();
	
	beginShape();
	for (x = 0; x < spectrum.length; x++) {
		let y = map(spectrum[x], 0, 500, height, 0);
		vertex(x, y);
	}
	endShape();

	//ellipse(height/2, height, width, vol*200);

	wave.amp(volumeLevel.value());
}

var timer;
var freqChange;
var currentFreq;

function toggle() {
	if (!playing) {
		wave.start();
		freqList = freq.value().split(",");
		currentFreq = 0;

		wave.freq(float(freqList[currentFreq]));
		playing = true;

		freqChange = setInterval(() => {
			currentFreq++;
			wave.freq(float(freqList[currentFreq]));
			if (currentFreq === time.value()) {
				clearInterval(freqChange);
				currentFreq = 0;
			}
		}, time.value() * 1000);

		if (float(time.value()) > 0) {
			var counter = 0;
			count = time.value() * freqList.length;
			timer = setInterval(() => {
				count = float(time.value() * freqList.length - counter - 1);
				counter++;
				if (counter === float(time.value()) * freqList.length) {
					wave.stop();
					playing = false;
					clearInterval(timer);
					clearInterval(freqChange);
					currentFreq = 0;
				}
			}, 1000);
		}

	} else {
		wave.stop();
		playing = false;
		clearInterval(timer);
		clearInterval(freqChange);
		count = "";
		currentFreq = 0;
	}
}

function setWave() {
	wave.setType(sel.value());
}
