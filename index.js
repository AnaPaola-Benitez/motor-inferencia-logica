const express = require('express');
const pl = require('tau-prolog');
const fs = require('fs');

const app = express();
app.use(express.json());

// 1. Carga de la Base de Conocimiento
const KNOWLEDGE_BASE_PATH = './knowledge.pl';
const knowledgeBase = fs.readFileSync(KNOWLEDGE_BASE_PATH, 'utf8');

// 2. Programación Funcional: Normalización de la entrada
// Asegura que la consulta termine con un punto (.) para que Prolog pueda evaluarla correctamente.
const normalizeQuery = (query) => {
    const trimmed = query.trim();
    return trimmed.endsWith('.') ? trimmed : `${trimmed}.`;
};

// 3. Capa Asíncrona (Promises) + Motor de Inferencia (Tau Prolog)
// Envuelve la ejecución de Tau Prolog (basada en callbacks) en una Promesa
const evaluatePrologQuery = (queryString) => {
    return new Promise((resolve, reject) => {
        // Inicializa una sesión Prolog
        const session = pl.create(1000); 
        
        session.consult(knowledgeBase, {
            success: function () {
                // Realiza la inferencia basada en reglas
                session.query(queryString, {
                    success: function () {
                        const results = [];
                        
                        // Función recursiva para obtener todas las respuestas posibles
                        const getNextAnswer = () => {
                            session.answer({
                                success: function (answer) {
                                    results.push(session.format_answer(answer));
                                    getNextAnswer();
                                },
                                fail: function () {
                                    // Ya no hay más respuestas (false)
                                    resolve(results.length > 0 ? results : ["false."]);
                                },
                                error: function (err) {
                                    reject(err);
                                },
                                limit: function () {
                                    reject(new Error("Límite de pasos de inferencia excedido"));
                                }
                            });
                        };
                        getNextAnswer();
                    },
                    error: function (err) {
                        reject(new Error(`Error en la consulta lógica: ${err}`));
                    }
                });
            },
            error: function (err) {
                reject(new Error(`Error cargando la base de conocimiento: ${err}`));
            }
        });
    });
};

// 4. Endpoint HTTP /query
app.post('/query', async (req, res) => {
    try {
        const { query } = req.body;
        
        if (!query) {
            return res.status(400).json({ error: "Falta el parámetro 'query' en el body." });
        }

        // El servidor normaliza la entrada
        const normalizedQuery = normalizeQuery(query);
        
        // Maneja la solicitud concurrente usando async/await
        const inferenceResults = await evaluatePrologQuery(normalizedQuery);

        // El resultado es retornado al cliente como respuesta JSON
        res.json({
            success: true,
            query: normalizedQuery,
            results: inferenceResults
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Iniciar el servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Motor de Inferencia Lógica ejecutándose en http://localhost:${PORT}`);
});