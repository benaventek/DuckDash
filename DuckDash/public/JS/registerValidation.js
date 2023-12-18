let registerForm = document.getElementById('registration-form');
let displayname = document.getElementById('displaynameInput');
let email = document.getElementById('emailAddressInput');
let password = document.getElementById('passwordInput');
let confirmPassword = document.getElementById('confirmPasswordInput');

if (registerForm) {
  registerForm.addEventListener('submit', (event) => {
    event.preventDefault();
    let errorMessages = [];
    if (!displayname.value) {
      errorMessages.push('Display name input is required!');
    }
    if (!email.value) {
      errorMessages.push('Email input is required!');
    }
    if (!password.value) {
      errorMessages.push('Password input is required!');
    }
    if (!confirmPassword.value) {
      errorMessages.push('Confirm Password input is required!');
    }
    displayname.value = displayname.value.trim();
    password.value = password.value.trim();
    confirmPassword.value = confirmPassword.value.trim();
    if (!displayname.value.match(/^[a-z0-9]+$/i)) {
      errorMessages.push('Display name must be alphanumeric!');
    }
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
    if (password.value !== confirmPassword.value) {
      errorMessages.push('Passwords do not match!');
    }
    if (errorMessages.length > 0) {
      let errorString = errorMessages.join('\n');
      alert(errorString);
    } else {
      registerForm.submit();
    }
  });
}
