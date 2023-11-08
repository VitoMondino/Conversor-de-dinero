function convertir() {
    const cantidad = parseFloat(document.getElementById("cantidad").value);
    const moneda_origen = document.getElementById("moneda_origen").value;
    const moneda_destino = document.getElementById("moneda_destino").value;
    const cotizacion_peso = parseFloat(document.getElementById("cotizacion_peso").value);
    const cotizacion_euro = parseFloat(document.getElementById("cotizacion_euro").value);
    const cotizacion_dolar = parseFloat(document.getElementById("cotizacion_dolar").value);
    const cotizacion_real = parseFloat(document.getElementById("cotizacion_real").value);
    const cotizaciones = {
      peso: cotizacion_peso,
      euro: cotizacion_euro,
      dolar: cotizacion_dolar,
      real: cotizacion_real
    };
    if (isNaN(cotizaciones[moneda_origen]) || isNaN(cotizaciones[moneda_destino])) {
      document.getElementById("resultado").innerHTML = "Debe ingresar una cotización para ambas monedas.";
    } else {
      const tasa = cotizaciones[moneda_origen] / cotizaciones[moneda_destino];
      if (isNaN(tasa)) {
        document.getElementById("resultado").innerHTML = "La tasa de conversión no es válida.";
      } else {
        const resultado = cantidad * tasa;
        document.getElementById("resultado").innerHTML = resultado.toFixed(2) + " " + moneda_destino.toUpperCase();
      }
    }
  }