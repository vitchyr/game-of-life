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
    const SQUARE_SIZE = 40; // pixels

    var expectedDataSet = getExpectedDataset(dataset);
    function getExpectedDataset(dataset) {
        var expected = new Array(dataset.length);
        // This copies a reference, but it's okay because the data is constant
        expected[0] = dataset[0];
        return fillOutRestOfSim(expected);
    }
    function fillOutRestOfSim(gameData) {
        // Fill out the rest of the data based on
        for (var t = 1; t < gameData.length; t++) {
            gameData[t] = getNextState(gameData[t-1]);
        }
        return gameData;
    }
    function getNextState(lastState) {
        var newState = getEmptyState();
        for (var y = 0; y < BOARD_WIDTH; y++) {
            for (var x = 0; x < BOARD_WIDTH; x++) {
                newState[y][x] = getNextCellState(lastState, x, y);
            }
        }
        return newState;
    }
    function getNextCellState(lastState, x, y) {
        var isAlive = lastState[y][x];
        var numNeighborsAlive = getNumberNeighborsAlive(lastState, x, y);
        if (isAlive) {
            if (numNeighborsAlive < 2) {
                return 0;
            } else if (numNeighborsAlive == 2 || numNeighborsAlive == 3) {
                return 1;
            } else {
                return 0;
            }

        } else {
            return numNeighborsAlive == 3 ? 1 : 0;
        }
    }
    function getNumberNeighborsAlive(lastState, x, y) {
        var num = -getValue(lastState, x, y);
        for (var dx = -1; dx < 2; dx++) {
            for (var dy = -1; dy < 2; dy++) {
                num += getValue(lastState, x + dx, y + dy);
            }
        }
        return num;
    }
    function getValue(lastState, x, y) {
        if (x < 0 || x >= BOARD_WIDTH) {
            return 0;
        }
        if (y < 0 || y >= BOARD_HEIGHT) {
            return 0;
        }
        return lastState[y][x];
    }
    function getEmptyState() {
        var array = new Array(BOARD_HEIGHT);
        for (var i = 0; i < BOARD_HEIGHT; i++) {
            array[i] = new Array(BOARD_WIDTH);
        }
        return array;
    }

    var simStep = 0;
    var state = dataset[simStep];

    var squarePadding = 1;
    var w = BOARD_HEIGHT * (SQUARE_SIZE + squarePadding);
    var h = BOARD_HEIGHT * (SQUARE_SIZE + squarePadding);


    var resultsId = "results";
    var expectedId = "expected";
    global.onload = function(){
        createBoard(resultsId, "Results");
        createBoard(expectedId, "Expected");
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

    function addRow(rects, y, idName) {
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
    var playFreq = 500;
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
        updateExpectedBoard();
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

    function updateExpectedBoard() {
        var svg = d3.select(".board#" + expectedId);
        var rects = svg.selectAll("rect");
        state = expectedDataSet[simStep];
        for (var y = 0; y < state.length; y++) {
            updateRow(rects, y);
        }
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
