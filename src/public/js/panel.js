const cerrarSesion = document.getElementById("cerrar-sesion");
const nav = document.querySelector(".container-header-navs");
const crearSocio = document.getElementById("cargar-socio");
const crearNombre = document.getElementById("crear-campo-nombre");
const crearApellido = document.getElementById("crear-campo-apellido");
const crearCedula = document.getElementById("crear-campo-cedula");
const crearDireccion = document.getElementById("crear-campo-direccion");
const crearTelefono = document.getElementById("crear-campo-telefono");
const buscarSocio = document.getElementById("buscar-socio");
const buscarCedula = document.getElementById("buscar-cedula");
const aviso = document.querySelector(".aviso");
const eliminarSocio = document.getElementById("eliminar-socio");
const aporteCedula = document.getElementById("aporte-cedula");
const aporteAporte = document.getElementById("aporte-aporte");
const aporteSaldo = document.getElementById("aporte-saldo");
const aporteFecha = document.getElementById("aporte-fechaCubierta");
const cargarAporte = document.getElementById("cargar-aporte");

document.querySelector(".header-nav").classList.add("container-header-nav-focus");

nav.addEventListener("click", (e) => {
    var el = e.target;

    if (["container-header-nav", "header-nav"].some(x => el.classList.contains(x))) {
        if (el.classList.contains("container-header-nav")) {
            el = el.querySelector(".header-nav");
        }

        document.querySelectorAll(".header-nav").forEach(el => el.classList.remove("container-header-nav-focus"));

        el.classList.add("container-header-nav-focus");

        switch(el.innerHTML) {
            case "Inicio":
                document.querySelector(".main")?.classList.add("focus");
                document.querySelector(".load")?.classList.remove("focus");
                document.querySelector(".search")?.classList.remove("focus");
                document.querySelector(".obl-societarias")?.classList.remove("focus");
                break;
            case "Cargar Socio":
                document.querySelector(".main")?.classList.remove("focus");
                document.querySelector(".load")?.classList.add("focus");
                document.querySelector(".search")?.classList.remove("focus");
                document.querySelector(".obl-societarias")?.classList.remove("focus");
                break;
            case "Buscar Socio":
                document.querySelector(".main")?.classList.remove("focus");
                document.querySelector(".load")?.classList.remove("focus");
                document.querySelector(".search")?.classList.add("focus");
                document.querySelector(".obl-societarias")?.classList.remove("focus");
                break;
            case "Obligaciones societarias":
                document.querySelector(".main")?.classList.remove("focus");
                document.querySelector(".load")?.classList.remove("focus");
                document.querySelector(".search")?.classList.remove("focus");
                document.querySelector(".obl-societarias")?.classList.add("focus");
                break;
        }
    }
})

cerrarSesion.addEventListener("click", (e) => {
    const currentUser = window.location.href.slice(window.location.href.lastIndexOf("/") + 1);

    console.log(currentUser);

    $.ajax({
        type: "GET",
        url: "/api/user-end-session",
        data: { currentUser },
        success: function (response) {
            window.location.href = "/";
        }
    });
});

function displaySelectedImage(event, elementId) {
    const selectedImage = document.getElementById(elementId);
    const fileInput = event.target;

    if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();

        reader.onload = function(e) {
            selectedImage.src = e.target.result;
        };

        reader.readAsDataURL(fileInput.files[0]);
    }
}

const error_defs = {
    MUST_SPECIFY_DATA: "No se ha podido cargar el socio debido a que falta datos por rellenar.",
    ALREADY_EXISTS: "El socio que intenta crear ya existe en<br>nuestra cooperativa.",
    DATABASE_ERROR: "Ha ocurrido un error en el servidor.",
    PARTNER_NOT_FOUND: "No se ha encontrado el socio.",
    SEARCH_NO_DNI: "Especifica la cédula.",
    NO_PARTNER_AVAILABLE: "No se pudo eliminar el socio ya que no existe.",
    INVALID_VALUES: "Se han especificado valores no <br>permitidos en algunos campos."
};

crearSocio.addEventListener("click", (e) => {
    $.ajax({
        type: "POST",
        url: "/api/partner",
        data: {
            nombre: crearNombre.value,
            apellido: crearApellido.value,
            telefono: crearTelefono.value,
            cedula: crearCedula.value,
            direccion: crearDireccion.value
        },
        success: function (response) {
            document.querySelector(".header-nav").click();
            aviso.click();

            crearNombre.value = '';
            crearApellido.value = '';
            crearTelefono.value = '';
            crearCedula.value = '';
            crearDireccion.value = '';
        },
        error: function (err) {
            const text = err.responseText;
            aviso.querySelector(".aviso-texto").innerHTML = error_defs[text];

            aviso.classList.add("aviso-activo");
        }
    });
});

buscarSocio.addEventListener("click", (e) => {
    $.ajax({
        type: "GET",
        url: "/api/partner",
        data: { dni: Number(buscarCedula.value) },
        success: function (response) {
            document.getElementById("buscar-campo-nombre").value = response.Name;
            document.getElementById("buscar-campo-apellido").value = response.LastName;
            document.getElementById("buscar-campo-telefono").value = response.Phone;
            document.getElementById("buscar-campo-cedula").value = response.Dni;
            document.getElementById("buscar-campo-direccion").value = response.Address;
            aviso.classList.remove("aviso-activo");
        },
        error: function (err) {
            const text = err.responseText;
            aviso.querySelector(".aviso-texto").innerHTML = error_defs[text];
            aviso.classList.add("aviso-activo");
        }
    });
});

aviso.addEventListener("click", () => {
    aviso.classList.remove("aviso-activo");
});

eliminarSocio.addEventListener("click", (e) => {
    $.ajax({
        type: "DELETE",
        url: "/api/partner",
        data: { dni: Number(buscarCedula.value) },
        success: function (response) {
            document.querySelector(".header-nav").click();
            aviso.classList.remove("aviso-activo");
        },
        error: function (err) {
            const text = err.responseText;
            aviso.querySelector(".aviso-texto").innerHTML = error_defs[text];
            aviso.classList.add("aviso-activo");
        }
    });
});

cargarAporte.addEventListener("click", (e) => {

    $.ajax({
        type: "POST",
        url: "/api/partner-aporte",
        data: {
            dni: aporteCedula.value,
            aporte: aporteAporte.value,
            saldo: aporteSaldo.value,
            fecha: aporteFecha.value
        },
        success: function (response) {
            document.querySelector(".header-nav").click();
            aviso.classList.remove("aviso-activo");
        },
        error: function (err) {
            const text = err.responseText;
            aviso.querySelector(".aviso-texto").innerHTML = error_defs[text];
            aviso.classList.add("aviso-activo");
        }
    });
})