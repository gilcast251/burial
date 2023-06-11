const nombreInput = document.querySelector("#nombre");
const emailInput = document.querySelector("#email");
const telefonoInput = document.querySelector("#telefono");
const mensajeInput = document.querySelector("#mensaje");
const nuevocorreo = document.querySelector("#nuevo-correo");

addEventListener();

function addEventListener() {
  nombreInput.addEventListener("input", datosCorreo);
  emailInput.addEventListener("input", datosCorreo);
  telefonoInput.addEventListener("input", datosCorreo);
  mensajeInput.addEventListener("input", datosCorreo);
  nuevocorreo.addEventListener("submit", enviarCorreo);
}

const correoObj = {
  nombre: "",
  email: "",
  telefono: "",
  mensaje: "",
};

function datosCorreo(e) {
  correoObj[e.target.name] = e.target.value;
}

function enviarCorreo(e) {
  e.preventDefault();

  const { nombre, email, telefono, mensaje } = correoObj;

  if (nombre === "" || email === "" || telefono === "" || mensaje === "") {
    imprimirAlerta("Falta llenar los campos", "error");
    return false;
  }
  console.log(correoObj);

  emailjs
    .send("service_pk2xnbf", "template_366i92q", correoObj)
    .then(function (res) {
      imprimirAlerta("Tu correo ha sido enviado exitosamente");
    });
  nuevocorreo.reset();
  sincronizarStorage(correoObj);
}

function imprimirAlerta(mensaje, tipo) {
  const divMensaje = document.createElement("div");
  divMensaje.classList.add("text-center", "alert", "d-block", "col-12");

  if (tipo === "error") {
    divMensaje.classList.add("alert-danger");
    divMensaje.classList.add("fade");
  } else {
    divMensaje.classList.add("alert-success");
    divMensaje.classList.add("fade");
  }

  divMensaje.textContent = mensaje;
  document
    .querySelector("#contenido")
    .insertBefore(divMensaje, document.querySelector("agregar-correo"));
  setTimeout(() => {
    divMensaje.remove();
  }, 5000);
}

function sincronizarStorage(correoObj) {
  localStorage.setItem("nuevo-correo", JSON.stringify(correoObj));
}
