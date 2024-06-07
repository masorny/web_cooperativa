// El usuario hizo click en el aviso de error.
// Remueve el aviso de la pantalla.
$(".aviso").click(function () {
    $(".aviso").removeClass("aviso-activo");
});

// Si las credenciales son validadas, irse al panel.
function enviarAlPanel() {
    window.location.href = `/panel/${ $("#campo-usuario").attr("value") }`;
}

// Muestra el aviso de error en la pantalla de login
function mostrarError(err) {
    $(".aviso-texto", ".aviso").html(err.responseText);
    $(".aviso").addClass("aviso-activo");
}

$(".boton-ir-registrarse").click(function(e) {
    $(".inicio-sesion").addClass("hidden")
    $(".registro-sesion").removeClass("hidden");
});

$(".boton-ir-iniciarsesion").click(function(e) {
    $(".registro-sesion").addClass("hidden");
    $(".inicio-sesion").removeClass("hidden");
});

$("#boton-iniciar-sesion").click(function(e) {
    e.preventDefault();

    const usuario = $("#campo-usuario").val(), 
        clavePass = $("#campo-password").val();

    $.ajax({
        type: "POST",
        url: "/ingreso",
        data: { usuario, clavePass },
        success: gotoDashboard,
        error: mostrarError
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

$(document.body).keypress(function(e) {
    if (e.key == "Enter") {
        $("#boton-iniciar-sesion").click();
    }
});

filterInput( $("#campo-usuario"), /^[a-zA-Z0-9]+$/g );

function gotoDashboard() {
    window.location.href = "/inicio";
}