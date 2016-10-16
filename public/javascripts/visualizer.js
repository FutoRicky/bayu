var State, svg;
var squares;
var WAVE_DATA;
var waveform_array, old_waveform, objectUrl, metaHide, micStream;       // raw waveform data from web audio api
var analyser;

visualize = function(audio) {
    State = {
        width : $(document).width(),
        height : $(document).height(),
        then: Date.now(),
        drawInterval: 1000/24
    };
    svg = d3.select("body").append("svg").attr('id', 'viz')
                .attr("width", State.width)
                .attr("height", State.height);

    // start
    document.getElementById('audio_box').appendChild(audio);
    context = new AudioContext(); // AudioContext object instance
    analyser = context.createAnalyser(); // AnalyserNode method
    // Re-route audio playback into the processing graph of the AudioContext
    source = context.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(context.destination);
    frameLooper();
};
var frameLooper = function() {
    // recursive function used to update audio waveform data and redraw visualization
    window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    window.requestAnimationFrame(frameLooper);

    now = Date.now();
    delta = now - State.then;

    // some framerate limiting logic -- http://codetheory.in/controlling-the-frame-rate-with-requestanimationframe/
    if (delta > State.drawInterval) {
        State.then = now - (delta % State.drawInterval);

        waveform_array = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(waveform_array);

        // draw active visualizer
        equalViz();
    }
};


var equalViz = function() {
    $('body > svg').empty();
    var marginX = Math.floor(State.width/10);
    var marginY = Math.floor(State.height/10);
    var w = Math.floor((State.width - marginX*2)/21);

    WAVE_DATA = normalize_binned(50);

    var x = d3.scale.linear()
        .domain([0, WAVE_DATA.length])
        .range([marginX, State.width-marginX]);

    var y = d3.scale.linear()
        .domain([0, 1])
        .range([0,State.height-marginY*3]);

    var opacity = d3.scale.sqrt()
        .domain([0, 1])
        .range([.25, .8]);

    squares = svg.selectAll("g")
        .data(WAVE_DATA, function(d) { return d; });

    squares.enter()
        .append("g")
            .attr("transform", function(d,i) { return "translate(" + ((i*w)+marginX) + "," + ((State.height/2)-(y(d)/2)) + ")"; })
            .attr("opacity", function(d) { return opacity(d); })
        .append("rect")
            .attr("class", "equal")
            .attr("width", w-7 +'px')
            .attr("height", function(d,i) { return y(d) + "px" });

    squares.exit().remove();
};

var normalize_binned = function(binsize, coef, offset, neg) {
    var numbers = [];
    var temp = 0;
    for (var i = 0; i < waveform_array.length; i++) {
        temp += waveform_array[i];
        if (i%binsize==0) {
            numbers.push(temp/binsize);
            temp = 0;
        }
    }

    var coef = coef || 1;
    var offset = offset || 0;
    var numbers2 = [];
    var ratio = Math.max.apply( Math, numbers );
    var l = numbers.length

    for (var i = 0; i < l; i++ ) {
        if (numbers[i] == 0)
            numbers2[i] = 0 + offset;
        else
            numbers2[i] = ((numbers[i]/ratio) * coef) + offset;

        if (i%2 == 0 && neg)
            numbers2[i] = -Math.abs(numbers2[i]);
    }
    return numbers2;
};

//     $('#progressBar').attr('style','width: '+(audio.currentTime/audio.duration)*100+"%");
// if (c.kickDetect(95)) {
//  h.themeChange(Math.floor(Math.random() * 6));
//      h.vizChange(Math.floor(Math.random() * 7));
// }
