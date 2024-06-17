$("#socio-aporte-buscar").click(function(e) {
    const busqueda = $("#socio-aporte-busqueda").val();

    $.ajax({
        type: "GET",
        url: "/obtenerAporte",
        data: { busqueda },
        success: function(html) {
            $(".resultado-aportes").html(html);
        }
    });
});