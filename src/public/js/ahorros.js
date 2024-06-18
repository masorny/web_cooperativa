function recuperarAhorros() {
    const busqueda = $("#socio-ahorro-busqueda").val();
    
    $.ajax({
        type: "GET",
        url: "/obtenerAhorro",
        data: { busqueda: busqueda.replace(/ +/g, "%") },
        success: function(html) {
            $(".resultado-ahorros").html(html);
        }
    });
}

$("#socio-ahorro-buscar").click(recuperarAhorros);
$(document.body).keypress(function(e) {
    try {
        if (e.key == "Enter") {
            recuperarAhorros();
        }
    }
    catch {}
})

$("#socio-ahorro-crear").click(function(e) {
    $.ajax({
        type: "get",
        url: "/api/socios",
        success: function(socios) {
            $("#socio-ahorro-select").html(socios.map(socio => `<option value="${socio.Id_socio}">${socio.nombre}, ${socio.apellido}</option>`).join(""));
        }
    })

    $(".window-ahorro").removeClass("hidden");
});

$(".window-ahorro .window-title button").click(function(e) {
    $(".window-ahorro").addClass("hidden");
});

try {
    recuperarAhorros();
}
catch {}