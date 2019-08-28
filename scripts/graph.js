/*
 * Mover a un archivo aparte
 */
 
var data = [
  {'x': 42,'y': 42,'r':8},
  {'x':12,'y':45,'r':10},
  {'x':56,'y':22,'r':20},
  {'x': 80,'y':90,'r':20},
  {'x':33,'y':32,'r':10,'fill':"red"}
]; //filler data, cambiar a un tsv 
/*
var container = d3.select("body").append("div").classed("svg-container",true);
var canvas = d3.select(".svg-container")
              .append("svg")
                .attr("width","400px")
                .attr("height","400px")
                .attr("color","red");
*/

var x = d3.scaleLinear()
               .domain([0,d3.max(data,d=>{return d.x;})])
               .range([0,200]);
var y = d3.scaleLinear()
  .domain([0,d3.max(data,d=>{return d.y;})])
  .range([0,200]);

var canvas = d3.select(".chart")
               .attr("width","100%")
               .attr("height","100%")
               .attr("viewbox","0 0 420 420");

canvas.append("rect")
  .attr("width","100%")
  .attr("height","100%")
  .attr("fill","chocolate"); //esto para tener un background, para ref visual

canvas.selectAll("circle")
  .data(data)
  .enter()
    .append("circle")
      .attr("transform",d=>{return "translate("+x(d.x)+','+y(d.y)+')'})
      .attr("r",d=>{return d.r})
      .attr("fill",d=>{return d.fill?d.fill:"blue"});

var xslider = document.getElementById("xslider");
xslider.oninput = function(){
  x.range([0,this.value]);
  canvas.selectAll("circle")
    .data(data).attr("transform",d=>{return "translate("+x(d.x)+','+y(d.y)+')'});
};

var yslider = document.getElementById("yslider");
yslider.oninput = function(){
  y.range([0,this.value]);
  canvas.selectAll("circle")
    .data(data).attr("transform",d=>{return "translate("+x(d.x)+','+y(d.y)+')'});
};
