let tasasDeCambio = {};

function saveRatesToLocalStorage(rates) {
  localStorage.setItem('exchangeRates', JSON.stringify(rates));
  localStorage.setItem('lastUpdate', Date.now());
}

function getRatesFromLocalStorage() {
  const rates = localStorage.getItem('exchangeRates');
  const lastUpdate = localStorage.getItem('lastUpdate');
  if (rates && lastUpdate && (Date.now() - lastUpdate < 1 * 60 * 60 * 1000)) { // 1 hora
    return JSON.parse(rates);
  }
  return null;
}

async function obtenerCotizaciones() {
  const loading = document.getElementById('loading');
  loading.textContent = 'Cargando cotizaciones...';

  const cachedRates = getRatesFromLocalStorage();
  if (cachedRates) {
    tasasDeCambio = cachedRates;
    loading.textContent = 'Cotizaciones cargadas desde caché';
    setTimeout(() => loading.textContent = '', 2000);
    return;
  }

  try {
    const response = await fetch('https://api.bluelytics.com.ar/v2/latest');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    tasasDeCambio = {
      ARS: { oficial: 1, blue: 1 },
      USD: { 
        oficial: 1 / data.oficial.value_sell, 
        blue: 1 / data.blue.value_sell 
      },
      EUR: { 
        oficial: 1 / data.oficial_euro.value_sell, 
        blue: 1 / data.blue_euro.value_sell 
      }
    };
    saveRatesToLocalStorage(tasasDeCambio);
    loading.textContent = 'Cotizaciones actualizadas';
    setTimeout(() => loading.textContent = '', 2000);
  } catch (error) {
    console.error('Error al obtener cotizaciones:', error);
    loading.textContent = 'Error al cargar cotizaciones. Usando valores predeterminados.';
    tasasDeCambio = {
      ARS: { oficial: 1, blue: 1 },
      USD: { oficial: 0.0028, blue: 0.0025 },
      EUR: { oficial: 0.0026, blue: 0.0023 }
    };
  }
}

function convertir() {
  const cantidad = parseFloat(document.getElementById('cantidad').value);
  const monedaOrigen = document.getElementById('moneda_origen').value;
  const monedaDestino = document.getElementById('moneda_destino').value;
  const tipoOrigen = document.querySelector('input[name="tipo_origen"]:checked').value;
  const tipoDestino = document.querySelector('input[name="tipo_destino"]:checked').value;
  
  if (isNaN(cantidad) || cantidad <= 0) {
    alert('Por favor, ingrese una cantidad válida.');
    return;
  }
  
  const tasaOrigen = tasasDeCambio[monedaOrigen][tipoOrigen];
  const tasaDestino = tasasDeCambio[monedaDestino][tipoDestino];
  
  const resultado = (cantidad / tasaOrigen) * tasaDestino;
  
  const resultadoElement = document.getElementById('resultado');
  resultadoElement.textContent = `${cantidad} ${monedaOrigen} (${tipoOrigen}) = ${resultado.toFixed(2)} ${monedaDestino} (${tipoDestino})`;
  resultadoElement.classList.add('show');
}

function swapCurrencies() {
  const monedaOrigen = document.getElementById('moneda_origen');
  const monedaDestino = document.getElementById('moneda_destino');
  [monedaOrigen.value, monedaDestino.value] = [monedaDestino.value, monedaOrigen.value];
  
  const tipoOrigen = document.querySelector('input[name="tipo_origen"]:checked');
  const tipoDestino = document.querySelector('input[name="tipo_destino"]:checked');
  [tipoOrigen.checked, tipoDestino.checked] = [tipoDestino.checked, tipoOrigen.checked];
}

// Cargar cotizaciones al iniciar
obtenerCotizaciones();
// Actualizar cotizaciones cada hora
setInterval(obtenerCotizaciones, 3600000);