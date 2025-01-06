const configContainer= document.querySelector(".config-container");
const quizContainer= document.querySelector(".quiz-container");
const answerOptions= document.querySelector(".answer-options");
const nextQuestionBtn= document.querySelector(".next-question-btn");
const questionStatus= document.querySelector(".question-status");
const timerDisplay= document.querySelector(".time-duration");
const resultContainer= document.querySelector(".result-container");

// Quiz State Variables
const QUIZ_TIME_LIMIT= 15;
let currentTime= QUIZ_TIME_LIMIT
let timer= null;
let quizCategory="programming";
let numberOfQuestions=5
let currentQuestion=null;
const questionsIndexHistory=[];
let correctAnswersCount=0;

//Display the quiz result & hide the quiz container
const showQuizResult= ()=> {
    quizContainer.style.display="none";
    resultContainer.style.display="block";

    const resultText= `You answered <b>${correctAnswersCount}</b> out of <b>${numberOfQuestions}</b> questions correctly. Good job!`;
    document.querySelector(".result-message").innerHTML= resultText; 
}

//Clear & reset the timer
const resetTimer= ()=>{
    clearInterval(timer);
    currentTime= QUIZ_TIME_LIMIT;
    timerDisplay.textContent=`${currentTime}s`;

}

//Initialize & start the timer for current question
const startTimer= ()=>{
    timer=setInterval(()=>{
        currentTime--;
        timerDisplay.textContent=`${currentTime}s`;

        if(currentTime<=0){
            clearInterval(timer)
            highlightCorrectAnswer();
            nextQuestionBtn.style.visibility="visible";
            quizContainer.querySelector(".quiz-timer").style.background= "#c31402";

            //  To disable all answer options once one option is selected
            answerOptions.querySelectorAll(".answer-option").forEach(option=>option.style.pointerEvents="none");

        }
    }, 1000);
}

//Fetch a random question from based on the selected category
const getRandomQuestion = () =>{
    const categoryQuestions= questions.find(cat=>cat.category.toLowerCase()===quizCategory.toLowerCase()).questions || [];

    //Show the results if all questions have been used
    if(questionsIndexHistory.length>=Math.min(categoryQuestions.length, numberOfQuestions)){
        return showQuizResult()
    }


    // Filter out already asked questions & choose a random one
    const availableQuestion= categoryQuestions.filter((_, index)=> !questionsIndexHistory.includes(index))
    const randomQuestion=categoryQuestions[Math.floor(Math.random()*categoryQuestions.length)]; 

    questionsIndexHistory.push(categoryQuestions.indexOf(randomQuestion))
    return randomQuestion;
}

//Handle the correct answer option & add icon
const highlightCorrectAnswer=()=>{
    const correctOption= answerOptions.querySelectorAll(".answer-option")[currentQuestion.correctAnswer];
    correctOption.classList.add("correct");
    const iconHTML= `<span class="material-symbols-rounded">check_circle</span>`;
    correctOption.insertAdjacentHTML("beforeend", iconHTML);
}

//Handle the user's answer selection
const handleAnswer=(option, answerIndex)=>{
    clearInterval(timer)

    const isCorrect=currentQuestion.correctAnswer===answerIndex;
    option.classList.add(isCorrect ? 'correct': 'incorrect');
    !isCorrect ? highlightCorrectAnswer(): correctAnswersCount++;

    //Insert icon based on correctness
    const iconHTML= `<span class="material-symbols-rounded">${isCorrect ? 'check_circle'  : 'cancel '} </span>`;
    option.insertAdjacentHTML("beforeend", iconHTML);

    //  To disable all answer options once one option is selected
    answerOptions.querySelectorAll(".answer-option").forEach(option=>option.style.pointerEvents="none");

    nextQuestionBtn.style.visibility="visible";
}

//Render the current question & its options in the quiz
const renderQuestion = () =>{
    currentQuestion= getRandomQuestion();
    if(!currentQuestion) return;

    resetTimer();
    startTimer();

    //Update the UI
    answerOptions.innerHTML="";
    nextQuestionBtn.style.visibility="hidden";
    quizContainer.querySelector(".quiz-timer").style.background= "#32313C";
    document.querySelector(".question-text").textContent= currentQuestion.question;
    questionStatus.innerHTML= `<b>${questionsIndexHistory.length}</b> of <b>${numberOfQuestions}</b> Questions`;

    //Create option <li> elements, append them, and add click event listeners
    currentQuestion.options.forEach((option,index)=>{
        const li=document.createElement("li");
        li.classList.add("answer-option");
        li.textContent= option;
        answerOptions.appendChild(li)
        li.addEventListener("click", ()=>handleAnswer(li, index))
    });
}

//Start the quiz & render the random question
const startQuiz=()=>{
    configContainer.style.display="none"
    quizContainer.style.display="block"

    //Update the quiz category & number of questions
    quizCategory= configContainer.querySelector(".category-option.active").textContent;
    numberOfQuestions= configContainer.querySelector(".question-option.active").textContent;

    renderQuestion();
}

//Highlight the selected option on click->category or no. of questions
document.querySelectorAll(".category-option, .question-option").forEach(option=> {
    option.addEventListener("click", ()=>{
        option.parentNode.querySelector(".active").classList.remove("active");
        option.classList.add("active");
    });
});

// Reset the quiz & return to the configuration container
const resetQuiz=()=>{
    resetTimer();
    correctAnswersCount=0;
    questionsIndexHistory.length=0;
    configContainer.style.display="block"
    resultContainer.style.display="none"
}


nextQuestionBtn.addEventListener("click", renderQuestion);
document.querySelector(".try-again-btn").addEventListener("click", resetQuiz);
document.querySelector(".start-quiz-btn").addEventListener("click", startQuiz);

