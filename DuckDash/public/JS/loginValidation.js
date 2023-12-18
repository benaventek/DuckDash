let loginForm = document.getElementById('login-form');
let password = document.getElementById('passwordInput');

if (loginForm) {
  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    let errorMessages = [];
    if (!password.value) {
      errorMessages.push('Password input is required!');
    }
    password.value = password.value.trim();
    if (password.value.length < 8 || password.value.length > 14) {
      errorMessages.push('Password must be between 8 and 14 characters!');
    }
    if (password.value.includes(' ')) {
      errorMessages.push('Password cannot contain spaces!');
    }
    if (password.value.match(/[A-Z]/) === null) {
      errorMessages.push(
        'Password must contain at least one uppercase letter!'
      );
    }
    if (!password.value.match(/[0-9]/g)) {
      errorMessages.push('Password must contain at least one number!');
    }
    if (!password.value.match(/[!@#$%^&*]/g)) {
      errorMessages.push(
        'Password must contain at least one special character!'
      );
    }
    if (errorMessages.length > 0) {
      let errorString = errorMessages.join('\n');
      alert(errorString);
    } else {
      loginForm.submit();
    }
  });
}
