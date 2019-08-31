var colores = {
  'San Jose':'#0000ff',
  'Cartago':'#ff00ff',
  'Alajuela':'#ff000f',
  'Puntarenas':'#00ff00',
  'Limon':'#0f0f00',
  'Guanacaste':'#ffff00',
  'Heredia':'#00ffff',
}

var data, x, y, xAx, yAx;
d3.csv('estadisticas.csv',(d)=>{
  return {
    canton:d.Canton,
    area:+d.Area,
    poblacion:+d.Poblacion,
    densidad:+d.Densidad,
    provincia: d.Provincia,
    fill: (d.Provincia?colores[d.Provincia]:"#000000")}
  }).then((d)=>{
    data=d;
    /* Escalas de visualizacion, el rango se controla con los sliders*/
    x = d3.scaleLinear()
           .domain([0,d3.max(data,d=>{return d.area;})])
           .range([0,780]);
    xAx = d3.axisBottom(x);
    y = d3.scaleLinear()
           .domain([0,d3.max(data,d=>{return d.densidad;})])
           .range([400,0]);
    yAx = d3.axisLeft(y);
    grafica(data);
  });
/*
var data = [
  {'x':42,'y':42,'r':20,'fill':"green"},
  {'x':32,'y':33,'r':30,'fill':"tomato"},
  {'x':45,'y':76,'r':24,'fill':"cyan"},
  {'x':68,'y':72,'r':55,'fill':"purple"},
  {'x':24,'y':73,'r':32,'fill':"black"},
  {'x':82,'y':65,'r':70,'fill':"red"}
]; //filler data, cambiar a un tsv 
*/
/*
 *Objeto global con la configuración global actual del plot
 */
var configOp = {
  "fig" : d3.symbolCircle,
  "size" : 0.01
}

var zoom = d3.zoom()
      .scaleExtent([.5, 20])  // This control how much you can unzoom (x0.5) and zoom (x20)
      .extent([[0, 0], [800, 420]])
      .on("zoom", updateChart);


/*Ajsta las propiedades del canvas/plot*/
var canvas = d3.select(".chart")
               .attr("width","840px")
               .attr("height","440px")
               .attr("viewbox","0 0 840 440")
               .call(zoom);

/*un backgrpund para ver el tamaño real del canvas, posteriormente se elimina y queda el background del div que lo contiene*/
canvas.append("rect")
  .classed("back",true)
  .attr("width","100%")
  .attr("height","100%")
  .attr("fill","lightcyan"); //esto para tener un background, para ref visual

$('#leyenda').html(Mustache.render(
`<div class="card-header"><h4>Colores por provincia</h4></div>
<div class="card-body">
<div style="background-color:{{San Jose}}" class="color-text"><label style="color:#ffffff;opacity:1">San Jose</label></div>
<div style="background-color:{{Alajuela}}" class="color-text"><label style="color:#000000;opacity:1">Alajuela</label></div>
<div style="background-color:{{Cartago}}" class="color-text"><label style="color:#000;opacity:1">Cartago</label></div>
<div style="background-color:{{Heredia}}" class="color-text"><label style="color:#000;opacity:1">Heredia</label></div>
<div style="background-color:{{Limon}}" class="color-text"><label style="color:#ffffff;opacity:1">Limon</label></div>
<div style="background-color:{{Puntarenas}}" class="color-text"><label style="color:#000;opacity:1">Puntarenas</label></div>
<div style="background-color:{{Guanacaste}}" class="color-text"><label style="color:#000;opacity:1">Guanacaste</label></div>
`,colores)
);

/*
 *Esta función se encarga de crear y graficar el plot inicialmente
 *Todo cambio posterior se realiza por medio de joins
 */
function grafica(data){
  console.log(data);
  var symbol = d3.symbol();
  d3.select(".chart").selectAll('path')
   .data(data)
   .enter()
    .append('path')
      .classed("gliph",true)
      .style("cursor","pointer")
      .attr("title",d=>{return d.canton})
      .attr("transform",d=>{return "translate("+(x(d.area)+40)+","+(y(d.densidad)+20)+")"})
      .attr("fill",d=>{return d.fill?d.fill:"blue"})
      .attr("d",symbol.type(d=>{return configOp['fig']}).size(d=>{return d.poblacion*configOp['size']}))
      .attr("onclick",(d,i)=>{return "info("+i+")"}); 
  d3.select(".chart").append("g").classed('xAxis',true).call(xAx).attr("transform", "translate(40,420)");
  d3.select(".chart").append("text").classed('xAxLabel',true).attr("text-anchor","end").attr('x',820).attr('y',420).text('Area');
  d3.select(".chart").append("g").classed('yAxis',true).call(yAx).attr("transform", "translate(40,20)");
  d3.select(".chart").append("text").classed('yAxLabel',true)
    .attr("text-anchor","end")
    .attr('transform','rotate(90)')
    .attr('x',90)
    .attr('y',-45)
    .text('Densidad');
  $('.gliph').tooltip({
    'container':'body',
    'placement':'top'
  });
}

function updateChart(){
  var newX = d3.event.transform.rescaleX(x);
  var newY = d3.event.transform.rescaleY(y);

  // update axes with these new boundaries
  canvas.selectAll('.xAxis').call(d3.axisBottom(newX))
  canvas.selectAll('.yAxis').call(d3.axisLeft(newY))
    // update circle position
  canvas
    .selectAll(".gliph").data(data)
    .attr("transform",d=>{return "translate("+(newX(d.area)+40)+","+(newY(d.densidad)+20)+")"})
    /*.attr('cx', function(d) {return newX(d.Sepal_Length)})
    .attr('cy', function(d) {return newY(d.Petal_Length)})
    */;
}

/*controller del slider x
$("#xslider").on("input", function(){
  x.range([0,this.value]);
  canvas.selectAll('.gliph')
    .data(data).attr("transform",d=>{return 'translate('+(x(d.x)+20)+','+(y(d.y)+20)+')'});
  canvas.selectAll('.xAxis').call(xAx);
});

$("#yslider").on("input", function(){
  y.range([this.value,0]);
  canvas.selectAll('.gliph')
    .data(data).attr("transform",d=>{return 'translate('+(x(d.x)+20)+','+(y(d.y)+20)+')'});
  canvas.selectAll('.yAxis').call(yAx);
});*/
$('#sizeSlider').on("input",function(){
  console.log(this.value);
  configOp['size']=this.value/1000.;
  canvas.selectAll('.gliph')
    .data(data).attr("d",d3.symbol().type(d=>{return configOp['fig']}).size(d=>{return d.poblacion*configOp['size']}));
});
/*
 *Esta funcion se ecnrga de actualizar el grafo al nuevo simbolo electo del dropdown
 */
function cambio(nuevo){
  if(configOp['fig']===nuevo) return;
  var viejo = configOp['fig'];
  configOp['fig']=nuevo;
  var symbol = d3.symbol();
  canvas.selectAll('.gliph')
          .data(data)
           .attr("d",symbol.type(d=>{return configOp['fig']}).size(d=>{return d.poblacion*configOp['size']}));
}
/*Los callbacks del dropdown*/
$("#a_rectangulos").on("click", ()=>{cambio(d3.symbolSquare);});
$("#a_burbujas").on("click", ()=>{cambio(d3.symbolCircle);});
$("#a_glifos").on("click", ()=>{cambio(d3.symbolWye);});

function info(index){
  var template = $('#info-template').html();
  Mustache.parse(template);
  var d=data[index];
  d.i=index;
  var render = Mustache.render(template,d);
  $('#info').html(render);
  $('#info').show();
  $('#idColor').on('input', function(){
    data[index].fill=(this.value);
    canvas.selectAll('.gliph')
      .data(data)
        .attr("fill",d=>{return d.fill});
  });
}

$(document).ready(function () {
  console.log("ready");
})
