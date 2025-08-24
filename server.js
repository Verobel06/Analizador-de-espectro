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
        'Nombre', 'Apellido', 'Cédula', 'Puntuación', 'Puntuación Máxima', 'Pregunta', 'Respuesta Usuario', 'Respuesta Correcta', 'Es Correcta', 'Justificación Usuario', 'Justificación Correcta'
    ].map(h => `"${h}"`).join(';') + '\n';
    resultados.forEach(r => {
        r.respuestas.forEach(resp => {
            csv += [
                r.nombre,
                r.apellido,
                r.cedula,
                r.puntuacion,
                r.puntuacionMaxima,
                resp.pregunta,
                resp.respuestaUsuario,
                resp.respuestaCorrecta,
                resp.esCorrecta,
                resp.justificacionUsuario,
                resp.justificacionCorrecta
            ].map(val => `"${(val + '').replace(/"/g, '""')}` ).join(';') + '\n';
        });
    });
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="resultados_quiz.csv"');
    res.send(csv);
});
