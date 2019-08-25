/*Funciones*/ 
function menuEsconder(){
  $(".dropdown-content").hide();
  /*jQuery power baby*/
  /*
  var dropdowns = document.getElementsByClassName("dropdown-content");
  for (var i = 0; i < dropdowns.length; i++) {
    var openDropdown = dropdowns[i];
    openDropdown.hide();
    if (openDropdown.classList.contains('show')) {
      openDropdown.classList.remove('show');
    }
  }
  */
}

function botonOpciones() { 
  menuEsconder();
  $("#tipoDato").show();
}

function botonGraficos(){
  menuEsconder();
  $("#tipoGrafico").show();
}
function botonEfectos(){
  menuEsconder();
  $("#tipoEfecto").show();
}
  
/* Desactiva el menu al seleccionar otra parte */
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    menuEsconder();
  }
}