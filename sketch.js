var volumeLevel;
var freq;
var wave;
var button;
var playing;
var time;
var count = "";
var counter;
var freqList = "";
var sel;
var fft;
var amp;
var nowPlaying = "";

function setup() {
	createCanvas(300, 380);
	volumeLevel = createSlider(0.05, 2, 0, 0.01);
	volumeLevel.position(80, 30);

	freq = createInput();
	freq.position(60, 110);

	time = createInput();
	time.position(60, 170);

	sel = createSelect();
	sel.position(110, 220);
	sel.option('square');
	sel.option('sine');
	sel.option('triangle');
	sel.option('sawtooth');
	sel.changed(setWave);

	button = createButton('play / stop');
	button.position(110, 260);
	button.mousePressed(toggle);

	wave = new p5.Oscillator();
	wave.setType('square');

	fft = new p5.FFT(0.8,128);
	fft.setInput(wave);

}

function draw() {
	background(50);

	fill(255);
	noStroke();
	text('Volume', volumeLevel.x + volumeLevel.width / 2 - 10, 30);
	text('Freqencies (Hz)', freq.x + freq.width / 2 - 38, 85);

	if (freqList.length === 1 || time.value() === "") {
		text('Current: ' + freqList[0], freq.x + freq.width / 2 - 40, 105);
	} else {
		text('Current: ' + nowPlaying, freq.x + freq.width / 2 - 40, 105);
	}
	text('Wave', sel.x + sel.width, 215);
	text('Time ' + count + ' (seconds)', time.x + time.width / 2 - 40, 160);

	noFill();
	stroke(255);
	let spectrum = fft.analyze();

	rect(85, height - 80, 128, 70);

	beginShape();
	for (x = 0; x < spectrum.length; x++) {
		let y = map(spectrum[x], 0, 255, height-10, 300);
		vertex(x+85, y);
	}
	endShape();

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

		if(freqList.length > 1 && time.value() === "") {
			time.value(60)
		}

		wave.freq(float(freqList[currentFreq]));
		nowPlaying = float(freqList[currentFreq]);

		playing = true;

		freqChange = setInterval(() => {
			currentFreq++;
			wave.freq(float(freqList[currentFreq]));
			nowPlaying = float(freqList[currentFreq]);
			if (currentFreq === time.value()) {
				clearInterval(freqChange);
				currentFreq = 0;
			}
		}, time.value() * 1000);

		if (float(time.value()) > 0) {
			counter = 0;
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
					nowPlaying = "";
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
