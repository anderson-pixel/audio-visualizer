window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;

var start = function() {
    var audio = document.getElementById('audio');
    var ctx = new AudioContext();
    var analyser = ctx.createAnalyser();
    var audioSrc = ctx.createMediaElementSource(audio);
    audioSrc.connect(analyser);
    analyser.connect(ctx.destination);
    var frequencyData = new Uint8Array(analyser.frequencyBinCount);
    var canvas = document.getElementById('canvas'),
        cwidth = canvas.width,
        cheight = canvas.height - 2,
        meterWidth = 10, 
        gap = 2, 
        capHeight = 2,
        capStyle = 'white',
        meterNum = 1000 / (10 + 1) , 
        capYPositionArray = []; 
    ctx = canvas.getContext('2d'),
    gradient = ctx.createLinearGradient(450, 200, 210, 200);
    gradient.addColorStop(1, '#f983ff');
    gradient.addColorStop(0.5, '#fdbd55');
    gradient.addColorStop(0, '#f983ff');
    function renderFrame() {
        var array = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(array);
        var step = Math.round(array.length / meterNum); 
        ctx.clearRect(0, 0, cwidth, cheight);
        for (var i = 0; i < meterNum; i++) {
            var value = array[i * step];
            if (capYPositionArray.length < Math.round(meterNum)) {
                capYPositionArray.push(value);
            };
            ctx.fillStyle = capStyle;
            ctx.fillStyle = gradient; 
            ctx.fillRect(i * 12 , cheight - value + capHeight, meterWidth, cheight); //the meter
        }
        requestAnimationFrame(renderFrame);
    }
    renderFrame();
     audio.play();
};

audio.onplay = function(){
    start();
}