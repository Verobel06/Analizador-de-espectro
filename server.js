const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Endpoint para recibir y guardar resultados
app.post('/api/resultados', (req, res) => {
    const resultado = req.body;
    const filePath = path.join(__dirname, 'resultados.json');
    let resultados = [];
    if (fs.existsSync(filePath)) {
        resultados = JSON.parse(fs.readFileSync(filePath));
    }
    // Se elimina la validación para permitir múltiples envíos con la misma cédula
    resultados.push(resultado);
    fs.writeFileSync(filePath, JSON.stringify(resultados, null, 2));
    res.status(200).json({ message: 'Resultado guardado correctamente.' });
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});

// Servir el frontend solo para rutas que no sean /api/*
app.get(/^((?!\/api\/).)*$/, (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Endpoint para descargar resultados en formato CSV
app.get('/api/resultados/excel', (req, res) => {
    const filePath = path.join(__dirname, 'resultados.json');
    if (!fs.existsSync(filePath)) {
        return res.status(404).send('No hay resultados guardados.');
    }
    const resultados = JSON.parse(fs.readFileSync(filePath));
    let csv = '\uFEFF'; // BOM para Excel
    // Encabezados generales
    csv += [
        'Nombre', 'Apellido', 'Escuela', 'Cédula', 'Email', 'Puntuación'
    ].map(h => `"${h}"`).join(';') + '\n';
    resultados.forEach(r => {
        r.respuestas.forEach(resp => {
            csv += [
                r.nombre,
                r.apellido,
                r.escuela,
                r.cedula,
                r.email,
                r.puntuacion,
                r.puntuacionMaxima,
                resp.pregunta,
                resp.respuestaUsuario,
                resp.respuestaCorrecta,
                resp.esCorrecta,
                resp.justificacionUsuario,
                resp.justificacionCorrecta,
                resp.puntuacionSeleccion,
                resp.puntuacionJustificacion,
                resp.puntuacionTotalPregunta
            ].map(val => `"${(val + '').replace(/"/g, '""')}"`).join(';') + '\n';
        });
    });
    res.header('Content-Type', 'text/csv; charset=utf-8');
    res.header('Content-Disposition', 'attachment; filename="resultados.csv"');
    res.send(csv);
});

// Servir archivos estáticos como CSS, JS y assets
app.use(express.static(__dirname));