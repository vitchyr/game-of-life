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
    console.log(dataset[0]);

    global.onload = function(){
        var dataset = [ 5, 10, 15, 20, 25 ];
        d3.select("body").selectAll("p")
            .data(dataset)
            .enter()
            .append("p")
            .text(function(d) { return d; });

        var w = 500;
        var h = 50;

        var svg = d3.select("body")
            .append("svg")
            .attr("width", w)
            .attr("height", h);
        var circles = svg.selectAll("circle")
            .data(dataset)
            .enter()
            .append("circle")
        circles.attr("cx", function(d, i) {
                return (i*50) + 25;
            })
            .attr("cy", h/2)
            .attr("r", function(d) {
                return d;
            })
            .attr("fill", "red");

        d3.select("body").append("br");
        d3.select("body").append("br");
        // Make a bar chat tutorial
        h = 50;
        var barPadding = 1;
        var svg = d3.select("body")
            .append("svg")
            .attr("width", w)
            .attr("height", h);
        svg.selectAll("rect")
            .data(dataset)
            .enter()
            .append("rect")
            .attr("x", function(d, i) {
                return i * w / dataset.length;
            })
            .attr("y", function (d) {
                return h - d;
            })
            .attr("width", w / dataset.length - barPadding)
            .attr("height", function (d) {
                return 2 * d;
            })
            .attr("fill", function (d) {
                return "rgb(0, 0, " + (d * 10) + ")";
            });

        svg.selectAll("text")
            .data(dataset)
            .enter()
            .append("text")
            .text(function (d) {
                return d;
            })
            .attr("text-anchor", "middle")
            .attr("x", function(d, i) {
                return i * w / dataset.length + (w / dataset.length - barPadding) / 2;
            })
            .attr("y", function (d) {
                return h - d;
            })
            .attr("font-family", "sans-serif")
            .attr("font-size", "14px")
            .attr("fill", "red");
    };
})();
