// El usuario tocó el boton "INICIAR SESION"
// Validar datos desde el servidor.
$("#boton-iniciar-sesion").click(function(e) {
    const datosAEnviar = {
        userPrompt: $("#campo-usuario").attr("value"), 
        pwdPrompt: $("campo-password").attr("value")
    };

    $.ajax({
        type: "GET",
        url: "/api/user",
        data: datosAEnviar,
        success: enviarAlPanel,
        error: mostrarError
    });
});

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
    $(".aviso-texto", ".aviso").html(error_defs[err.responseText]);
    $(".aviso").addClass("aviso-activo");
}