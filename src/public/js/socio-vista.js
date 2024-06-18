import { getParentElement } from "./utils/elementUtils.js";

/**
 * Filters an input text value.
 * @param {HTMLInputElement} inputEl Input element target.
 * @param {RegExp} regExMatcher RegExp evaluator to filter.
 */
function filterInput(inputEl, regExMatcher = "") {
    var input = $(inputEl),
        prevVal = input.val() || '';

    input.on("input", function(e) {
        e.preventDefault();

        const newVal = input.val();

        if (newVal == "") {
            return prevVal = "";
        }

        if (!input.val().match(regExMatcher)) {
            return input.val(prevVal);
        }

        prevVal = newVal;
    });
}

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
            $("#socio-edit-id").val(data.Id_socio);

            $(".window-socio #socio-edit-nombre").val(data.nombre);
            $(".window-socio #socio-edit-apellido").val(data.apellido);
            $(".window-socio #socio-edit-direccion").val(data.direccion);
            $(".window-socio #socio-edit-ciudad").val(data.ciudad);
            $(".window-socio #socio-edit-cedula").val(data.cedula);
            $(".window-socio #socio-edit-correo").val(data.correo);
            $(".window-socio #socio-edit-telefono").val(data.telefono);

            filterInput("#socio-edit-nombre", /^[A-Za-z0-9 ]+$/g);
            filterInput("#socio-edit-apellido", /^[A-Za-z0-9 ]+$/g);
            filterInput("#socio-edit-direccion", /^[A-Za-z0-9 .]+$/g);
            filterInput("#socio-edit-ciudad", /^[A-Za-z ]+$/g);
            filterInput("#socio-edit-cedula", /^[0-9]+$/g);
            filterInput("#socio-edit-telefono", /^[0-9]+$/g);

            $(".window-socio").removeClass("hidden");
        }
    })
});

$(".boton-crear-socio").click(function(e) {
    $("#socio-edit-id").val(-1);
    $(".window-socio #socio-edit-nombre").val("");
    $(".window-socio #socio-edit-apellido").val("");
    $(".window-socio #socio-edit-direccion").val("");
    $(".window-socio #socio-edit-ciudad").val("");
    $(".window-socio #socio-edit-cedula").val("");
    $(".window-socio #socio-edit-correo").val("");
    $(".window-socio #socio-edit-telefono").val("");

    filterInput("#socio-edit-nombre", /^[A-Za-z0-9 ]+$/g);
    filterInput("#socio-edit-apellido", /^[A-Za-z0-9 ]+$/g);
    filterInput("#socio-edit-direccion", /^[A-Za-z0-9 .]+$/g);
    filterInput("#socio-edit-ciudad", /^[A-Za-z ]+$/g);
    filterInput("#socio-edit-cedula", /^[0-9]+$/g);
    filterInput("#socio-edit-telefono", /^[0-9]+$/g);

    $(".window-socio").removeClass("hidden");
});

$(".window-socio .window-title button").click(function(e) {
    $(".window-socio").addClass("hidden");
});