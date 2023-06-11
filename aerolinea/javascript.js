// Query Selectors

const pasajeroInput = document.querySelector("#pasajero");
const cedulaInput = document.querySelector("#cedula");
const telefonoInput = document.querySelector("#telefono");
const fechaidaInput = document.querySelector("#fechaida");
const fecharegInput = document.querySelector("#fechareg");
const salidaInput = document.querySelector("#salida");
const destinoInput = document.querySelector("#destino");

const formulario = document.querySelector("#nuevo-vuelo");
const contenedorVuelos = document.querySelector("#vuelos");

let editar;

// Clases

class vuelos {
  constructor() {
    this.vuelos = [];
  }

  agregarVuelos(vuelo) {
    this.vuelos = [...this.vuelos, vuelo];
  }

  eliminarVuelo(id) {
    this.vuelos = this.vuelos.filter((vuelos) => vuelos.id !== id);
  }

  editarVuelo(vueloActual) {
    this.vuelos = this.vuelos.map((vuelos) =>
      vuelos.id === vueloActual.id ? vueloActual : vuelos
    );
  }
}

class ui {
  imprimirAlerta(mensaje, tipo) {
    const divMensaje = document.createElement("div");
    divMensaje.classList.add("text-center", "alert", "d-block", "col-12");

    if (tipo === "error") {
      divMensaje.classList.add("alert-danger");
    } else {
      divMensaje.classList.add("alert-success");
    }

    divMensaje.textContent = mensaje;
    document
      .querySelector("#contenido")
      .insertBefore(divMensaje, document.querySelector("agregar-vuelo"));
    setTimeout(() => {
      divMensaje.remove();
    }, 3000);
  }

  limpiarHTML() {
    while (contenedorVuelos.firstChild) {
      contenedorVuelos.removeChild(contenedorVuelos.firstChild);
    }
  }

  imprimirVuelo({ vuelos }) {
    this.limpiarHTML();
    vuelos.forEach((vuelos) => {
      const {
        pasajero,
        cedula,
        telefono,
        fechaida,
        fechareg,
        salida,
        destino,
        precio,
        id,
      } = vuelos;

      const divVuelos = document.createElement("div");
      divVuelos.classList.add("vuelo", "p-3");
      divVuelos.dataset.id = id;

      const pasajeroParrafo = document.createElement("h3");
      pasajeroParrafo.classList.add("card-tittle", "font-weight-bolder");
      pasajeroParrafo.textContent = pasajero;

      const cedulaParrafo = document.createElement("p");
      cedulaParrafo.innerHTML = `
        <span class="font-weight-bolder">Cedula Nº: </span>${cedula}
      `;

      const telefonoParrafo = document.createElement("p");
      telefonoParrafo.innerHTML = `
        <span class="font-weight-bolder">Telefono: </span>${telefono}
      `;

      const fechaidaParrafo = document.createElement("p");
      fechaidaParrafo.innerHTML = `
        <span class="font-weight-bolder">Fecha de Ida: </span>${fechaida}
      `;

      const fecharegParrafo = document.createElement("p");
      fecharegParrafo.innerHTML = `
        <span class="font-weight-bolder">Fecha de Regreso: </span>${fechareg}
      `;

      const salidaParrafo = document.createElement("p");
      salidaParrafo.innerHTML = `
        <span class="font-weight-bolder">Lugar de Partida: </span>${salida}
      `;

      const destinoParrafo = document.createElement("p");
      destinoParrafo.innerHTML = `
        <span class="font-weight-bolder">Lugar de Destino: </span>${destino}
      `;

      const precioParrafo = document.createElement("p");
      precioParrafo.innerHTML = `
        <span class="font-weight-bolder">Precio: </span>${precio} $
      `;

      const botonEliminar = document.createElement("button");

      botonEliminar.classList.add("btn", "btn-danger", "mr-2");
      botonEliminar.innerHTML =
        'Eliminar <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>';
      botonEliminar.onclick = () => eliminarVuelo(id);

      const botonEditar = document.createElement("button");

      botonEditar.classList.add("btn", "btn-info");
      botonEditar.innerHTML =
        'Modificar <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>';
      botonEditar.onclick = () => cargarEditar(vuelos);

      divVuelos.appendChild(pasajeroParrafo);
      divVuelos.appendChild(cedulaParrafo);
      divVuelos.appendChild(telefonoParrafo);
      divVuelos.appendChild(fechaidaParrafo);
      divVuelos.appendChild(fecharegParrafo);
      divVuelos.appendChild(salidaParrafo);
      divVuelos.appendChild(destinoParrafo);
      divVuelos.appendChild(precioParrafo);
      divVuelos.appendChild(botonEliminar);
      divVuelos.appendChild(botonEditar);

      contenedorVuelos.appendChild(divVuelos);
    });
  }

  // funcion que guarda los objetos en el LocalStorage

  sincronizarStorage({ vuelos }) {
    localStorage.setItem("vuelos", JSON.stringify(vuelos));
  }
}

const userui = new ui();
const administrarVuelos = new vuelos();

// Event Listeners

addEventListener();
function addEventListener() {
  pasajeroInput.addEventListener("input", datosVuelos);
  cedulaInput.addEventListener("input", datosVuelos);
  telefonoInput.addEventListener("input", datosVuelos);
  fechaidaInput.addEventListener("input", datosVuelos);
  fecharegInput.addEventListener("input", datosVuelos);
  salidaInput.addEventListener("change", datosVuelos);
  destinoInput.addEventListener("change", datosVuelos);
  formulario.addEventListener("submit", nuevoVuelo);

  // cuando carga el documento, llama los objetos del localStorage de vuelta

  document.addEventListener("DOMContentLoaded", () => {
    administrarVuelos.vuelos = JSON.parse(localStorage.getItem("vuelos")) || [];
    userui.imprimirVuelo(administrarVuelos);
  });
}

const vuelosObj = {
  pasajero: "",
  cedula: "",
  telefono: "",
  fechaida: "",
  fechareg: "",
  salida: "",
  destino: "",
};

function datosVuelos(e) {
  vuelosObj[e.target.name] = e.target.value;
}

function nuevoVuelo(e) {
  e.preventDefault();

  const { pasajero, cedula, telefono, fechaida, fechareg, salida, destino } =
    vuelosObj;

  if (
    (pasajero, cedula, telefono, fechaida, fechareg, salida, destino) === ""
  ) {
    userui.imprimirAlerta("Hay que llenar todos los campos", "error");
    return false;
  } else if (fechaida > fechareg) {
    userui.imprimirAlerta("Error en las fechas", "error");
    return false;
  }

  // el valor de precio dependerá del destino y lugar de salida

  switch (vuelosObj.destino) {
    case "Argentina":
      vuelosObj.precio = 700;
      break;
    case "Colombia":
      vuelosObj.precio = 500;
      break;
    case "Peru":
      vuelosObj.precio = 600;
      break;
    case "Ecuador":
      vuelosObj.precio = 600;
      break;
    case "Chile":
      vuelosObj.precio = 650;
      break;
  }

  switch (vuelosObj.salida) {
    case "Bolivar":
      vuelosObj.precio -= 30.22;
      break;
    case "Maracaibo":
      vuelosObj.precio -= 25;
      break;
    case "Valencia":
      vuelosObj.precio -= 15;
      break;
  }

  if (editar) {
    formulario.querySelector("button[type=submit]").textContent =
      "Crear ticket";
    editar = false;
    administrarVuelos.editarVuelo({ ...vuelosObj });
    userui.imprimirAlerta("Se ha modificado correctamente");
  } else {
    vuelosObj.id = Date.now();
    administrarVuelos.agregarVuelos({ ...vuelosObj });
  }

  formulario.reset();
  reiniciarObjeto();

  userui.imprimirVuelo(administrarVuelos);
  userui.sincronizarStorage(administrarVuelos);


}


function reiniciarObjeto() {
  vuelosObj.pasajero = "";
  vuelosObj.cedula = "";
  vuelosObj.telefono = "";
  vuelosObj.fechaida = "";
  vuelosObj.fechareg = "";
  vuelosObj.salida = "";
  vuelosObj.destino = "";
}

function eliminarVuelo(id) {
  administrarVuelos.eliminarVuelo(id);
  userui.imprimirAlerta("El vuelo se elimino correctamente");
  userui.imprimirVuelo(administrarVuelos);
  userui.sincronizarStorage(administrarVuelos);
}

function cargarEditar(vuelo) {
  const {
    pasajero,
    cedula,
    telefono,
    fechaida,
    fechareg,
    salida,
    destino,
    precio,
    id,
  } = vuelo;

  pasajeroInput.value = pasajero;
  cedulaInput.value = cedula;
  telefonoInput.value = telefono;
  fechaidaInput.value = fechaida;
  fecharegInput.value = fechareg;
  salidaInput.value = salida;
  destinoInput.value = destino;

  vuelosObj.pasajero = pasajero;
  vuelosObj.cedula = cedula;
  vuelosObj.telefono = telefono;
  vuelosObj.fechaida = fechaida;
  vuelosObj.fechareg = fechareg;
  vuelosObj.salida = salida;
  vuelosObj.destino = destino;
  vuelosObj.precio = precio;
  vuelosObj.id = id;

  formulario.querySelector("button[type=submit]").textContent = "Guardar";

  editar = true;
}
