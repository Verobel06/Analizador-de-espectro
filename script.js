let currentQuestionIndex = 0;
let userAnswers = {};
let userName, userLastname, userCedula, userEmail;
const totalPointsPerQuestion = 4;
const selectionPoints = totalPointsPerQuestion / 2;
const justificationPoints = totalPointsPerQuestion / 2;
let quizDuration = 25 * 60;
let timerInterval;
let hasSubmitted = false;

const allQuizData = [
    {
        "question": "¿Cuál es la función principal de la Transformada Rápida de Fourier (FFT) en los analizadores que la emplean?",
        "answerOptions": [
            {"text": "Suprimir la frecuencia fundamental de la señal para medir la distorsión total.", "isCorrect": false},
            {"text": "Transformar la señal del dominio temporal en un espectro de frecuencias, utilizada por los analizadores de Fourier.", "isCorrect": true},
            {"text": "Rechazar señales fuera del rango de medición del instrumento antes del mezclador.", "isCorrect": false},
            {"text": "Variar la frecuencia del oscilador local para visualizar el margen frecuencial de interés.", "isCorrect": false},
            {"text": "Proporcionar la resolución del instrumento mediante el ajuste del ancho de banda del filtro de frecuencia intermedia.", "isCorrect": false}
        ],
        "justification": "El analizador de Fourier transforma la señal en el tiempo en un espectro de frecuencias, y en algunos modelos ejecuta la transformada rápida de Fourier (FFT). Por este motivo, a los analizadores que usan esta técnica también se les conoce como analizadores de tiempo real. Su función es representar de forma rápida el espectro de frecuencias de una señal en la pantalla.",
        "keywords": ["transformar", "dominio temporal", "espectro de frecuencias", "FFT"]
    },
    {
        "question": "¿Cuál de las siguientes afirmaciones describe correctamente la función de un componente clave en el diagrama de bloques de un analizador de espectro superheterodino?",
        "answerOptions": [
            {"text": "El oscilador local se encarga de rectificar la señal para la medición de amplitud.", "isCorrect": false},
            {"text": "El filtro pasabajo (filtro imagen) rechaza señales fuera del rango de medición del instrumento para evitar lecturas erróneas.", "isCorrect": true},
            {"text": "El amplificador logarítmico ajusta el nivel de referencia y calibra la amplitud de la señal de entrada.", "isCorrect": false},
            {"text": "El atenuador calibrado tiene como principal objetivo suavizar el ruido presente en las medidas.", "isCorrect": false},
            {"text": "El filtro IF (Frecuencia Intermedia) se utiliza para limitar el nivel de potencia de la señal de entrada y optimizar el rango dinámico.", "isCorrect": false}
        ],
        "justification": "El filtro pasabajo (filtro imagen) debe ser empleado para rechazar señales fuera del rango de medición del instrumento. Si no se incorporase, podrían entrar frecuencias indeseadas en el mezclador que serían trasladadas a la IF y provocarían una lectura y medida erróneas.",
        "keywords": ["filtro pasabajo", "filtro imagen", "rechaza señales", "evitar lecturas erróneas"]
    },
    {
        "question": "¿Cuál es la principal ventaja de un analizador de espectro sobre un osciloscopio para el análisis de señales complejas?",
        "answerOptions": [
            {"text": "Permite visualizar la función temporal de una señal con mayor detalle.", "isCorrect": false},
            {"text": "Permite descomponer una señal en sus componentes armónicas y visualizarlas en el dominio frecuencial.", "isCorrect": true},
            {"text": "Se utiliza exclusivamente para medir la distorsión armónica total sin identificar armónicos individuales.", "isCorrect": false},
            {"text": "Procesa la señal en paralelo con un gran número de filtros pasabanda contiguos.", "isCorrect": false},
            {"text": "Ofrece un rango de medición inferior a 140 dB.", "isCorrect": false}
        ],
        "justification": "Un osciloscopio permite visualizar la función temporal de una señal, pero no es posible conocer las componentes de frecuencia que la conforman. En cambio, el análisis de espectro permite descomponer una señal en sus componentes armónicas y representar la composición de frecuencias, conocida como espectro de frecuencias, en el dominio frecuencial.",
        "keywords": ["descomponer", "componentes armónicas", "dominio frecuencial", "espectro de frecuencias"]
    },
    {
        "question": "En el diagrama de bloques de un analizador de espectro superheterodino, ¿cuál es la función ideal del mezclador al combinar la señal de entrada (vRF(t)) con la señal del oscilador local (vOL(t))?",
        "answerOptions": [
            {"text": "Amplificar la señal de entrada para mejorar la sensibilidad.", "isCorrect": false},
            {"text": "Filtrar las frecuencias no deseadas antes de la amplificación.", "isCorrect": false},
            {"text": "Actuar como un multiplicador, generando señales cuyas frecuencias son la suma y la resta de las frecuencias de entrada y del oscilador local.", "isCorrect": true},
            {"text": "Rectificar la señal resultante para la medición de amplitud.", "isCorrect": false},
            {"text": "Calibrar la amplitud de la señal de entrada y ajustar el nivel de referencia.", "isCorrect": false}
        ],
        "justification": "El método heterodino consiste en mezclar cada armónica de la señal de entrada con una señal del oscilador local. El mezclador funciona idealmente como un multiplicador, lo que origina dos señales cuyas frecuencias serán la suma y resta de la frecuencia del oscilador local y la frecuencia de la señal de entrada.",
        "keywords": ["mezclador", "multiplicador", "suma", "resta", "frecuencias"]
    },
    {
        "question": "¿Cuál es la función principal del Filtro IF (Frecuencia Intermedia) en un analizador de espectro, y cómo su ancho de banda afecta el rendimiento del instrumento?",
        "answerOptions": [
            {"text": "Suprimir la frecuencia fundamental de la señal.", "isCorrect": false},
            {"text": "Rechazar señales fuera del rango de medición del instrumento.", "isCorrect": false},
            {"text": "Proporcionar la resolución del instrumento; un filtro más estrecho permite diferenciar mejor dos componentes espectrales cercanas.", "isCorrect": true},
            {"text": "Calibrar la amplitud de la señal de entrada y ajustar el nivel de referencia.", "isCorrect": false},
            {"text": "Suavizar el ruido presente en las medidas y distinguir señales con un nivel cercano al de ruido.", "isCorrect": false}
        ],
        "justification": "El Filtro IF tiene como su función principal proporcionar la resolución del instrumento, la cual se basa en el ancho de banda (BW) del filtro. Cuanto más estrecho es el filtro, mejor se podrá diferenciar en la pantalla dos componentes espectrales cercanas.",
        "keywords": ["filtro IF", "resolución", "ancho de banda", "filtro más estrecho"]
    },
    {
        "question": "¿Cuál es el propósito del filtro de vídeo (VBW) en un analizador de espectro, y cuál es su relación con el ancho de banda del filtro IF (RBW)?",
        "answerOptions": [
            {"text": "Define la resolución del instrumento y su frecuencia de corte debe ser mayor o igual al RBW.", "isCorrect": false},
            {"text": "Permite un filtrado posterior para suavizar el ruido presente en las medidas, y su frecuencia de corte (VBW) debe ser menor que la del filtro IF para ser efectivo.", "isCorrect": true},
            {"text": "Convierte las componentes espectrales a una frecuencia intermedia fija.", "isCorrect": false},
            {"text": "Controla el barrido del oscilador local para visualizar el margen frecuencial de interés.", "isCorrect": false},
            {"text": "Optimiza el rango dinámico de medición manteniendo la señal por debajo de un umbral en el mezclador.", "isCorrect": false}
        ],
        "justification": "El filtro de vídeo (VBW) se emplea para suavizar el ruido presente en las medidas. Para que sea efectivo, su frecuencia de corte (VBW) tiene que ser menor que la del filtro IF.",
        "keywords": ["filtro de vídeo", "VBW", "suavizar el ruido", "menor que el filtro IF"]
    },
    {
        "question": "¿Cuál es la aplicación principal que cumple un analizador de espectro?",
        "answerOptions": [
            {"text": "Visualizar exclusivamente la función temporal de una señal para analizar su forma de onda.", "isCorrect": false},
            {"text": "Determinar la distorsión armónica total de una señal sin identificar armónicos individuales.", "isCorrect": false},
            {"text": "Representar en una pantalla las componentes espectrales (frecuencia y amplitud) de una señal de entrada.", "isCorrect": true},
            {"text": "Transformar señales del dominio temporal a un espectro de frecuencias utilizando la Transformada Rápida de Fourier (FFT) en el rango de DC a 100 KHz.", "isCorrect": false},
            {"text": "Suavizar el ruido presente en las medidas a la salida del detector para una mejor visualización.", "isCorrect": false}
        ],
        "justification": "A diferencia de un osciloscopio que visualiza la función temporal, el analizador de espectro está diseñado para representar en una pantalla las componentes espectrales de una señal de entrada de forma rápida y sencilla. Esto implica mostrar las componentes armónicas que componen una señal compleja, graficando sus amplitudes en función de su frecuencia. La composición de frecuencias de la serie de Fourier es lo que se conoce como el espectro de frecuencias de la señal. Esta capacidad fundamental permite observar y medir el nivel de la potencia y la frecuencia de las componentes espectrales, lo cual a su vez habilita otras mediciones como la estabilidad, la distorsión, el tipo de modulación y el ruido.",
        "keywords": ["representar", "componentes espectrales", "frecuencia", "amplitud", "pantalla"]
    }
];

let quizData = [];

function selectRandomQuestions(arr, num) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
}

function evaluateJustification(userJustification, keywords) {
    if (!userJustification || userJustification.trim().length === 0) {
        return 0;
    }
    const userText = userJustification.toLowerCase();
    for (const keyword of keywords) {
        if (userText.includes(keyword.toLowerCase())) {
            return justificationPoints;
        }
    }
    return 0;
}

function startTimer() {
    const timerDisplay = document.getElementById('timer-display');
    timerInterval = setInterval(() => {
        const minutes = Math.floor(quizDuration / 60);
        const seconds = quizDuration % 60;
        timerDisplay.textContent = `Tiempo restante: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

        if (quizDuration <= 0) {
            clearInterval(timerInterval);
            if (!hasSubmitted) {
                alert("¡Se acabó el tiempo! El quiz se enviará automáticamente.");
                submitQuiz();
            }
        }
        quizDuration--;
    }, 1000);
}

function handleVisibilityChange() {
    if (document.visibilityState === 'hidden' && !hasSubmitted) {
        alert("Has cambiado de pestaña. El examen se ha enviado automáticamente.");
        submitQuiz();
    }
}

function startQuiz() {
    userName = document.getElementById('userNameInput').value.trim();
    userLastname = document.getElementById('userLastnameInput').value.trim();
    userCedula = document.getElementById('userCedulaInput').value.trim();
    userEmail = document.getElementById('userEmailInput').value.trim();

    document.querySelectorAll('input').forEach(input => {
        input.style.border = '2px solid #bdc3c7';
    });

    if (!userName || !userLastname || !userCedula || !userEmail) {
        if (!userName) document.getElementById('userNameInput').style.border = '2px solid #e74c3c';
        if (!userLastname) document.getElementById('userLastnameInput').style.border = '2px solid #e74c3c';
        if (!userCedula) document.getElementById('userCedulaInput').style.border = '2px solid #e74c3c';
        if (!userEmail) document.getElementById('userEmailInput').style.border = '2px solid #e74c3c';
        alert('Por favor, completa todos los datos de manera adecuada antes de comenzar el quiz.');
        return;
    }
    
    quizData = selectRandomQuestions(allQuizData, 5);
    currentQuestionIndex = 0;
    userAnswers = {};
    
    document.getElementById('user-info-section').style.display = 'none';
    document.getElementById('quiz-section').style.display = 'block';
    document.getElementById('warning-message').style.display = 'block';

    startTimer();
    showQuestion();

    document.addEventListener('visibilitychange', handleVisibilityChange);
}

function showQuestion() {
    const quizContent = document.getElementById('quiz-content');
    quizContent.innerHTML = '';
    const questionData = quizData[currentQuestionIndex];
    const questionBox = document.createElement('div');
    questionBox.classList.add('question-box');
    
    questionBox.innerHTML = `
        <h2>Pregunta ${currentQuestionIndex + 1}:</h2>
        <p>${questionData.question}</p>
    `;

    const optionsContainer = document.createElement('div');
    questionData.answerOptions.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.classList.add('answer-option');
        optionElement.textContent = option.text;
        optionElement.onclick = () => selectAnswer(index);
        optionsContainer.appendChild(optionElement);

        if (userAnswers[currentQuestionIndex] && userAnswers[currentQuestionIndex].selectedIndex === index) {
            optionElement.classList.add('selected');
        }
    });

    const justificationTitle = document.createElement('h4');
    justificationTitle.textContent = "Justifique su respuesta";
    justificationTitle.style.marginTop = '20px';

    const justificationInput = document.createElement('textarea');
    justificationInput.classList.add('justification-area');
    justificationInput.placeholder = "Escribe aquí tu justificación (máximo 200 letras)...";
    justificationInput.id = `justification-${currentQuestionIndex}`;
    justificationInput.oninput = () => updateJustificationAndCount();
    
    const wordCountDisplay = document.createElement('div');
    wordCountDisplay.classList.add('word-count');
    wordCountDisplay.id = `word-count-${currentQuestionIndex}`;

    if (userAnswers[currentQuestionIndex] && userAnswers[currentQuestionIndex].userJustification) {
        justificationInput.value = userAnswers[currentQuestionIndex].userJustification;
    }

    updateCharCount(justificationInput.value, wordCountDisplay);

    questionBox.appendChild(optionsContainer);
    questionBox.appendChild(justificationTitle);
    questionBox.appendChild(justificationInput);
    questionBox.appendChild(wordCountDisplay);
    quizContent.appendChild(questionBox);
    updateNavigationButtons();
}

function updateJustificationAndCount() {
    const textarea = document.getElementById(`justification-${currentQuestionIndex}`);
    const text = textarea.value;
    const charCount = text.length;
    
    const wordCountDisplay = document.getElementById(`word-count-${currentQuestionIndex}`);
    wordCountDisplay.textContent = `${charCount}/200 letras`;

    if (charCount > 200) {
        textarea.value = text.substring(0, 200);
        wordCountDisplay.textContent = '200/200 letras (límite alcanzado)';
    }

    if (userAnswers[currentQuestionIndex]) {
        userAnswers[currentQuestionIndex].userJustification = textarea.value;
    } else {
        userAnswers[currentQuestionIndex] = { userJustification: textarea.value };
    }
}

function updateCharCount(text, displayElement) {
    const charCount = text.length;
    displayElement.textContent = `${charCount}/200 letras`;
}

function selectAnswer(selectedIndex) {
    const questionData = quizData[currentQuestionIndex];
    const textarea = document.getElementById(`justification-${currentQuestionIndex}`);
    
    userAnswers[currentQuestionIndex] = {
        selectedIndex,
        isCorrect: questionData.answerOptions[selectedIndex].isCorrect,
        selectedText: questionData.answerOptions[selectedIndex].text,
        userJustification: textarea ? textarea.value : ''
    };
    showQuestion();
}

function updateNavigationButtons() {
    document.getElementById('prev-btn').style.display = currentQuestionIndex > 0 ? 'inline-block' : 'none';
    document.getElementById('next-btn').style.display = currentQuestionIndex < quizData.length - 1 ? 'inline-block' : 'none';
    document.getElementById('submit-btn').style.display = currentQuestionIndex === quizData.length - 1 ? 'inline-block' : 'none';
}

function showNextQuestion() {
    if (currentQuestionIndex < quizData.length - 1) {
        currentQuestionIndex++;
        showQuestion();
    }
}

function showPrevQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        showQuestion();
    }
}

function submitQuiz() {
    if (hasSubmitted) return;
    hasSubmitted = true;
    clearInterval(timerInterval);
    document.removeEventListener('visibilitychange', handleVisibilityChange);

    let totalScore = 0;
    const totalPossibleScore = quizData.length * totalPointsPerQuestion;
    const resultHTML = quizData.map((q, index) => {
        const userAnswer = userAnswers[index];
        const isCorrect = userAnswer ? userAnswer.isCorrect : false;
        const userJustification = userAnswer && userAnswer.userJustification ? userAnswer.userJustification : "";
        const scoreSelection = isCorrect ? selectionPoints : 0;
        const scoreJustification = evaluateJustification(userJustification, q.keywords);
        const questionText = q.question;
        const correctText = q.answerOptions.find(opt => opt.isCorrect).text;
        const userText = userAnswer ? userAnswer.selectedText : "No respondida";
        const currentQuestionScore = scoreSelection + scoreJustification;
        totalScore += currentQuestionScore;
        const feedbackClass = isCorrect ? 'correct' : 'incorrect';
        return `
            <div class="result-box">
                <h3>Pregunta ${index + 1}: ${questionText}</h3>
                <p>Puntuación por selección: ${scoreSelection}/${selectionPoints}</p>
                <p>Puntuación por justificación: ${scoreJustification}/${justificationPoints}</p>
                <p>Puntuación total por pregunta: ${currentQuestionScore}/${totalPointsPerQuestion}</p>
                <p class="${feedbackClass}">Tu respuesta: ${userText}</p>
                <p>Respuesta correcta: ${correctText}</p>
                <p>Tu justificación: ${userJustification.trim().length > 0 ? userJustification : "No proporcionada"}</p>
                <p>Justificación correcta: ${q.justification}</p>
            </div>
        `;
    }).join('');

    // Enviar resultados al backend y mostrar error si la cédula ya existe
    fetch('/api/resultados', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            nombre: userName,
            apellido: userLastname,
            cedula: userCedula,
            email: userEmail,
            puntuacion: totalScore,
            puntuacionMaxima: totalPossibleScore,
            respuestas: quizData.map((q, index) => {
                const userAnswer = userAnswers[index];
                const isCorrect = userAnswer ? userAnswer.isCorrect : false;
                const userJustification = userAnswer && userAnswer.userJustification ? userAnswer.userJustification : "";
                const scoreSelection = isCorrect ? selectionPoints : 0;
                const scoreJustification = evaluateJustification(userJustification, q.keywords);
                const currentQuestionScore = scoreSelection + scoreJustification;
                return {
                    pregunta: q.question,
                    respuestaUsuario: userAnswer ? userAnswer.selectedText : "No respondida",
                    respuestaCorrecta: q.answerOptions.find(opt => opt.isCorrect).text,
                    esCorrecta: isCorrect,
                    justificacionUsuario: userJustification,
                    justificacionCorrecta: q.justification,
                    puntuacionSeleccion: scoreSelection,
                    puntuacionJustificacion: scoreJustification,
                    puntuacionTotalPregunta: currentQuestionScore
                };
            })
        })
    })
    .then(res => res.json().then(data => ({ status: res.status, body: data })))
    .then(({ status, body }) => {
        if (status === 400) {
            let errorDiv = document.getElementById('error-message');
            if (!errorDiv) {
                errorDiv = document.createElement('div');
                errorDiv.id = 'error-message';
                errorDiv.style.color = 'red';
                errorDiv.style.fontWeight = 'bold';
                errorDiv.style.margin = '20px 0';
                document.querySelector('.quiz-container').prepend(errorDiv);
            }
            errorDiv.textContent = body.message;
            document.getElementById('quiz-content').innerHTML = '';
            document.getElementById('next-btn').style.display = 'none';
            document.getElementById('prev-btn').style.display = 'none';
            document.getElementById('submit-btn').style.display = 'none';
            document.getElementById('timer-display').style.display = 'none';
            return;
        }
        // Mostrar resultados normalmente
        document.getElementById('quiz-content').innerHTML = `
            <h2>Resultados</h2>
            <p>Tu puntuación es: ${totalScore} de ${totalPossibleScore}</p>
            ${resultHTML}
            <button class="download-btn" onclick="downloadCsv()">Descargar Resultados</button>
        `;
        document.getElementById('next-btn').style.display = 'none';
        document.getElementById('prev-btn').style.display = 'none';
        document.getElementById('submit-btn').style.display = 'none';
        document.getElementById('timer-display').style.display = 'none';
    })
    .catch(err => {
        alert('Error al enviar los resultados. Intenta nuevamente.');
    });
}

function generateCsv() {
    let csv = '\uFEFF';
    
    const sanitizeCsv = (text) => `"${(text + '').replace(/"/g, '""')}"`;

    const infoHeaders = ["Nombre", "Apellido", "Cédula", "Email"];
    csv += infoHeaders.map(header => sanitizeCsv(header)).join(';') + '\n';
    csv += [sanitizeCsv(userName), sanitizeCsv(userLastname), sanitizeCsv(userCedula), sanitizeCsv(userEmail)].join(';') + '\n\n';

    const quizHeaders = ["Pregunta", "Tu Respuesta", "Respuesta Correcta", "Puntuación Selección", "Puntuación Justificación", "Puntuación Total", "Tu Justificación", "Justificación Correcta"];
    csv += quizHeaders.map(header => sanitizeCsv(header)).join(';') + '\n';
    
    quizData.forEach((q, index) => {
        const userAnswer = userAnswers[index];
        const isCorrect = userAnswer ? userAnswer.isCorrect : false;
        const userJustification = userAnswer && userAnswer.userJustification ? userAnswer.userJustification : "";

        const scoreSelection = isCorrect ? selectionPoints : 0;
        const scoreJustification = evaluateJustification(userJustification, q.keywords);
        const currentQuestionScore = scoreSelection + scoreJustification;
        
        const row = [
            q.question,
            userAnswer ? userAnswer.selectedText : 'No respondida',
            q.answerOptions.find(opt => opt.isCorrect).text,
            scoreSelection,
            scoreJustification,
            currentQuestionScore,
            userJustification.trim().length > 0 ? userJustification : 'No proporcionada',
            q.justification
        ];

        const sanitizedRow = row.map(cell => sanitizeCsv(cell));
        csv += sanitizedRow.join(';') + '\n';
    });
    
    return csv;
}

function downloadCsv() {
    const csvContent = generateCsv();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `resultados_quiz_${userName}_${userLastname}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } else {
        alert("Tu navegador no admite la descarga automática. Por favor, copia el contenido que se mostrará a continuación y pégalo en un archivo de texto para guardarlo como .csv");
        window.open('data:text/csv;charset=utf-8,' + escape(csvContent));
    }
}