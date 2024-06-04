//
const typeTime = document.querySelector("time");
const typeSegment = document.querySelector("segment");
const typeInput = document.querySelector("input");

const initialTime = 30;
const initialText = "when make plan many he under life we few home want more open which little many most like just when make they may say system you";
let words = [];
let currentTypingTime = initialTime;

// functions
function startType() {
    words = initialText.split(" ").slice(0, 26);
    currentTypingTime = initialTime;
    typeTime.textContent = currentTypingTime;
    typeSegment.innerHTML = words.map((word, index) => {
        const characters = word.split("");
        return`
            <word>
                ${characters.map(char => `<char>${char}</char>`)
                .join("")}
            </word>
        `
    }).join("");

    const firstWord = typeSegment.querySelector("word");
    firstWord.classList.add("active")
    firstWord.querySelector("char").classList.add("active");

    const intervalTime = setInterval (() => {
        currentTypingTime--;
        typeTime.textContent = currentTypingTime;
        if(currentTypingTime === 0){
            clearInterval(intervalTime);
            typeTimerEnded();
        }
    }, 1000)
}

function startEvents() {
    document.addEventListener("keydown", () => {
        typeInput.focus();
    });
    typeInput.addEventListener("keydown", onKeyDown);
    typeInput.addEventListener("keyup", onKeyUp);
}

function typeTimerEnded(){
    console.log("Time ended");
}

function onKeyDown(event) {
    const actualWord = typeSegment.querySelector("word.active");
    const actualChar = actualWord.querySelector("char.active");
    const {key} = event;
    if(key === " "){
        event.preventDefault();
        const nextWord = actualWord.nextElementSibling;
        const nextChar = nextWord.querySelector("char");

        actualWord.classList.remove("active", "missed");
        actualChar.classList.remove("active", "last-char");

        nextWord.classList.add("active");
        nextChar.classList.add("active");
        typeInput.value = "";

        const missedChars = actualWord
            .querySelectorAll('char:not(.correct)').length > 0;
        const wordMark = missedChars ? "missed" : "correct";
        actualWord.classList.add(wordMark);
    }

    const wordMarked = typeSegment.querySelectorAll("word.missed");
    if(key === "Backspace"){
        const previousWord = actualWord.previousElementSibling;
        const previousChar = actualChar.previousElementSibling;
        //const nextWord = 
        if(!previousWord && !previousChar){
            event.preventDefault();
            return;
        }
        if(wordMarked && !previousChar){
            event.preventDefault();
            previousWord.classList.remove("missed");
            previousWord.classList.add("active");
        }

        const lastMissedChar = previousWord.querySelector("char:last-child");
        actualChar.classList.remove("active");
        lastMissedChar.classList.add("active");

        typeInput.value = [
            ...previousWord.querySelectorAll("char.correct, char.incorrect")
        ].map(el => { return el.classList.contains("correct") ? el.innerText : "-"})
        .join("")
    }
}

function onKeyUp() {
    const actualWord = typeSegment.querySelector("word.active");
    const actualChar = actualWord.querySelector("char.active");
    const wordChars = actualWord.querySelectorAll("char");

    const trimedWord = actualWord.innerText.trim();
    typeInput.maxLength = trimedWord.length;
    wordChars.forEach(char => char.classList.remove("correct", "incorrect"));
    typeInput.value.split("").forEach((c, i) => {
        const char = wordChars[i];
        const charCheck = trimedWord[i];
        const sameChar = c === charCheck;
        const charClass = sameChar ? "correct" : "incorrect";
        char.classList.add(charClass);
    });

    actualChar.classList.remove("active", "last-char");
    const typedLength = typeInput.value.length;
    const nextChar = wordChars[typedLength];
    if(nextChar){
        nextChar.classList.add("active");
        console.log(nextChar);
    }
   else {
        wordChars[wordChars.length -1].classList.add("active", "last-char");
    }

}
startType();
startEvents();