(function()
{

    var _create_fn = function(){};
    var create = function(parent){

        _create_fn.prototype = parent;
        var instance = new _create_fn();
        return instance;
    };

    var global = (function(){return this;})();

    const dataset = JSON.parse(data);
    const BOARD_HEIGHT = 8;
    const BOARD_WIDTH = 8;
    const SQUARE_SIZE = 50; // pixels


    var simStep = 0;
    var state = dataset[simStep];
    console.log(dataset);

    var squarePadding = 1;
    var w = BOARD_HEIGHT * (SQUARE_SIZE + squarePadding);
    var h = BOARD_HEIGHT * (SQUARE_SIZE + squarePadding);


    var resultsId = "results";
    global.onload = function(){
        createBoard(resultsId, "Results");
        setupButtons();
    };

    function createBoard(idName, title) {
        var searchString = ".board#" + idName;
        d3.select(searchString).append("h3").text(title);

        var svg = d3.select(searchString)
            .append("svg")
            .attr("width", w)
            .attr("height", h);

        var rects = svg.selectAll("rect")
        for (var y = 0; y < state.length; y++) {
            addRow(rects, y, idName);
        }
    }
    function updateCell(d) {
        var value = 255 - Math.round(255 * d / 1.2);
        return "rgb(" + value + "," + value + "," + value + ")";
    }

    function addRow(rects, y, idName) {
        rects.data(state[y])
            .enter()
            .append("rect")
            .attr("fill", updateCell)
            .attr("x", function(d, i) {
                return i * (SQUARE_SIZE + squarePadding);
            })
            .attr("y", y * (SQUARE_SIZE + squarePadding))
            .attr("width", SQUARE_SIZE)
            .attr("height", SQUARE_SIZE)
            .attr("class", idName + " square row" + y);
    }

    function setupButtons() {
        setupPreviousButton();
        setupResetButton();
        setupPlayButton();
        setupPauseButton();
        setupNextButton();
    }

    function setupPreviousButton() {
        var previous = document.getElementById("previous-button");
        previous.onclick = function() {
            if (simStep >= 1) {
                simStep--
            } else {
                console.log("Can't go farther back in simulation.");
            }
            updateBoards();
        };
    }

    function setupResetButton() {
        var reset = document.getElementById("reset-button");
        reset.onclick = function() {
            simStep = 0;
            updateBoards();
        };
    }

    var playSimInterval = 0;
    var playFreq = 5;
    function setupPlayButton() {
        var play = document.getElementById("play-button");
        play.onclick = function() {
            playSimInterval = setInterval(
                    function () {
                        if (simStep >= dataset.length - 1) {
                            clearInterval(playSimInterval);
                        }
                        incrementStep();
                    },
                    playFreq);
            updateBoards();
        };
    }

    function setupPauseButton() {
        var pause = document.getElementById("pause-button");
        pause.onclick = function() {
            play_sim = false;
            clearInterval(playSimInterval);  // stop
            updateBoards();
        };
    }

    function setupNextButton() {
        var next = document.getElementById("next-button");
        next.onclick = function () {
            incrementStep();
        };
    }
    function incrementStep() {
        if (simStep + 1 < dataset.length) {
            simStep++;
        } else {
            console.log("Can't go farther.");
        }
        updateBoards();
    }

    function updateBoards() {
        updateResultsBoard();
        updateDisplay();
    }

    function updateResultsBoard() {
        var svg = d3.select(".board#" + resultsId);
        var rects = svg.selectAll("rect");
        state = dataset[simStep];
        for (var y = 0; y < state.length; y++) {
            updateRow(rects, y);
        }
    }

    function updateRow(rectSelection, y) {
        var rowRects = rectSelection.filter(".square").filter(".row" + y)
            .data(state[y])
        rowRects.attr("fill", updateCell);
    }

    function updateDisplay() {
        var display = d3.select(".display");
        $("h2.display").text("Step: " + simStep);
    }
})();
