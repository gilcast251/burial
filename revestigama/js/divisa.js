// Query Selectors

const clienteInput = document.querySelector("#cliente");
const materialInput = document.querySelector("#material");
const ubicacionInput = document.querySelector("#ubicacion");
const metrosInput = document.querySelector("#metros");

const cotizacion = document.querySelector("#nueva-cotizacion");

let IVA = 0.03;
let logo = document.getElementById("logo");

// Event Listeners

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
    alert("error en los campos");
    return false;
  } else if (metros < 1.5) {
    alert("Lo sentimos, solo cotizamos a partir de 1.5 metros en adelante");
    return false;
  } else if (metros > 50) {
    alert(
      "Para presupuestos mayores a 50 metros por favor comunicarse directamente con nosotros"
    );
    return false;
  } else if (cliente.length > 30) {
    alert("Campo de nombre muy extenso, por favor intente nuevamente");
    return false;
  }

  cotizacionObj.fecha = new Date().toLocaleDateString();
  cotizacionObj.precioHidrorreplente = parseInt(10 * cotizacionObj.metros);

  precioMaterial(material, metros);
  precioFlete(ubicacion, metros);

  cotizacionObj.montoTotalSinIVA =
    cotizacionObj.precioFinalMaterial +
    cotizacionObj.montoTransporte +
    cotizacionObj.precioHidrorreplente;

  calcularIVA(IVA, cotizacionObj.montoTotalSinIVA);
  cotizacionObj.montoTotalConIVA =
    cotizacionObj.montoTotalSinIVA + cotizacionObj.montoIVA;

  calcularAbono(cotizacionObj.montoTotalConIVA);

  generatePDF(
    cotizacionObj.abono,
    cotizacionObj.montoIVA,
    cotizacionObj.montoTransporte,
    cotizacionObj.precioFinalMaterial,
    cotizacionObj.precioBaseMaterial,
    cotizacionObj.metros,
    cotizacionObj.precioHidrorreplente,
    cotizacionObj.material,
    cotizacionObj.ubicacion,
    cotizacionObj.fecha,

    cotizacionObj.cliente,
    cotizacionObj.montoTotalConIVA,
    cotizacionObj.montoTotalSinIVA,
    logo
  );
}

function mostrarImg(material) {
  if (material === "Granito Gris Leona") {
    document.getElementById("muestra1").style.display = "block";
  } else {
    document.getElementById("muestra1").style.display = "none";
  }
  if (material === "Granito Blanco Artico") {
    document.getElementById("muestra2").style.display = "block";
  } else {
    document.getElementById("muestra2").style.display = "none";
  }
  if (material === "Granito Negro San Gabriel") {
    document.getElementById("muestra3").style.display = "block";
  } else {
    document.getElementById("muestra3").style.display = "none";
  }
  if (material === "Cuarzo Blanco Estelar") {
    document.getElementById("muestra4").style.display = "block";
  } else {
    document.getElementById("muestra4").style.display = "none";
  }
  if (material === "Cuarzo Negro Estelar") {
    document.getElementById("muestra5").style.display = "block";
  } else {
    document.getElementById("muestra5").style.display = "none";
  }
}

function generatePDF(
  abono,
  montoIVA,
  montoTransporte,
  precioFinalMaterial,
  precioBaseMaterial,
  metros,
  precioHidrorreplente,
  material,
  ubicacion,
  fecha,
  cliente,
  montoTotalConIVA,
  montoTotalSinIVA,
  logo
) {
  var pdf = new jsPDF({
    orientation: "p",
    unit: "mm",
    format: [260, 310],
    putOnlyUsedFonts: true,
  });
  // El primer numero es el eje X, el segundo es el Y

  pdf.addImage(logo, "PNG", -3, -15);
  pdf.text("J-40319883-5", 35, 15);
  pdf.text(`Fecha: ${fecha}`, 206, 15);
  pdf.text(`Nombre del Cliente: ${cliente}`, 10, 50);
  pdf.text(`Ubicación de la Obra: ${ubicacion}`, 10, 60);
  pdf.text(
    "Contactos: Ricardo Alvarez 0424-2379052 / Gilbert Castillo 0412-9981970",
    10,
    70
  );
  pdf.text(`Descripción`, 60, 110);
  pdf.text(`Cantidad`, 150, 110);
  pdf.text(`Precio Unitario`, 177, 110);
  pdf.text(`Precio Total`, 220, 110);
  pdf.text(`Suministro e Instalación de ${material}`, 10, 120);
  pdf.text(`${metros}m`, 155, 120);
  pdf.text(`${precioBaseMaterial}$`, 190, 120);
  pdf.text(`${precioFinalMaterial}$`, 230, 120);
  pdf.text(`Hidrorrepelente Antimanchas Protector`, 10, 130);
  pdf.text(`${metros}`, 155, 130);
  pdf.text(`10$`, 190, 130);
  pdf.text(`${precioHidrorreplente}$`, 230, 130);
  pdf.text(`Transporte con Seguro`, 10, 140);
  pdf.text(`1`, 155, 140);
  pdf.text(`${montoTransporte}$`, 230, 140);
  pdf.text(`___________`, 220, 142);
  pdf.text(`Sub-Total`, 180, 150);
  pdf.text(`${montoTotalSinIVA}$`, 230, 150);
  pdf.text(`IGTF`, 180, 160);
  pdf.text(`${montoIVA}$`, 230, 160);
  pdf.text(`___________`, 220, 162);
  pdf.text(`Abono del 70%: ${abono}$`, 10, 170);
  pdf.text(`TOTAL`, 180, 170);
  pdf.text(`${montoTotalConIVA}$`, 230, 170);
  pdf.text(`NOTA IMPORTANTE:`, 10, 240);
  pdf.text(
    `- El precio del tope incluye zócalos de 7cm a 10cm, borde frontal, apertura de hueco de cocina`,
    10,
    250
  );
  pdf.text(
    ` y fregadero externo, todo hueco diferente a los mencionados tendrán un costo adicional.`,
    12,
    257
  );
  pdf.text(
    `- En un período de cinco días habiles despues de la compra, se rectificarán medidas`,
    10,
    267
  );
  pdf.text(
    `- El tiempo de entrega del trabajo será de 7 a 15 dias hábiles según el metraje`,
    10,
    277
  );
  pdf.text(
    `- El acarreo de material (subido o bajado por escaleras o distancias largas), así como tambien`,
    10,
    287
  );
  pdf.text(
    ` el desmontaje de topes existentes o trabajos adicionales corren por cuenta del cliente.`,
    12,
    294
  );
  pdf.text(
    `- El mármol y el granito pueden presentar variaciones en cuanto a vetas, tonos y coloracion.`,
    10,
    304
  );

  pdf.save(`Presupuesto de ${cliente}.pdf`);
}

function precioMaterial(material, metros) {
  switch (material) {
    case "Granito Gris Leona":
      cotizacionObj.precioBaseMaterial = 120;
      break;
    case "Granito Blanco Artico":
      cotizacionObj.precioBaseMaterial = 150;
      break;
    case "Granito Negro San Gabriel":
      cotizacionObj.precioBaseMaterial = 200;
      break;
    case "Cuarzo Blanco Estelar":
      cotizacionObj.precioBaseMaterial = 240;
      break;
    case "Cuarzo Negro Estelar":
      cotizacionObj.precioBaseMaterial = 240;
      break;
    default:
      break;
  }

  cotizacionObj.precioFinalMaterial = parseInt(
    cotizacionObj.precioBaseMaterial * metros
  );
}

function precioFlete(ubicacion, metros) {
  switch (ubicacion) {
    case "Caracas":
      cotizacionObj.montoTransporte = 80;
      break;
    case "Altos Mirandinos":
      cotizacionObj.montoTransporte = 120;
      break;
    case "Guarenas-Guatire":
      cotizacionObj.montoTransporte = 120;
      break;
    case "La Guaira":
      cotizacionObj.montoTransporte = 150;
      break;
    default:
      break;
  }
  if (metros >= 25) {
    cotizacionObj.montoTransporte += 150;
  } else if (metros >= 15) {
    cotizacionObj.montoTransporte += 100;
  } else if (metros >= 10) {
    cotizacionObj.montoTransporte += 60;
  } else if (metros >= 7) {
    cotizacionObj.montoTransporte += 40;
  } else if (metros >= 5) {
    cotizacionObj.montoTransporte += 20;
  }
}

function calcularIVA(IVA, montoTotalSinIVA) {
  cotizacionObj.montoIVA = parseInt(montoTotalSinIVA * IVA);
}

function calcularAbono(montoTotalConIVA) {
  cotizacionObj.abono = parseInt(montoTotalConIVA * 0.7);
}
