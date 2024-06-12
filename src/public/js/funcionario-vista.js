import { getParentElement } from "./utils/elementUtils.js";

$(".boton-ver-funcionario").click(function(e) {
    const el = getParentElement(".boton-ver-funcionario", e.target);
    const id = $(el).attr("id");

    $(".window-funcionario").removeClass("hidden");
});

$(".window-title button").click(function(e) {
    $(".window-funcionario").addClass("hidden");
});