import { IQuestion } from "/scripts/IQuestion";

const languageEnglishRadio = document.getElementById("language-choice-english") as HTMLInputElement;
const languageDeutschRadio = document.getElementById("language-choice-deutsch") as HTMLInputElement;
const easyLabel = document.getElementById('easy-label') as HTMLLabelElement;
const hardLabel = document.getElementById('hard-label') as HTMLLabelElement;
const difficultyEasyRadio = document.getElementById("difficulty-choice-easy") as HTMLInputElement;
const difficultyHardRadio = document.getElementById("difficulty-choice-hard") as HTMLInputElement;
const languageRadio = document.querySelectorAll('input[name="language"]') as NodeListOf<HTMLInputElement>;
const difficultyRadio = document.querySelectorAll('input[name="difficulty"]') as NodeListOf<HTMLInputElement>;

const loadingIndicator = document.querySelector('.loader') as HTMLSpanElement;
loadingIndicator.style.display = 'none';

function disableRadio(radios: NodeListOf<HTMLInputElement>) {
  radios.forEach((radio) => {
    (radio as HTMLInputElement).disabled = true;
  });
}

languageEnglishRadio.addEventListener("change", () => {
  disableRadio(languageRadio);
  checkAndEnableStartButton();
  if (languageEnglishRadio.checked) {
    handleLanguageChange(languageEnglishRadio.value);
  }
});

languageDeutschRadio.addEventListener("change", () => {
  disableRadio(languageRadio);
  checkAndEnableStartButton();
  if (languageDeutschRadio.checked) {
    handleLanguageChange(languageDeutschRadio.value);
  }
  startButton.innerHTML = 'Starten'
  nextQuestionButton.innerHTML = "Nächste Frage"
});

difficultyEasyRadio.addEventListener("change", () => {
  disableRadio(difficultyRadio);
  checkAndEnableStartButton();
  if (difficultyEasyRadio.checked) {
    handleDifficultyChange(difficultyEasyRadio.value);
  }
});

difficultyHardRadio.addEventListener("change", () => {
  disableRadio(difficultyRadio);
  checkAndEnableStartButton();
  if (difficultyHardRadio.checked) {
    handleDifficultyChange(difficultyHardRadio.value);
  }
});

let language = '';
function handleLanguageChange(selectedLanguage: string): string {
  if (selectedLanguage == 'deutsch') {
    easyLabel.innerHTML = 'Leicht';
    hardLabel.innerHTML = 'Schwer';
  }
  return language = selectedLanguage;
}

let difficulty = '';
function handleDifficultyChange(selectedDifficulty: string): string {
  return difficulty = selectedDifficulty;
}

const startButton = document.getElementById("start-button") as HTMLButtonElement;
const nextQuestionButton = document.getElementById("next-question") as HTMLButtonElement;

startButton.addEventListener('click', () => {
  startButton.style.display = 'none';
  nextQuestionButton.style.display = 'block';
  fetchAndDisplay(fetchQuestions(language, difficulty));
});

function checkAndEnableStartButton() {
  const languageSelected = languageEnglishRadio.checked || languageDeutschRadio.checked;
  const difficultySelected = difficultyEasyRadio.checked || difficultyHardRadio.checked;

  if (languageSelected && difficultySelected) {
    startButton.removeAttribute('disabled');
  } else {
    startButton.setAttribute('disabled', 'true');
  }
}

const BASE_URL = "https://vz-wd-24-01.github.io/typescript-quiz/questions/";

const questionOutput = document.getElementById("question-output") as HTMLDivElement;

function fetchQuestions(language: string, difficulty: string): string {
  if (language == 'english' && difficulty == 'easy') {
    return `${BASE_URL}easy.json`;
  } else if (language == 'english' && difficulty == 'hard') {
    return `${BASE_URL}hard.json`;
  } else if (language == 'deutsch' && difficulty == 'easy') {
    return `${BASE_URL}leicht.json`;
  } else if (language == 'deutsch' && difficulty == 'hard') {
    return `${BASE_URL}schwer.json`;
  }
  return '';
}

function fetchAndDisplay(url: string) {
  loadingIndicator.style.display = 'block';
  if (!url) {
    questionOutput.innerHTML = 'Invalid URL for fetching questions.';
    return;
  }


  fetch(url)
    .then((response: Response) => {
      if (!response.ok) {
        throw Error(`${response.status} ${response.statusText}`);
      }
      return response.json();
    })
    .then((questions: IQuestion[]) => {
      displayQuestions(questions, questionIndex);
      nextQuestionButton.addEventListener("click", () => {
        questionIndex++;
        if (questionIndex < questions.length) {
          displayQuestions(questions, questionIndex);
          if(questionIndex == 19) {
            if(language == 'english') {
              nextQuestionButton.innerHTML = 'Finish'
            } else if (language == 'deutsch') {
              nextQuestionButton.innerHTML = 'Beenden'
            }
          }
        } else {
          questionOutput.innerHTML = "";
          displayResults();
        }
      });
    })
    .catch((error) => {
      questionOutput.innerHTML = `Could not get data. Error: ${error}`;
    })
    .finally(() => {
      loadingIndicator.style.display = 'none';
    });
}

let questionIndex = 0;
let correctAnswers = 0;
let wrongAnswers = 0;

function displayQuestions(questions: IQuestion[], index: number) {
  if (questionOutput) {
    questionOutput.innerHTML = "";

    const questionForm = document.createElement("form");
    questionOutput.appendChild(questionForm);

    const headline = document.createElement("h2");
    headline.setAttribute('id', 'headline');
    if (index < questions.length) {
      headline.innerHTML = questions[index].question;
    } else {
      return;
    }
    questionForm.appendChild(headline);
    const questionCounterInOutput = document.createElement('h5');
    if(language == 'english') {
      questionCounterInOutput.innerHTML= `Question ${questionIndex +1} from ${questions.length}`
    } else if (language == 'deutsch') {
      questionCounterInOutput.innerHTML= `Frage ${questionIndex +1} von ${questions.length}`
    }
    questionOutput.appendChild(questionCounterInOutput)

    let answerIndex = 0;

    questions[index].answers.forEach((answer) => {
      const optionsDiv = document.createElement('div');
      questionForm.appendChild(optionsDiv);
      const radioOption = document.createElement("input");
      radioOption.setAttribute("name", "option");
      radioOption.setAttribute("type", "radio");
      radioOption.setAttribute("id", answer);
      radioOption.setAttribute("value", answerIndex.toString());
      optionsDiv.appendChild(radioOption);

      const radioLabel = document.createElement("label");
      radioLabel.setAttribute('id', 'radiolabel');
      radioLabel.setAttribute("for", answer);
      radioLabel.innerHTML = answer;
      optionsDiv.appendChild(radioLabel);

      const answerOutput = document.createElement("h2");
      answerOutput.setAttribute('id', 'answerOutput');
      questionOutput.appendChild(answerOutput);

      let currentAnswerIndex = answerIndex;
      radioOption.addEventListener("change", (event: Event) => {
        event.preventDefault();
        if (currentAnswerIndex == questions[index].correct) {
          correctAnswers++;
          answerOutput.style.color = 'green';
          if (language == 'english') {
            answerOutput.innerHTML = "Correct :)";
          } else if (language == 'deutsch') {
            answerOutput.innerHTML = "Korrekt :)";
          }
        } else {
          wrongAnswers++;
          answerOutput.style.color = 'red';
          if (language == 'english') {
            answerOutput.innerHTML = "Wrong :(";
          } else if (language == 'deutsch') {
            answerOutput.innerHTML = "Falsch :(";
        }
        }
        nextQuestionButton.removeAttribute('disabled');
      });
      answerIndex++;
    });
    nextQuestionButton.setAttribute('disabled', 'true');
  }
}

function displayResults() {
  const resultOutput = document.createElement('h1');
  resultOutput.setAttribute('id', 'resultOutput');
  questionOutput.appendChild(resultOutput);
  if (language == 'english') {
    resultOutput.innerHTML = `You had ${correctAnswers} correct answers and ${wrongAnswers} wrong answers.`;
  } else if (language == 'deutsch') {
    resultOutput.innerHTML = `Du hattest ${correctAnswers} richtige Antworten und ${wrongAnswers} falsche Antworten.`;
  }
  nextQuestionButton.style.display = 'none';
}
