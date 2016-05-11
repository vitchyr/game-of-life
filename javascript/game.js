(function()
{

    var _create_fn = function(){};
    var create = function(parent){

        _create_fn.prototype = parent;
        var instance = new _create_fn();
        return instance;
    };

    var global = (function(){return this;})();

    var dataset = JSON.parse(data);
    var simStep = 0;
    var state = dataset[simStep];

    var nSquaresX = 8;
    var nSquaresY = 8;
    var squareSize = 50;
    var squarePadding = 1;
    var w = nSquaresX * (squareSize + squarePadding);
    var h = nSquaresY * (squareSize + squarePadding);

    global.onload = function(){
        var svg = d3.select(".board")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

        createBoard(svg);
        setupButtons(svg);
    };

    function createBoard(svg, simStep) {
        var rects = svg.selectAll("rect")
        for (var y = 0; y < state.length; y++) {
            addRow(rects, y);
        }
    }

    function addRow(rects, y) {
        rects.data(state[y])
            .enter()
            .append("rect")
            .attr("fill", function(d) {
                if (d) {
                    return "black";
                } else {
                    return "white";
                }
            })
            .attr("x", function(d, i) {
                return i * (squareSize + squarePadding);
            })
            .attr("y", y * (squareSize + squarePadding))
            .attr("width", squareSize)
            .attr("height", squareSize)
            .attr("class", "square row" + y);
    }

    function setupButtons(svg) {
        setupPreviousButton(svg);
        setupResetButton(svg);
        setupPlayButton(svg);
        setupPauseButton(svg);
        setupNextButton(svg);
    }

    function setupPreviousButton(svg) {
        var previous = document.getElementById("previous-button");
        previous.onclick = function() {
            if (simStep >= 1) {
                simStep--
            } else {
                console.log("Can't go farther back in simulation.");
            }
            updateBoard(svg);
        };
    }

    function setupResetButton(svg) {
        var reset = document.getElementById("reset-button");
        reset.onclick = function() {
            simStep = 0;
            updateBoard(svg);
        };
    }

    var playSimInterval = 0;
    var playFreq = 500;
    function setupPlayButton(svg) {
        var play = document.getElementById("play-button");
        play.onclick = function() {
            playSimInterval = setInterval(
                    function () {
                        if (simStep >= dataset.length - 1) {
                            clearInterval(playSimInterval);
                        }
                        incrementStep(svg);
                    },
                    playFreq);
            updateBoard(svg);
        };
    }

    function setupPauseButton(svg) {
        var pause = document.getElementById("pause-button");
        pause.onclick = function() {
            play_sim = false;
            clearInterval(playSimInterval);  // stop
            updateBoard(svg);
        };
    }

    function setupNextButton(svg) {
        var next = document.getElementById("next-button");
        next.onclick = function () {
            incrementStep(svg);
        };
    }
    function incrementStep(svg) {
        if (simStep + 1 < dataset.length) {
            simStep++;
        } else {
            console.log("Can't go farther.");
        }
        updateBoard(svg);
    }

    function updateBoard(svg) {
        var rects = svg.selectAll("rect");
        state = dataset[simStep];
        for (var y = 0; y < state.length; y++) {
            updateRow(rects, y);
        }
        updateDisplay();
    }

    function updateRow(rectSelection, y) {
        var rowRects = rectSelection.filter(".square").filter(".row" + y)
            .data(state[y])
        rowRects.attr("fill", function(d) {
                if (d) {
                    return "black";
                } else {
                    return "white";
                }
            })
    }

    function updateDisplay() {
        var display = d3.select(".display");
        $("h2.display").text("Step: " + simStep);
    }

})();
