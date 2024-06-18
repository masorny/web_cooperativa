$(".session-caption").click(function(e) {
    $(".session-options").toggleClass("hidden");
});

$(".session-options-button").click(function(e) {
    $(".session-options").addClass("hidden");

    const index = $(".session-options .session-options-button").index(e.target);

    const Botones = {
        /* MiPerfil: 0, */
        Configuracion: 0,
        CerrarSesion: 1
    }

    switch(index) {
        case Botones.MiPerfil:
            window.location.href = "/perfil";
            break;
        case Botones.Configuracion:
            window.location.href = "/configuracion";
            break;
        case Botones.CerrarSesion:
            $.ajax({
                type: "post",
                url: "/salir",
                success: () => window.location.href = "/"
            });
            break;
    }
});

$(".boton-primeropaso-confirmar").click(function(e) {
    const apodo = $("#campo-primeropaso-apodo").val();

    $.ajax({
        type: "post",
        url: "/primerpaso",
        data: {
            apodo
        },
        success: () => window.location.href = "/inicio"
    });
});

$(".boton-primeropaso-cancelar").click(function(e) {
    $.ajax({
        type: "post",
        url: "/salir",
        success: () => window.location.href = "/"
    });
});

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

filterInput( $("#campo-primeropaso-apodo"), /^[A-Za-z0-9 ]+$/g );