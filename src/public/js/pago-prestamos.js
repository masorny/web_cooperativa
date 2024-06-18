function recuperarPagoPrestamos() {
    const busqueda = $("#socio-pago-prestamo-busqueda").val();
    
    $.ajax({
        type: "GET",
        url: "/obtenerPagoPrestamo",
        data: { busqueda: busqueda.replace(/ +/g, "%") },
        success: function(html) {
            $(".resultado-pago-prestamos").html(html);
        }
    });
}

$("#socio-pago-prestamo-buscar").click(recuperarPagoPrestamos);
$(document.body).keypress(function(e) {
    try {
        if (e.key == "Enter") {
            recuperarPagoPrestamos();
        }
    }
    catch {}
})

// socio-pago-prestamo-crear
$("#socio-pago-prestamo-crear").click(function(e) {
    $.ajax({
        type: "get",
        url: "/api/socios",
        success: function(socios) {
            $("#socio-pago-prestamo-select").html(socios.map(socio => `<option value="${socio.Id_socio}">${socio.nombre}, ${socio.apellido}</option>`).join(""));
        }
    })

    $(".window-pago").removeClass("hidden");
});

$("#socio-pago-prestamo-select").change(function(e) {
    $.ajax({
        type: "get",
        url: "api/socioPrestamo",
        data: {
            id: $("#socio-pago-prestamo-select").val()
        },
        success: function(prestamos) {
            $("#socio-prestamo-disponible").html(prestamos.map(prestamo => `<option value="${prestamo.Id_prestamo}">[Gs. ${prestamo.Monto}] ${prestamo.Tipo_prestamo}</option>`).join(""));
        }
    })
});

$(".window-pago .window-title button").click(function(e) {
    $(".window-pago").addClass("hidden");
});

try {
    recuperarPagoPrestamos();
}
catch {}