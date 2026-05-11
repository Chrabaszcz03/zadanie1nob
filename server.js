require('dotenv').config();

const http = require('http');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const PORT = process.env.PORT || 3000;
const AUTHOR = 'Piotr Chrabaszcz';

// logi startowe
const startTime = new Date().toISOString();
console.log('='.repeat(60));
console.log(`[START] Data uruchomienia : ${startTime}`);
console.log(`[START] Autor             : ${AUTHOR}`);
console.log(`[START] Port TCP          : ${PORT}`);
console.log('='.repeat(60));

// helper do API
async function fetchJSON(url) {
  const res = await axios.get(url);
  return res.data;
}

// pliki statyczne
function serveFile(res, filePath, contentType) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      return res.end('Not found');
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
}

// server
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = url.pathname;

  res.setHeader('Access-Control-Allow-Origin', '*');

  // index
  if (pathname === '/' || pathname === '/index.html') {
    return serveFile(res, path.join(__dirname, 'public', 'index.html'), 'text/html; charset=utf-8');
  }

  // healthcheck
  if (pathname === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({
      status: 'ok',
      uptime: process.uptime()
    }));
  }

//geocoding
  if (pathname === '/api/geocode') {
    const city = url.searchParams.get('city');

    if (!city) {
      res.writeHead(400);
      return res.end(JSON.stringify({ error: 'Brak city' }));
    }

    try {
      const data = await fetchJSON(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=pl&format=json`
      );

      if (!data.results || data.results.length === 0) {
        res.writeHead(404);
        return res.end(JSON.stringify({ error: 'Nie znaleziono' }));
      }

      const loc = data.results[0];

      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({
        name: loc.name,
        country: loc.country,
        latitude: loc.latitude,
        longitude: loc.longitude
      }));

    } catch (e) {
      res.writeHead(500);
      return res.end(JSON.stringify({ error: 'Błąd geocodingu' }));
    }
  }

//pogoda
  if (pathname === '/api/weather') {
    const lat = url.searchParams.get('lat');
    const lon = url.searchParams.get('lon');

    if (!lat || !lon) {
      res.writeHead(400);
      return res.end(JSON.stringify({ error: 'Brak lat/lon' }));
    }

    try {
      const apiUrl =
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
        `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,` +
        `wind_speed_10m,wind_direction_10m,precipitation,surface_pressure` +
        `&timezone=auto&forecast_days=5`;

      const data = await fetchJSON(apiUrl);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(data));

    } catch (e) {
      res.writeHead(500);
      return res.end(JSON.stringify({ error: 'Błąd pogody' }));
    }
  }

  // 404 fallback
  res.writeHead(404);
  res.end('Not found');
});

// start
server.listen(PORT, '0.0.0.0', () => {
  console.log(`[INFO] Serwer działa na porcie ${PORT}`);
});

// shutdown
process.on('SIGTERM', () => server.close(() => process.exit(0)));
process.on('SIGINT', () => server.close(() => process.exit(0)));