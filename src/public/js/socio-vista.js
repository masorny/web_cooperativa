import { getParentElement } from "./utils/elementUtils.js";

$(".boton-ver-socio").click(function(e) {
    const el = getParentElement(".boton-ver-socio", e.target);
    const id = $(el).attr("id");

    $.ajax({
        type: "get",
        url: "/api/socio",
        data: {
            id
        },
        success: function(data) {
            $(".window-socio #socio-edit-nombre").val(data.nombre);
            $(".window-socio #socio-edit-apellido").val(data.apellido);
            $(".window-socio #socio-edit-direccion").val(data.direccion);
            $(".window-socio #socio-edit-ciudad").val(data.ciudad);
            $(".window-socio #socio-edit-cedula").val(data.cedula);
            $(".window-socio #socio-edit-correo").val(data.correo);
            $(".window-socio #socio-edit-telefono").val(data.telefono);

            $(".window-socio").removeClass("hidden");
        }
    })
});

$(".window-socio .window-title button").click(function(e) {
    $(".window-socio").addClass("hidden");
});