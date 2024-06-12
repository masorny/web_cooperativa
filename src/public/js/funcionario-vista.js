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

            $("#funcionario-edit-estado").val(data.estado);

            $(".window-funcionario").removeClass("hidden");
        }
    });
});

$(".boton-crear-funcionario").click(function(e) {
    $.ajax({
        type: "get",
        url: "/api/crearfuncionario",
        success: function(cod_autorizacion) {
            const label = "<Cierra sesion y registrate con el Cod. Autorizacion>";

            $("#funcionario-edit-autorizacion").val(cod_autorizacion);
            $("#funcionario-edit-nombre").prop("placeholder", label);
            $("#funcionario-edit-alias").prop("placeholder", label);

            $("#funcionario-edit-estado").val(1);

            $("#funcionario-edit-pwd").prop("placeholder", label);

            $("#funcionario-edit-autorizacion").prop("disabled", true);
            $("#funcionario-edit-nombre").prop("disabled", true);
            $("#funcionario-edit-alias").prop("disabled", true);
            $("#funcionario-edit-pwd").prop("disabled", true);

            $(".window-funcionario").removeClass("hidden");
        }
    });
});

$(".window-title button").click(function(e) {
    $(".window-funcionario").addClass("hidden");
});

$(".funcionario-edit-imagen").click(function(e) {
    const el = document.createElement("input");
    el.type = "file";
    el.accept = "image/*";

    el.onchange = (e) => {
        const file = el.files[0];

        $(".funcionario-edit-imagen img").attr("src", URL.createObjectURL(file));
    }

    el.click();
});