var volumeLevel;
var freq;
var wave;
var button;
var playing;
var time;
var count = "";
var freqList = "";
var sel;

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
	//wave.setType('square');

}

function draw() {
	background(50);

	text('Volume', volumeLevel.x + volumeLevel.width / 2 - 10, 40);
	text('Freqency (Hz)', freq.x + freq.width / 2 - 30, 85);
	text('Wave', sel.x + sel.width, 185);
	text('Time ' + count + ' (seconds)', time.x + time.width / 2 - 40, 135);
	fill(255);

	wave.amp(volumeLevel.value());
}

var timer;
var currentFreq = 0;

function toggle() {
	if (!playing) {
		wave.start();
		freqList = freq.value().trim().split(",");
		wave.freq(float(freqList[currentFreq]));
		playing = true;

		freqChange = setInterval(()=>{
			currentFreq++;
			wave.freq(float(freqList[currentFreq]));
			if(currentFreq === time.value()) {
				clearInterval(freqChange);
				currentFreq = 0;
			}
		}, time.value()*1000);

		if (float(time.value()) > 0) {
			var counter = 0;
			count = time.value()*freqList.length;
			timer = setInterval(() => {
				count = float(time.value()*freqList.length - counter - 1);
				counter++;
				if (counter === float(time.value())*freqList.length) {
					wave.stop();
					playing = false;
					clearInterval(timer);
					//location.reload();
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

function setWave() {
	wave.setType(sel.value());
}
