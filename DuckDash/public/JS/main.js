let prompt = document.getElementById('prompt');
let restart = document.getElementById('restart');
let timer = document.getElementById('timer');
let score = document.getElementById('score');
let test = document.getElementById('test');
let focusMessage = document.getElementById('focusmsg');
let testPrompt =
  'hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man hey wtf man ';

restart.addEventListener('click', () => {
  prompt.innerHTML = testPrompt;

  let words = testPrompt.split(' ');
  let wordDivs = words.map((word) => {
    let div = document.createElement('div');
    div.classList.add('word');

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
