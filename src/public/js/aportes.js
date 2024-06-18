function recuperarAportes() {
    const busqueda = $("#socio-aporte-busqueda").val();
    
    $.ajax({
        type: "GET",
        url: "/obtenerAporte",
        data: { busqueda: busqueda.replace(/ +/g, "%") },
        success: function(html) {
            $(".resultado-aportes").html(html);
        }
    });
}

$("#socio-aporte-buscar").click(recuperarAportes);
$(document.body).keypress(function(e) {
    try {
        if (e.key == "Enter") {
            recuperarAportes();
        }
    }
    catch {}
});

$("#socio-aporte-crear").click(function(e) {
    $.ajax({
        type: "get",
        url: "/api/socios",
        success: function(socios) {
            $("#socio-select").html(socios.map(socio => `<option value="${socio.Id_socio}">${socio.nombre}, ${socio.apellido}</option>`).join(""))
        }
    });

    $(".window-aporte").removeClass("hidden");
});

$(".window-aporte .window-title button").click(function(e) {
    $(".window-aporte").addClass("hidden");
});

try {
    recuperarAportes();
}
catch {}