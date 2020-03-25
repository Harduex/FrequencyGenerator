var volumeLevel;
var freq;
var wave;
var button;
var playing;
var time;
var count = "";

function setup() {
	createCanvas(200, 200);
	volumeLevel = createSlider(0.05, 0.5, 0, 0.01);
	volumeLevel.position(30, 30);

	freq = createInput();
	freq.position(10, 80);

	time = createInput();
	time.position(10, 130);

	button = createButton('play / stop');
	button.position(60, 165);
	button.mousePressed(toggle);

	wave = new p5.Oscillator();
	wave.setType('square');

}

function draw() {
	background(50);

	text('volume', volumeLevel.x + volumeLevel.width / 2 - 10, 35);
	text('freqency (Hz)', freq.x + freq.width / 2 - 30, 75);
	text('time ' + count + ' (seconds)', time.x + time.width / 2 - 40, 125);
	fill(255);

	wave.amp(volumeLevel.value());
}

var timer;

function toggle() {
	if (!playing) {
		wave.start();
		wave.freq(float(freq.value()));
		playing = true;

		if (float(time.value()) > 0) {
			var counter = 0;
			count = time.value();
			timer = setInterval(() => {
				count = float(time.value() - counter - 1);
				counter++;
				if (counter === float(time.value())) {
					wave.stop();
					playing = false;
					clearInterval(timer);
				}
			}, 1000);
		}

	} else {
		wave.stop();
		playing = false;
		clearInterval(timer);
		count = "";
	}
}
