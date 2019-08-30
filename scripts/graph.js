var data = [
  {'x':42,'y':42,'r':20,'fill':"green"},
  {'x':32,'y':33,'r':30,'fill':"tomato"},
  {'x':45,'y':76,'r':24,'fill':"cyan"},
  {'x':68,'y':72,'r':55,'fill':"purple"},
  {'x':24,'y':73,'r':32,'fill':"black"},
  {'x':82,'y':65,'r':70,'fill':"red"}
]; //filler data, cambiar a un tsv 


/*
 *Objeto global con la configuración global actual del plot
 */
var configOp = {
  "fig" : d3.symbolCircle
}

/* Escalas de visualizacion, el rango se controla con los sliders*/
var x = d3.scaleLinear()
           .domain([0,d3.max(data,d=>{return d.x;})])
           .range([0,400]);
var xAx = d3.axisBottom(x);
var y = d3.scaleLinear()
           .domain([0,d3.max(data,d=>{return d.y;})])
           .range([400,0]);
var yAx = d3.axisLeft(y);

/*Ajsta las propiedades del canvas/plot*/
var canvas = d3.select(".chart")
               .attr("width","840px")
               .attr("height","440px")
               .attr("viewbox","0 0 840 440");

/*un backgrpund para ver el tamaño real del canvas, posteriormente se elimina y queda el background del div que lo contiene*/
canvas.append("rect")
  .classed("back",true)
  .attr("width","100%")
  .attr("height","100%")
  .attr("fill","lightcyan"); //esto para tener un background, para ref visual


/*
 *Esta función se encarga de crear y graficar el plot inicialmente
 *Todo cambio posterior se realiza por medio de joins
 */
function grafica(){
  var symbol = d3.symbol();
  d3.select(".chart").selectAll('path')
   .data(data)
   .enter()
    .append('path')
      .classed("gliph",true)
      .style("cursor","pointer")
      .attr("transform",d=>{return "translate("+(x(d.x)+20)+","+(y(d.y)+20)+")"})
      .attr("fill",d=>{return d.fill?d.fill:"blue"})
      .attr("d",symbol.type(d=>{return configOp['fig']}).size(d=>{return d.r*64}))
      .attr("onclick",(d,i)=>{return "info("+i+")"});//este alert es temporal, se cambia a una función que permita editar el elemento 
  d3.select(".chart").append("g").classed('xAxis',true).call(xAx).attr("transform", "translate(20,420)");  
  d3.select(".chart").append("g").classed('yAxis',true).call(yAx).attr("transform", "translate(20,20)");
}

/*controller del slider x*/
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
           .attr("d",symbol.type(d=>{return configOp['fig']}).size(d=>{return d.r*64}));
}
/*Los callbacks del dropdown*/
$("#a_rectangulos").on("click", ()=>{cambio(d3.symbolSquare);});
$("#a_burbujas").on("click", ()=>{cambio(d3.symbolCircle);});
$("#a_glifos").on("click", ()=>{cambio(d3.symbolWye);});

function info(index){
  var template = $('#info-template').html();
  Mustache.parse(template);
  var render = Mustache.render(template,data[index]);
  $('#info').html(render);
  $('#info').show();
}


grafica();
