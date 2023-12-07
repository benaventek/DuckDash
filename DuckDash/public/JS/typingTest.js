let prompt = document.getElementById('prompt');
let restart = document.getElementById('restart');
let timer = document.getElementById('timer');
let accuracy = document.getElementById('accuracy');
let score = document.getElementById('score');
let wpm = document.getElementById('wpm');
let test = document.getElementById('test');
let tests = JSON.parse(document.getElementById('tests').textContent);
tests.forEach((test) => {
  console.log(test.testTitle);
});
let promptDropdown = document.getElementById('promptDropdown');
let promptDropdownDiv = document.getElementById('prompt-dropdown');
let timeDropdown = document.getElementById('timeDropdown');
let timeDropdownDiv = document.getElementById('time-dropdown');
let diffDropdown = document.getElementById('difficultyDropdown');
let diffDropdownDiv = document.getElementById('diff-dropdown');
let focusMessage = document.getElementById('focusmsg');
let prompts = [
  "Can't you see that it's raining outside?",
  "I'm going to the store, and I'll be back by 5:00 PM.",
  "What's your favorite book, and why?",
  "Don't forget to bring your umbrella; it might rain later.",
  "She said, 'I can't believe you did that!'",
];
let started = false;
let forceRestart = false;
let timePassed = 0
function newTest() {
  started = false;
  current = 0;
  furthestReached = 0;
  accuracy.innerHTML = "100%"
  wpm.innerHTML = "0 WPM"
  timing = false;
  let letters = prompt.querySelectorAll('.letter');
  letters.forEach((letter) => {
    letter.classList.remove('current');
    letter.classList.remove('next');
    letter.classList.remove('correct');
    letter.classList.remove('incorrect');
  });
  numwrong = [];
  if (timeDropdown.value === '15s') {
    timer.innerHTML = '15 Seconds';
  } else if (timeDropdown.value === '30s') {
    timer.innerHTML = '30 Seconds';
  } else if (timeDropdown.value === '1m') {
    timer.innerHTML = '60 Seconds';
  }
  timePassed = 0
  return;
}

promptDropdown.addEventListener('change', () => {
  if (promptDropdown.value === 'random') {
    timeDropdownDiv.hidden = false;
    diffDropdownDiv.hidden = false;
  } else {
    timeDropdownDiv.hidden = true;
    diffDropdownDiv.hidden = true;
  }
});

promptDropdown.addEventListener('change', () => {
  if (promptDropdown.value === 'option2') {
    quoteToWrite = prompts[0];
  } else if (promptDropdown.value === 'option3') {
    quoteToWrite = prompts[1];
  } else if (promptDropdown.value === 'option4') {
    quoteToWrite = prompts[2];
  } else if (promptDropdown.value === 'option5') {
    quoteToWrite = prompts[3];
  } else if (promptDropdown.value === 'random') {
    quoteToWrite = prompts[Math.floor(Math.random() * prompts.length)];
  }
  forceRestart = true;
  newTest();
  prompt.innerHTML = quoteToWrite;

  let words = quoteToWrite.split(' ');
  let wordDivs = words.map((word, index) => {
    let div = document.createElement('div');
    div.classList.add('word');

    if (index !== 0) {
      let spaceSpan = document.createElement('span');
      spaceSpan.innerHTML = '&nbsp;';
      spaceSpan.classList.add('letter', 'space');
      div.appendChild(spaceSpan);
    }

    let letters = word.split('');
    let letterSpans = letters.map((letter) => {
      let span = document.createElement('span');
      span.textContent = letter;
      span.classList.add('letter');
      return span;
    });

    letterSpans.forEach((span) => div.appendChild(span));

    return div;
  });

  prompt.innerHTML = '';
  wordDivs.forEach((div) => prompt.appendChild(div));
});

timeDropdown.addEventListener('change', () => {
  forceRestart = true;
  newTest();
});


restart.addEventListener('click', () => {
  forceRestart = true;
  newTest();
});

prompt.addEventListener('focus', () => {
  focusMessage.style.display = 'none';
});

prompt.addEventListener('blur', () => {
  focusMessage.style.display = 'block';
});
function wait() {
  return new Promise(resolve => {
    setTimeout(resolve,10);
  });
}
let timing = false
//Timer
async function startTimer() {
  currtime = 0
  switch (timeDropdown.value) {
    case '15s':
      currtime = 15;
      break;
    case '30s':
      currtime = 30;
      break;
    case '1m':
      currtime = 60;
      break;
    default:
      break;
  }

  while (timePassed < currtime && timing){
    await wait();
    timePassed += .01;
    
    timer.innerHTML = (Math.round((currtime - timePassed) * 100) / 100).toFixed(2) + " Seconds";
  }
  if (timePassed >= currtime){
    timer.innerHTML = "0 Seconds";
  }
  if (forceRestart === true) {
    forceRestart = false;
    if (timeDropdown.value === '15s') {
      timer.innerHTML = '15 Seconds';
    } else if (timeDropdown.value === '30s') {
      timer.innerHTML = '30 Seconds';
    } else if (timeDropdown.value === '1m') {
      timer.innerHTML = '60 Seconds';
    }
    
  }
}

let current = 0;
let numwrong = [];
let words = [];
let wordCount = 0;
let furthestReached = 0;
prompt.addEventListener('keydown', (event) => {
  let keyPress = event.key;
  if (keyPress === 'Shift' || keyPress === 'CapsLock') {
    return;
  }
  if (!started){
    started = true;
    timing = true;
    startTimer();
  }
  let letters = prompt.querySelectorAll('.letter');
  letters.forEach((letter) => {
    letter.classList.remove('current');
    letter.classList.remove('next');
  });
  if (current < letters.length) {
    letters[current].classList.add('current');
    if (current + 1 < letters.length && keyPress !== 'Backspace') {
      letters[current + 1].classList.add('next');
    }
    if (keyPress === ' ') {
      keyPress = ' ';
    }
    if (keyPress === letters[current].textContent) {
      if(keyPress === ' '){
        words[current] = true;
      }
      letters[current].classList.add('correct');
      console.log(
        `Received input: ${keyPress}, Expected input: ${letters[current].textContent}`
      );
      current++;
      furthestReached++;
    }else if (keyPress === 'Backspace' && current > 0) {
      current--;
      letters[current].classList.remove('correct');
      letters[current].classList.remove('incorrect');
      letters[current].classList.add('current');
      letters[current].classList.add('next');
    } else {
      letters[current].classList.add('incorrect');
      numwrong[current] = true
      console.log(
        `Received input: ${keyPress}, Expected input: ${letters[current].textContent}`
      );
      current++;
      furthestReached++;
    }
    let count = 0;
    wordCount = 0;
    for(let i = 0; i <= furthestReached; i++){
      if(numwrong[i]) count++;
      if(words[i]) wordCount++;
    }
    accuracy.innerHTML = 100 - (Math.round((count/(furthestReached)) * 100)).toFixed(0) + "%";
    console.log(furthestReached);
    //words complete / seconds passed * 60 (seconds for minutes)
    let currwpm = wordCount/timePassed * 60
    if(timePassed == 0) currwpm = 0;
    wpm.innerHTML = (Math.round(currwpm)).toFixed(0)  + " WPM";
  }
  //Check if now at the end
  if (current == letters.length){
    for(let i = 0; i <= furthestReached; i++){
      if(words[i]) wordCount++;
    }
    wordCount++;
    console.log('Complete!')
    forceRestart = false;
    timing = false;
  }
});

//TODO:
// 1. Functioning Timer
// 2. Calculate WPM and Accuracy
// 3. Actual random prompts
// 4. Difficulty
// 5. Pull prompts from database somehow
// 6. Make preset prompts
