// Query Selectors

const clienteInput = document.querySelector("#cliente");
const materialInput = document.querySelector("#material");
const ubicacionInput = document.querySelector("#ubicacion");
const metrosInput = document.querySelector("#metros");

const cotizacion = document.querySelector("#nueva-cotizacion");

// Variables Iniciales

let rif = "J-40319883-5";
let IVA = 0.16;
let logo = document.getElementById("logo");

// API Tasa de Cambio

obtenerTasaAPI();
function obtenerTasaAPI() {
  fetch("https://s3.amazonaws.com/dolartoday/data.json")
    .then((respuesta) => respuesta.json())
    .then((data) => valorDolar(data));
}

// Event Listeners

function valorDolar(data) {
  let tasaCambio = data.USD.dolartoday;
  console.log(tasaCambio);

  addEventListener();

  function addEventListener() {
    clienteInput.addEventListener("input", datosCotizacion);
    materialInput.addEventListener("change", datosCotizacion);
    ubicacionInput.addEventListener("change", datosCotizacion);
    metrosInput.addEventListener("input", datosCotizacion);
    cotizacion.addEventListener("submit", nuevaCotizacion);
  }

  const cotizacionObj = {
    cliente: "",
    material: "",
    ubicacion: "",
    metros: 0,
  };

  function datosCotizacion(e) {
    cotizacionObj[e.target.name] = e.target.value;

    mostrarImg(cotizacionObj.material);
  }

  let HidrorrepelenteUnd = parseInt(tasaCambio * 10);
  let mensajeDescuento = "";

  function nuevaCotizacion(e) {
    e.preventDefault();

    const { cliente, material, ubicacion, metros } = cotizacionObj;

    if (
      cliente === "" ||
      material === "" ||
      ubicacion === "" ||
      metros === "" ||
      metros <= 0
    ) {
      imprimirAlerta("Falta llenar los campos", "error");
      return false;
    } else if (metros < 1.5) {
      imprimirAlerta(
        "Lo sentimos, solo cotizamos a partir de 1.5 metros en adelante",
        "error"
      );
      return false;
    } else if (metros > 50) {
      imprimirAlerta(
        "Para presupuestos mayores a 50 metros por favor comunicarse directamente con nosotros",
        "error"
      );
      return false;
    } else if (cliente.length > 30) {
      imprimirAlerta(
        "Campo de nombre muy extenso, por favor intente nuevamente",
        "error"
      );
      return false;
    }

    imprimirAlerta("Su presupuesto ha sido descargado");

    if (metros >= 8) {
      mensajeDescuento = "Aplica descuento del 15% al precio del material";
    }

    cotizacionObj.fecha = new Date().toLocaleDateString();

    cotizacionObj.precioHidrorreplente = parseFloat(
      HidrorrepelenteUnd * cotizacionObj.metros
    );

    cotizacionObj.precioHidrorreplenteFormat = new Intl.NumberFormat("es-BO", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(cotizacionObj.precioHidrorreplente);

    precioMaterial(tasaCambio, material, metros);
    precioFlete(tasaCambio, ubicacion, metros);

    cotizacionObj.montoTotalSinIVA = parseFloat(
      cotizacionObj.precioFinalMaterial +
        cotizacionObj.montoTransporte +
        cotizacionObj.precioHidrorreplente
    );

    cotizacionObj.montoTotalFormatSinIva = new Intl.NumberFormat("es-BO", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(cotizacionObj.montoTotalSinIVA);

    calcularIVA(IVA, cotizacionObj.montoTotalSinIVA);

    cotizacionObj.montoTotalConIVA =
      cotizacionObj.montoTotalSinIVA + cotizacionObj.montoIVA;
    console.log(cotizacionObj.montoTotalConIVA);
    cotizacionObj.montoTotalFormatConIva = new Intl.NumberFormat("es-BO", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(cotizacionObj.montoTotalConIVA);

    calcularAbono(cotizacionObj.montoTotalConIVA);

    generatePDF(
      rif,
      mensajeDescuento,
      cotizacionObj.abonoformat,
      cotizacionObj.montoIVAFormat,
      cotizacionObj.precioHidrorreplenteFormat,
      cotizacionObj.montoTransporteFormat,
      cotizacionObj.precioFinalMaterialFormat,
      cotizacionObj.precioBaseMaterialFormat,
      cotizacionObj.montoTotalFormatConIva,
      cotizacionObj.montoTotalFormatSinIva,
      HidrorrepelenteUnd,
      cotizacionObj.metros,
      cotizacionObj.material,
      cotizacionObj.ubicacion,
      cotizacionObj.fecha,
      cotizacionObj.cliente,
      logo
    );

    sincronizarStorage(cotizacionObj);
  }

  function mostrarImg(material) {
    material === "Granito Gris Leona"
      ? (document.getElementById("muestra1").style.display = "block")
      : (document.getElementById("muestra1").style.display = "none");

    material === "Granito Blanco Artico"
      ? (document.getElementById("muestra2").style.display = "block")
      : (document.getElementById("muestra2").style.display = "none");

    material === "Granito Verde Ubatuba"
      ? (document.getElementById("muestra3").style.display = "block")
      : (document.getElementById("muestra3").style.display = "none");

    material === "Granito Blanco Itauna"
      ? (document.getElementById("muestra4").style.display = "block")
      : (document.getElementById("muestra4").style.display = "none");

    material === "Granito Negro San Gabriel"
      ? (document.getElementById("muestra5").style.display = "block")
      : (document.getElementById("muestra5").style.display = "none");

    material === "Mármol Crema Marfil"
      ? (document.getElementById("muestra6").style.display = "block")
      : (document.getElementById("muestra6").style.display = "none");

    material === "Mármol Travertino Romano"
      ? (document.getElementById("muestra7").style.display = "block")
      : (document.getElementById("muestra7").style.display = "none");

    material === "Mármol Marrón Emperador"
      ? (document.getElementById("muestra8").style.display = "block")
      : (document.getElementById("muestra8").style.display = "none");

    material === "Mármol Volakas"
      ? (document.getElementById("muestra9").style.display = "block")
      : (document.getElementById("muestra9").style.display = "none");

    material === "Cuarzo Blanco Estelar"
      ? (document.getElementById("muestra10").style.display = "block")
      : (document.getElementById("muestra10").style.display = "none");

    material === "Cuarzo Blanco Sky"
      ? (document.getElementById("muestra11").style.display = "block")
      : (document.getElementById("muestra11").style.display = "none");

    material === "Cuarzo Negro Estelar"
      ? (document.getElementById("muestra12").style.display = "block")
      : (document.getElementById("muestra12").style.display = "none");

    material === "Cuarzo Blanco Calacatta"
      ? (document.getElementById("muestra13").style.display = "block")
      : (document.getElementById("muestra13").style.display = "none");

    material === "Cuarzo Calacatta Gold"
      ? (document.getElementById("muestra14").style.display = "block")
      : (document.getElementById("muestra14").style.display = "none");
  }

  function precioMaterial(tasaCambio, material, metros) {
    switch (material) {
      case "Granito Gris Leona":
        cotizacionObj.precioBaseMaterial = tasaCambio * 120;
        break;
      case "Granito Blanco Artico":
        cotizacionObj.precioBaseMaterial = tasaCambio * 150;
        break;
      case "Granito Verde Ubatuba":
        cotizacionObj.precioBaseMaterial = tasaCambio * 160;
        break;
      case "Granito Blanco Itauna":
        cotizacionObj.precioBaseMaterial = tasaCambio * 200;
        break;
      case "Granito Negro San Gabriel":
        cotizacionObj.precioBaseMaterial = tasaCambio * 200;
        break;
      case "Mármol Crema Marfil":
        cotizacionObj.precioBaseMaterial = tasaCambio * 200;
        break;
      case "Mármol Travertino Romano":
        cotizacionObj.precioBaseMaterial = tasaCambio * 220;
        break;
      case "Mármol Marrón Emperador":
        cotizacionObj.precioBaseMaterial = tasaCambio * 220;
        break;
      case "Mármol Volakas":
        cotizacionObj.precioBaseMaterial = tasaCambio * 280;
        break;
      case "Cuarzo Blanco Estelar":
        cotizacionObj.precioBaseMaterial = tasaCambio * 240;
        break;
      case "Cuarzo Blanco Sky":
        cotizacionObj.precioBaseMaterial = tasaCambio * 240;
        break;
      case "Cuarzo Negro Estelar":
        cotizacionObj.precioBaseMaterial = tasaCambio * 240;
        break;
      case "Cuarzo Blanco Calacatta":
        cotizacionObj.precioBaseMaterial = tasaCambio * 300;
        break;
      case "Cuarzo Calacatta Gold":
        cotizacionObj.precioBaseMaterial = tasaCambio * 340;
        break;
      default:
        break;
    }

    cotizacionObj.precioBaseMaterial = parseFloat(
      cotizacionObj.precioBaseMaterial
    );

    let montoDescuento = cotizacionObj.precioBaseMaterial * 0.15;

    if (metros >= 8) {
      cotizacionObj.precioBaseMaterial -= montoDescuento;
    }

    cotizacionObj.precioBaseMaterialFormat = new Intl.NumberFormat(
      "es-BO"
    ).format(cotizacionObj.precioBaseMaterial);

    cotizacionObj.precioFinalMaterial = parseFloat(
      cotizacionObj.precioBaseMaterial * metros
    );

    cotizacionObj.precioFinalMaterialFormat = new Intl.NumberFormat("es-BO", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(cotizacionObj.precioFinalMaterial);
  }

  function precioFlete(tasaCambio, ubicacion, metros) {
    switch (ubicacion) {
      case "Caracas":
        cotizacionObj.montoTransporte = tasaCambio * 80;
        break;
      case "Altos Mirandinos":
        cotizacionObj.montoTransporte = tasaCambio * 120;
        break;
      case "Guarenas-Guatire":
        cotizacionObj.montoTransporte = tasaCambio * 120;
        break;
      case "La Guaira":
        cotizacionObj.montoTransporte = tasaCambio * 150;
        break;
      default:
        break;
    }
    if (metros >= 25) {
      cotizacionObj.montoTransporte += tasaCambio * 150;
    } else if (metros >= 15) {
      cotizacionObj.montoTransporte += tasaCambio * 100;
    } else if (metros >= 10) {
      cotizacionObj.montoTransporte += tasaCambio * 60;
    } else if (metros >= 7) {
      cotizacionObj.montoTransporte += tasaCambio * 40;
    } else if (metros >= 5) {
      cotizacionObj.montoTransporte += tasaCambio * 20;
    }

    cotizacionObj.montoTransporte = parseFloat(cotizacionObj.montoTransporte);

    cotizacionObj.montoTransporteFormat = new Intl.NumberFormat("es-BO", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(cotizacionObj.montoTransporte);
  }

  function calcularIVA(IVA, montoTotalSinIVA) {
    cotizacionObj.montoIVA = parseFloat(montoTotalSinIVA * IVA);
    cotizacionObj.montoIVAFormat = new Intl.NumberFormat("es-BO", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(cotizacionObj.montoIVA);
  }

  function calcularAbono(montoTotalConIVA) {
    cotizacionObj.abono = parseFloat(montoTotalConIVA * 0.7);
    cotizacionObj.abonoformat = new Intl.NumberFormat("es-BO", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(cotizacionObj.abono);
  }

  function generatePDF(
    rif,
    mensajeDescuento,
    abonoformat,
    montoIVAFormat,
    precioHidrorreplenteFormat,
    montoTransporteFormat,
    precioFinalMaterialFormat,
    precioBaseMaterialFormat,
    montoTotalFormatConIva,
    montoTotalFormatSinIva,
    HidrorrepelenteUnd,
    metros,
    material,
    ubicacion,
    fecha,
    cliente,
    logo
  ) {
    var pdf = new jsPDF({
      orientation: "p",
      unit: "mm",
      format: [267, 310],
      putOnlyUsedFonts: true,
    });

    // El primer numero es el eje X, el segundo es el Y

    pdf.addImage(logo, "PNG", -3, -15);
    pdf.setFontSize(15);
    pdf.setFont("helvetica");
    pdf.setTextColor(64, 100, 140);
    pdf.text(rif, 35, 15);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`Fecha: ${fecha}`, 213, 15);
    pdf.text(`Nombre del Cliente: ${cliente}`, 10, 50);
    pdf.text(`Ubicación de la Obra: ${ubicacion}`, 10, 60);
    pdf.text(
      "Contactos: Ricardo Alvarez 0424-2379052 / Gilbert Castillo 0412-9981970",
      10,
      70
    );
    pdf.setFontSize(20);
    pdf.setFont("helvetica", "bold");
    pdf.text("PRESUPUESTO", 115, 90);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(15);
    pdf.setFont("helvetica", "bold");
    pdf.setFillColor(87, 140, 201);
    pdf.rect(9, 104, 249, 9, "F");
    pdf.text(`Descripción`, 10, 110);
    pdf.text(`Cantidad`, 151, 110);
    pdf.text(`Precio Unitario`, 178, 110);
    pdf.text(`Precio Total`, 221, 110);
    pdf.setFont("helvetica", "normal");
    pdf.text(`Suministro e Instalación de ${material}`, 10, 120);
    pdf.text(`${metros} m`, 151, 120);
    pdf.text(`${precioBaseMaterialFormat} Bs`, 178, 120);
    pdf.text(`${precioFinalMaterialFormat} Bs`, 220, 120);
    pdf.text(`Hidrorrepelente Antimanchas Protector`, 10, 130);
    pdf.text(`${metros} m`, 151, 130);
    pdf.text(`${HidrorrepelenteUnd} Bs`, 178, 130);
    pdf.text(`${precioHidrorreplenteFormat} Bs`, 220, 130);
    pdf.text(`Transporte con Seguro`, 10, 140);
    pdf.setTextColor(0, 112, 74);
    pdf.setFont("helvetica", "bold");
    pdf.text(mensajeDescuento, 10, 150);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(0, 0, 0);
    pdf.text(`1 ud.`, 151, 140);
    pdf.text(`${montoTransporteFormat} Bs`, 178, 140);
    pdf.text(`${montoTransporteFormat} Bs`, 220, 140);
    pdf.text(`${montoTotalFormatSinIva} Bs`, 220, 150);
    pdf.text(`${montoIVAFormat} Bs`, 220, 160);
    pdf.text(`Abono del 70% para iniciar la Obra: ${abonoformat} Bs`, 10, 170);
    pdf.setFont("helvetica", "bold");
    pdf.text(`Sub-Total`, 191, 150);
    pdf.text(`IVA`, 206, 160);
    pdf.text(`TOTAL`, 198, 170);
    pdf.setFont("helvetica", "normal");
    pdf.text(`${montoTotalFormatConIva} Bs`, 220, 170);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(255, 76, 51);
    pdf.text(`NOTA IMPORTANTE:`, 10, 240);
    pdf.setTextColor(0, 0, 0);
    pdf.setFont("helvetica", "normal");

    pdf.text(
      `- El precio del tope incluye zócalos de 7cm a 10cm, borde frontal, apertura de hueco de cocina y fregadero`,
      10,
      250
    );
    pdf.text(
      ` externo, todo hueco diferente a los mencionados tendrán un costo adicional.`,
      12,
      257
    );
    pdf.text(
      `- En un período de cinco días habiles despues de la compra, se rectificarán medidas.`,
      10,
      267
    );
    pdf.text(
      `- El tiempo de entrega del trabajo será de 7 a 15 dias hábiles una vez rectificadas las medidas.`,
      10,
      277
    );
    pdf.text(
      `- El acarreo de material (subido o bajado por escaleras o distancias largas), así como tambien desmontaje`,
      10,
      287
    );
    pdf.text(
      ` de topes existentes o trabajos adicionales corren por cuenta del cliente.`,
      12,
      294
    );
    pdf.text(
      `- El mármol y el granito pueden presentar variaciones en cuanto a vetas, tonos y coloracion.`,
      10,
      304
    );

    // Lineas Horizontales

    pdf.line(9, 104, 258, 104);
    pdf.line(9, 113, 258, 113);
    pdf.line(9, 123, 258, 123);
    pdf.line(9, 133, 258, 133);
    pdf.line(9, 143, 258, 143);
    pdf.line(9, 163, 258, 163);
    pdf.line(176, 153, 258, 153);
    pdf.line(9, 173, 258, 173);

    // Lineas Verticales

    pdf.line(9, 104, 9, 173);
    pdf.line(149, 104, 149, 173);
    pdf.line(176, 104, 176, 173);
    pdf.line(218, 104, 218, 173);
    pdf.line(258, 104, 258, 173);

    pdf.save(`Presupuesto de ${cliente}.pdf`);
  }
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
    .insertBefore(divMensaje, document.querySelector("agregar-cotizacion"));
  setTimeout(() => {
    divMensaje.remove();
  }, 5000);
}

function sincronizarStorage(cotizacionObj) {
  localStorage.setItem("nueva-cotizacion", JSON.stringify(cotizacionObj));
}
