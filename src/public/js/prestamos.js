function recuperarPrestamos() {
    const busqueda = $("#socio-prestamo-busqueda").val();
    
    $.ajax({
        type: "GET",
        url: "/obtenerPrestamo",
        data: { busqueda: busqueda.replace(/ +/g, "%") },
        success: function(html) {
            $(".resultado-prestamos").html(html);
        }
    });
}

$("#socio-prestamo-buscar").click(recuperarPrestamos);
$(document.body).keypress(function(e) {
    try {
        if (e.key == "Enter") {
            recuperarPrestamos();
        }
    }
    catch {}
});

$("#socio-prestamo-crear").click(function(e) {
    $.ajax({
        type: "get",
        url: "/api/socios",
        success: function(socios) {
            $("#socio-prestamo-select").html(socios.map(socio => `<option value="${socio.Id_socio}">${socio.nombre}, ${socio.apellido}</option>`).join(""));
        }
    })

    $(".window-prestamo").removeClass("hidden");
});

$(".window-prestamo .window-title button").click(function(e) {
    $(".window-prestamo").addClass("hidden");
});

try {
    recuperarPrestamos();
}
catch {}