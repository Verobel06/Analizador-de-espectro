let currentQuestionIndex = 0;
    let userAnswers = {};
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
            "justification": "El documento define el analizador de espectro como un instrumento que representa las componentes espectrales de una señal de entrada y permite medir el nivel de potencia y la frecuencia de estas componentes."
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
            "justification": "El documento establece que el filtro IF tiene como función principal proporcionar la resolución del instrumento, la cual se basa en su ancho de banda, conocido como filtro de resolución (BWres)."
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
            "justification": "El documento define la intermodulación como el efecto que se produce cuando dos tonos entran en el sistema no lineal, generando armónicos cercanos a los tonos principales, que pueden ser medidos con el analizador."
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
            "justification": "El documento describe el ruido de fase como un incremento en el ruido de fondo en las cercanías de la señal, lo que puede ocultar señales más pequeñas."
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
            "justification": "El documento afirma que un menor ancho de banda de resolución (RBW) reduce la potencia de ruido a la salida y mejora la relación señal a ruido, lo que aumenta la sensibilidad del analizador."
        }
    ];

    function startTimer() {
        const timerDisplay = document.getElementById('timer-display');
        timerInterval = setInterval(() => {
            const minutes = Math.floor(quizDuration / 60);
            const seconds = quizDuration % 60;
            timerDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

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
        const userName = document.getElementById('userNameInput').value.trim();
        const userLastname = document.getElementById('userLastnameInput').value.trim();
        const userCedula = document.getElementById('userCedulaInput').value.trim();

        document.querySelectorAll('input').forEach(input => {
            input.style.border = '2px solid #bdc3c7';
        });

        if (!userName || !userLastname || !userCedula) {
            if (!userName) document.getElementById('userNameInput').style.border = '2px solid #e74c3c';
            if (!userLastname) document.getElementById('userLastnameInput').style.border = '2px solid #e74c3c';
            if (!userCedula) document.getElementById('userCedulaInput').style.border = '2px solid #e74c3c';
            alert('Por favor, completa todos tus datos antes de comenzar el quiz.');
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

        const justificationInput = document.createElement('textarea');
        justificationInput.classList.add('justification-area');
        justificationInput.placeholder = "Escribe aquí tu justificación (máximo 200 palabras)...";
        justificationInput.id = `justification-${currentQuestionIndex}`;
        justificationInput.oninput = () => updateJustificationAndCount();
        
        const wordCountDisplay = document.createElement('div');
        wordCountDisplay.classList.add('word-count');
        wordCountDisplay.id = `word-count-${currentQuestionIndex}`;
        wordCountDisplay.textContent = '0/200 palabras';

        if (userAnswers[currentQuestionIndex] && userAnswers[currentQuestionIndex].userJustification) {
            justificationInput.value = userAnswers[currentQuestionIndex].userJustification;
            updateWordCount(justificationInput.value, wordCountDisplay);
        }

        questionBox.appendChild(optionsContainer);
        questionBox.appendChild(justificationInput);
        questionBox.appendChild(wordCountDisplay);
        quizContent.appendChild(questionBox);
        updateNavigationButtons();
    }

    function updateJustificationAndCount() {
        const textarea = document.getElementById(`justification-${currentQuestionIndex}`);
        const text = textarea.value.trim();
        const wordCount = text ? text.split(/\s+/).length : 0;
        
        const wordCountDisplay = document.getElementById(`word-count-${currentQuestionIndex}`);
        wordCountDisplay.textContent = `${wordCount}/200 palabras`;

        if (wordCount > 200) {
            const words = text.split(/\s+/).slice(0, 200).join(' ');
            textarea.value = words;
            wordCountDisplay.textContent = '200/200 palabras (límite alcanzado)';
        }

        if (userAnswers[currentQuestionIndex]) {
            userAnswers[currentQuestionIndex].userJustification = textarea.value;
        } else {
            userAnswers[currentQuestionIndex] = { userJustification: textarea.value };
        }
    }
    
    function updateWordCount(text, displayElement) {
        const wordCount = text.split(/\s+/).length;
        displayElement.textContent = `${wordCount}/200 palabras`;
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
        const totalPossibleScore = quizData.length * selectionPoints;

        const resultHTML = quizData.map((q, index) => {
            const userAnswer = userAnswers[index];
            const isCorrect = userAnswer ? userAnswer.isCorrect : false;
            const questionText = q.question;
            const correctText = q.answerOptions.find(opt => opt.isCorrect).text;
            const userText = userAnswer ? userAnswer.selectedText : "No respondida";
            const userJustification = userAnswer && userAnswer.userJustification ? userAnswer.userJustification : "No proporcionada";
            
            let questionScore = 0;
            if (isCorrect) {
                questionScore = selectionPoints;
                totalScore += questionScore;
            }

            const feedbackClass = isCorrect ? 'correct' : 'incorrect';

            return `
                <div class="result-box">
                    <h3>Pregunta ${index + 1}: ${questionText}</h3>
                    <p>Puntuación por selección: ${isCorrect ? selectionPoints : 0}/${selectionPoints}</p>
                    <p>Puntuación por justificación: **A evaluar manualmente** (0-${justificationPoints} puntos)</p>
                    <p class="${feedbackClass}">Tu respuesta: ${userText}</p>
                    <p>Respuesta correcta: ${correctText}</p>
                    <p>Tu justificación: ${userJustification}</p>
                    <p>Justificación correcta: ${q.justification}</p>
                </div>
            `;
        }).join('');

        document.getElementById('quiz-content').innerHTML = `
            <h2>Resultados</h2>
            <p>Tu puntuación es: ${totalScore} de ${totalPossibleScore} (Puntuación final pendiente de la evaluación de la justificación)</p>
            ${resultHTML}
        `;
        document.getElementById('next-btn').style.display = 'none';
        document.getElementById('prev-btn').style.display = 'none';
        document.getElementById('submit-btn').style.display = 'none';
        document.getElementById('timer-display').style.display = 'none';
    }