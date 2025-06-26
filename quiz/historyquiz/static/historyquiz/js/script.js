
const allElementsShuffle = document.querySelectorAll('.quiz__answer')
const popUpQuiz = document.querySelector('.quiz')
const quizList = document.querySelector('.quiz__list')
const quizItems = document.querySelectorAll('.quiz__item')
const nextQuestion = document.querySelectorAll('.next_question')
const AllRadioButton = document.querySelectorAll('.quiz input[type="radio"]')
const quizCloseBtn = document.querySelectorAll('.quiz__close')
const quizQuestions = document.querySelectorAll('.quiz__qustion')
const btnQuestionAnswer = document.querySelectorAll('.quiz__btn-answer')
const startQuiz = document.querySelector('.start_quiz')
const endQuiz = document.querySelector('.quiz__end')
const finalMessage = document.querySelector('.finalMes')
const finalQuizItem = document.querySelector('.quiz__item-finish')
const answers_text = document.querySelectorAll('.quiz__item input[type="text"]')
const answers_mes = document.querySelectorAll('.quiz__answer_mes')

let index_quiz = 0
let answers = {}
let count_question = quizItems.length - 1
let correctly_answered = 0

function startOver() {
    index_quiz = 0
    correctly_answered = 0
    answers = {}
    quizList.style.transform = 'translateX(0)'

    answers_mes.forEach(elem=>{
        elem.style.color = "#771616"
        elem.style.display = "none"

        elem.innerHTML = "Правильный ответ:<br>" + elem.parentNode.querySelector('input').dataset.correct

    })

    answers_text.forEach(elem => {
        elem.disabled = false
        elem.value = ""
    })

    AllRadioButton.forEach(elem => {
        elem.checked = false
        elem.disabled = false
        elem.parentNode.classList.remove('true_answer')
        elem.parentNode.classList.remove('false_answer')
    })
    allElementsShuffle.forEach(element => {
        if (element.children.length > 0) {
            shuffleChildren(element)
        }
    })
    btnQuestionAnswer.forEach(elem => {
        elem.disabled = true
    })
    btnQuestionAnswer.forEach(elem=>{
        elem.style.display = "block"
    })
    nextQuestion.forEach(elem=>{
        elem.style.display = "none"
    })
    popUpQuiz.style.display = "none"
    document.body.style.overflow = 'auto'
}

function shuffleChildren(element) {
    const children = Array.from(element.children)
    children.sort(() => Math.random() - 0.5)
    children.forEach(child => element.appendChild(child))
}

function sendAnswer(answer_data) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/stat/', true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    xhr.setRequestHeader('X-CSRFToken', csrfToken);

    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            console.log('Успех:', xhr.responseText);
        } else {
            console.error('Ошибка:', xhr.statusText);
        }
    };

    xhr.send(JSON.stringify(answer_data));
}

function moveListQuiz(){
    index_quiz += 1
    quizList.style.transform = 'translateX(-' + String( index_quiz * 100) + 'vw)'

    if (index_quiz == count_question) {
        sendAnswer(answers)
        ShowFinalMessage()
    }
}

function ShowFinalMessage(){
    let halfQuestions = count_question / 2
    if (correctly_answered == count_question) {
        finalMessage.innerHTML = correctly_answered + "/" + count_question + " правильных ответов <br> &#128562; Ты супер! Так держать!"
    }
    else if (correctly_answered > halfQuestions) {
        finalMessage.innerHTML = correctly_answered + "/" + count_question + " правильных ответов <br> &#128522; Ты молодец!"
    } else {
        finalMessage.innerHTML = correctly_answered + "/" + count_question + " правильных ответов <br> &#129300; Надо еще поучить."
    }
}

function checkAnswer (answer1, answer2) {
    nor_answer1 = answer1.toLowerCase().trim().replace(/\s+/g, ' ').replace(/[-–—]/g, '-')
    nor_answer2 = answer2.toLowerCase().trim().replace(/\s+/g, ' ').replace(/[-–—]/g, '-')

    return nor_answer1 == nor_answer2
}

quizList.style.width = String(quizItems.length * 100) + '%'
allElementsShuffle.forEach(element => {
    if (element.children.length > 0) {
        shuffleChildren(element)
    }
})

shuffleChildren(quizList)
console.log(finalQuizItem)
quizList.appendChild(finalQuizItem)

allElementsShuffle.forEach(element => {
    if (element.children.length > 0) {
        shuffleChildren(element)
    }
})

startQuiz.addEventListener('click', () => {
    popUpQuiz.style.display = "block"
    document.body.style.overflow = 'hidden'
})

nextQuestion.forEach(button => {
    button.addEventListener('click', moveListQuiz)
})

quizCloseBtn.forEach(button => {
    button.addEventListener('click', startOver)
})

endQuiz.addEventListener('click', () => {
    startOver()
})

quizQuestions.forEach(elem => {
    const _btnQuestionAnswer = elem.querySelector('.quiz__btn-answer')
    const _answers = elem.querySelectorAll('input[type="radio"]')
    const _nextQuestion = elem.querySelector('.next_question')
    const _answers_text = elem.querySelector('input[type="text"]')
    const _answers_mes = elem.querySelector('.quiz__answer_mes')

    if (_answers.length > 0){
        _answers.forEach(_elem => {
            _elem.addEventListener('change', () => {
                _btnQuestionAnswer.disabled = false
            })
        })
    } else if (_answers_text) {
        _answers_text.addEventListener('input', function () {
            _btnQuestionAnswer.disabled = false
        })
    }
    _btnQuestionAnswer.addEventListener('click', () => {
        if (_answers.length > 0){
            _answers.forEach(_elem => {
                if (_elem.checked) {
                    if (_elem.dataset.correct == "1") {
                        answers[elem.dataset.id] = true
                        correctly_answered += 1
                    } else {
                        answers[elem.dataset.id] = false
                        _elem.parentNode.classList.add('false_answer')
                    }
                }
                if (_elem.dataset.correct == "1") {
                    _elem.parentNode.classList.add('true_answer')
                }
                _elem.disabled = true
            })
        } else if (_answers_text) {
            let _correctly_answered = _answers_text.dataset.correct
            if (checkAnswer(_answers_text.value, _correctly_answered)) {
                _answers_mes.style.display = "block"
                _answers_mes.innerHTML = "Все правильно!!!"
                _answers_mes.style.color = "#327716"
                correctly_answered += 1
                answers[elem.dataset.id] = true
            } else {
                _answers_mes.style.display = "block"
                answers[elem.dataset.id] = false
            }

            _answers_text.disabled = true
        }
        _btnQuestionAnswer.style.display = "none"
        _nextQuestion.style.display = "block"
    })
})

