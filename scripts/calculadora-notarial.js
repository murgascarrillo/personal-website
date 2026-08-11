
    const valorVentaInput = document.getElementById("valorVenta");
    const cantidadHojasInput = document.getElementById("cantidadHojas");
    const actosSinCuantiaInput = document.getElementById("actosSinCuantia");
    const resultadosBody = document.getElementById("resultados");
    const totalDisplay = document.getElementById("total");

    function formatoCOP(num) {
      return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0,
      }).format(num);
    }

function calcular() {
  const valorVenta = parseFloat(valorVentaInput.value) || 0;
  const hojas = parseInt(cantidadHojasInput.value) || 0;
  const actosSinCuantia = parseInt(actosSinCuantiaInput.value) || 0;
  const valorHipoteca = parseFloat(valorHipotecaInput.value) || 0;

  const costoHoja = 5600;
  const valorActoSinCuantia = 90600;

  const costoHojas = hojas * costoHoja;

  let derechos = 0;
  if (valorVenta <= 259300) {
    derechos = 30900;
  } else {
    derechos = 30900 + (valorVenta - 259300) * 0.003;
  }

  const subtotalActosSinCuantia = actosSinCuantia * valorActoSinCuantia;
  const ivaActosSinCuantia = subtotalActosSinCuantia * 0.19;
  const ivaDerechos = (costoHojas + derechos) * 0.19;
  const ivaTotal = (ivaActosSinCuantia + ivaDerechos);

  const retencion = valorVenta * 0.01;
  let recaudo = 28900; // Valor base para inmuebles hasta 100 millones.
  switch (true) {
    case valorVenta > 1500000000:
      recaudo = 96400;
      break;
    case valorVenta > 1000000000:
      recaudo = 84800;
      break;
    case valorVenta > 500000000:
      recaudo = 71900;
      break;
    case valorVenta > 300000000:
      recaudo = 52700;
      break;
    case valorVenta > 100000000:
      recaudo = 43700;
      break;
    default:
      recaudo = 28900;
  }

  const total = Math.round(
    costoHojas + derechos + ivaTotal + retencion +
    subtotalActosSinCuantia + recaudo
  );

  const filas = [
    ["Cantidad Hojas (Extensión y Protocolo)", hojas],
    ["Costo hojas escritura", formatoCOP(costoHojas)],
    ["Derechos Notariales", formatoCOP(derechos)],
    ["Actos sin cuantía", formatoCOP(subtotalActosSinCuantia)],
    ["IVA Total (19%) Derechos + Derechos Actos sin cuantía", formatoCOP(ivaTotal)],
    ["Retención en la fuente (1%)", formatoCOP(retencion)],
    ["Recaudo Sup. y Fondo", formatoCOP(recaudo)],
  ];

  resultadosBody.innerHTML = filas
    .map(([concepto, valor]) => `<tr><td>${concepto}</td><td>${valor}</td></tr>`)
    .join("");

  totalDisplay.textContent = formatoCOP(total);
}


async function exportarPDF() {
  const element = document.getElementById("contenedorPDF");

  // Renderizar como imagen optimizada
  const canvas = await html2canvas(element, {
    scale: 1.2, // Menor escala = menor tamaño
    useCORS: true
  });

  const imgData = canvas.toDataURL("image/jpeg", 0.8); // JPEG con compresión 80%

  const pdf = new jspdf.jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "letter"
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const margin = 20;
  const availableWidth = pageWidth - margin * 2;

  const imgProps = pdf.getImageProperties(imgData);
  const imgWidth = availableWidth;
  const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

  const finalHeight = Math.min(imgHeight, pageHeight - margin * 2);
  const scale = finalHeight / imgHeight;

  pdf.addImage(
    imgData,
    "JPEG",
    margin,
    margin,
    imgWidth * scale,
    imgHeight * scale
  );

  pdf.save("CalculoEscrituracion.pdf");
}

    valorVentaInput.addEventListener("input", calcular);
    cantidadHojasInput.addEventListener("input", calcular);
    actosSinCuantiaInput.addEventListener("input", calcular);
    calcular(); // ejecutar al inicio
