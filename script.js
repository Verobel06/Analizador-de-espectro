let currentQuestionIndex = 0;
let userAnswers = {};
let userName, userLastname, userCedula, userEmail;
const totalPointsPerQuestion = 4;
const selectionPoints = totalPointsPerQuestion / 2;
const justificationPoints = totalPointsPerQuestion / 2;
let quizDuration = 25 * 60;
let timerInterval;
let hasSubmitted = false;

const quizData = [
    {
        "question": "Según el documento, ¿cuál es el propósito principal de un analizador de espectro?",
        "answerOptions": [
            {"text": "Visualizar la función temporal de una señal para analizar sus componentes de frecuencia.", "isCorrect": false},
            {"text": "Determinar la distorsión total de una onda sin identificar las armónicas individuales.", "isCorrect": false},
            {"text": "Medir y representar las componentes de frecuencia y el nivel de potencia de una señal.", "isCorrect": true},
            {"text": "Calcular la distorsión armónica total utilizando el puente de Wien.", "isCorrect": false},
            {"text": "Medir la velocidad de barrido del oscilador local en tiempo real.", "isCorrect": false}
        ],
        "justification": "El documento define el analizador de espectro como un instrumento que representa las componentes espectrales de una señal de entrada y permite medir el nivel de potencia y la frecuencia de estas componentes.",
        "keywords": ["representa", "componentes", "frecuencia", "potencia"]
    },
    {
        "question": "¿Qué componente en el diagrama de bloques del analizador de espectro superheterodino de barrido determina principalmente el ancho de banda de resolución (RBW) del instrumento?",
        "answerOptions": [
            {"text": "El atenuador de entrada, que limita el nivel de potencia de la señal.", "isCorrect": false},
            {"text": "El filtro de video (VBW), que suaviza el ruido presente en las medidas.", "isCorrect": false},
            {"text": "El mezclador, que desplaza las componentes de frecuencia a la frecuencia intermedia.", "isCorrect": false},
            {"text": "El filtro IF, cuya función principal es proporcionar la resolución del instrumento.", "isCorrect": true},
            {"text": "El amplificador logarítmico, que procesa la señal en modo logarítmico para medir un amplio rango de señales.", "isCorrect": false}
        ],
        "justification": "El documento establece que el filtro IF tiene como función principal proporcionar la resolución del instrumento, la cual se basa en su ancho de banda, conocido como filtro de resolución (BWres).",
        "keywords": ["filtro IF", "resolución", "ancho de banda"]
    },
    {
        "question": "En el contexto de un analizador de espectro, ¿cuál es el efecto de la distorsión por intermodulación de tercer orden?",
        "answerOptions": [
            {"text": "Produce armónicos a frecuencias múltiples de la fundamental, a partir de un solo tono.", "isCorrect": false},
            {"text": "Genera productos de distorsión a partir de la mezcla de dos tonos, que se añaden a la señal de salida.", "isCorrect": true},
            {"text": "Reduce la sensibilidad del analizador al aumentar el ruido interno del instrumento.", "isCorrect": false},
            {"text": "Provoca que el espectro de la señal se 'manche' debido a la inestabilidad de la frecuencia del oscilador local.", "isCorrect": false},
            {"text": "Permite medir dos señales simultáneamente, incluso si tienen altos niveles de amplitud.", "isCorrect": false}
        ],
        "justification": "El documento define la intermodulación como el efecto que se produce cuando dos tonos entran en el sistema no lineal, generando armónicos cercanos a los tonos principales, que pueden ser medidos con el analizador.",
        "keywords": ["dos tonos", "intermodulación", "armónicos"]
    },
    {
        "question": "Según el texto, ¿qué describe el ruido de fase en un analizador de espectro?",
        "answerOptions": [
            {"text": "La relación entre la señal más grande y la más pequeña que se puede medir sin distorsión.", "isCorrect": false},
            {"text": "El efecto de suavizar el ruido en las medidas utilizando el filtro de video.", "isCorrect": false},
            {"text": "La cantidad de potencia de ruido medida por el detector, que es proporcional al ancho de banda.", "isCorrect": false},
            {"text": "Un incremento en el ruido de fondo cerca de la señal, que puede ocultar otras señales más pequeñas.", "isCorrect": true},
            {"text": "La relación entre el ancho de banda a -3dB y el ancho de banda a -60dB.", "isCorrect": false}
        ],
        "justification": "El documento describe el ruido de fase como un incremento en el ruido de fondo en las cercanías de la señal, lo que puede ocultar señales más pequeñas.",
        "keywords": ["ruido de fase", "ruido de fondo", "ocultar señales"]
    },
    {
        "question": "El documento menciona que la sensibilidad del analizador se puede mejorar. ¿Qué ajuste es el que más influye para lograr una mayor sensibilidad?",
        "answerOptions": [
            {"text": "Aumentar la atenuación del atenuador de RF para limitar la potencia de la señal de entrada.", "isCorrect": false},
            {"text": "Disminuir el ancho de banda del filtro de video (VBW).", "isCorrect": false},
            {"text": "Aumentar el ancho de banda de resolución (RBW) del filtro IF.", "isCorrect": false},
            {"text": "Disminuir el ancho de banda de resolución (RBW) del filtro IF.", "isCorrect": true},
            {"text": "Aumentar la ganancia del amplificador IF.", "isCorrect": false}
        ],
        "justification": "El documento afirma que un menor ancho de banda de resolución (RBW) reduce la potencia de ruido a la salida y mejora la relación señal a ruido, lo que aumenta la sensibilidad del analizador.",
        "keywords": ["disminuir", "ancho de banda", "resolución", "sensibilidad"]
    }
];

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
        alert('Debes rellenar todos los campos correctamente antes de comenzar el examen.');
        return;
    }

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