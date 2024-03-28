const buttonIniciarSesion = document.getElementById("boton-iniciar-sesion");
const campoUsuario = document.getElementById("campo-usuario");
const campoPassword = document.getElementById("campo-password");
const aviso = document.querySelector(".aviso");

const error_defs = {
    USER_NOT_FOUND: "Funcionario no encontrado.",
    INVALID_PASSWORD: "Contraseña no válida.",
    NO_CREDENTIALS: "No has ingresado ningún parámetro."
};

buttonIniciarSesion.addEventListener("click", e => {
    $.ajax({
        type: "GET",
        url: "/api/user",
        data: {
            userPrompt: campoUsuario.value,
            pwdPrompt: campoPassword.value
        },
        success: function () {
            window.location.href = `/panel/${campoUsuario.value}`;
        },
        error: function (err) {
            console.log(err.responseText)
            aviso.querySelector(".aviso-texto").innerHTML = error_defs[err.responseText];
            aviso.classList.add("aviso-activo");
        }
    });
});

aviso.addEventListener("click", () => {
    aviso.classList.remove("aviso-activo");
});