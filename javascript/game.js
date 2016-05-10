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
            .attr("class", "square row-" + y);
    }

    function createBoard(svg, simStep) {
        console.log("Create Board");
        console.log(state);
        var rects = svg.selectAll("rect")
        for (var y = 0; y < state.length; y++) {
            addRow(rects, y);
        }
    }

    function updateRow(allRects, y) {
        var rects = allRects.selectAll("square .row-" + y)
            .data(state[y])
        rects.attr("fill", function(d) {
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
            .attr("class", "square");
    }
    function updateBoard(svg) {
        console.log("Update Board");
        console.log(state);
        var rects = svg.selectAll("rect")
        for (var y = 0; y < state.length; y++) {
            updateRow(rects, y);
        }
    }

    global.onload = function(){
        var svg = d3.select(".board")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

        createBoard(svg);

        var next = document.getElementById("next-button");
        next.onclick = function() {
            if (simStep + 1 < dataset.length) {
                simStep++;
            } else {
                console.log("Can't go farther.");
            }
            state = dataset[simStep];
            updateBoard(svg);
        };

        var previous = document.getElementById("previous-button");
        previous.onclick = function() {
            if (simStep > 1) {
                simStep--
            } else {
                console.log("Can't go farther back in simulation.");
            }
            state = dataset[simStep];
            updateBoard(svg);
        };
    };
})();
