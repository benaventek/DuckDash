let prompt = document.getElementById('prompt');
let restart = document.getElementById('restart');
let timer = document.getElementById('timer');
let score = document.getElementById('score');
let test = document.getElementById('test');
let focusMessage = document.getElementById('focusmsg');
let prompts = [
  "Can't you see that it's raining outside?",
  "I'm going to the store, and I'll be back by 5:00 PM.",
  "What's your favorite book, and why?",
  "Don't forget to bring your umbrella; it might rain later.",
  "She said, 'I can't believe you did that!'",
];

restart.addEventListener('click', () => {
  current = 0;
  let quoteToWrite = prompts[Math.floor(Math.random() * prompts.length)];
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

prompt.addEventListener('focus', () => {
  focusMessage.style.display = 'none';
});

prompt.addEventListener('blur', () => {
  focusMessage.style.display = 'block';
});

let current = 0;
prompt.addEventListener('keyup', (event) => {
  let keyPress = event.key;
  if (keyPress === 'Shift') {
    return;
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
      letters[current].classList.add('correct');
      console.log(
        `Received input: ${keyPress}, Expected input: ${letters[current].textContent}`
      );
      current++;
    } else if (keyPress === letters[current].textContent) {
      letters[current].classList.add('correct');
      console.log(
        `Received input: ${keyPress}, Expected input: ${letters[current].textContent}`
      );
      current++;
    } else if (keyPress === 'Backspace' && current > 0) {
      current--;
      letters[current].classList.remove('correct');
      letters[current].classList.remove('incorrect');
      letters[current].classList.add('current');
      letters[current].classList.add('next');
    } else {
      letters[current].classList.add('incorrect');
      console.log(
        `Received input: ${keyPress}, Expected input: ${letters[current].textContent}`
      );
      current++;
    }
  }
});
