import { getParentElement } from "./utils/elementUtils.js";

$(".boton-ver-funcionario").click(function(e) {
    const el = getParentElement(".boton-ver-funcionario", e.target);
    const id = $(el).attr("id");

    $.ajax({
        type: "get",
        url: "/api/funcionario",
        data: { id },
        success: function(data) {
            console.log(data);

            $("#funcionario-edit-autorizacion").val(data.cod_autorizacion);
            $("#funcionario-edit-nombre").val(data.nombre);
            $("#funcionario-edit-alias").val(data.apodo);

            $(".window-funcionario").removeClass("hidden");
        }
    });
});

$(".window-title button").click(function(e) {
    $(".window-funcionario").addClass("hidden");
});