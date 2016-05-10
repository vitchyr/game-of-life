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

        var svg = d3.select("body").append("svg");
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
    };
})();
