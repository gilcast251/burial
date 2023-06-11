const inputCountries = document.querySelector('#input-countries');
const inputUsername = document.querySelector('#input-username');
const inputEmail = document.querySelector('#input-email');
const inputNumber = document.querySelector('#input-number');
const inputPassword = document.querySelector('#input-password');
const inputMatch = document.querySelector('#input-match');
const formBtn = document.querySelector('#form-btn');
const spanCode = document.querySelector('#country-code');

[...inputCountries.children].forEach(option => {
    option.innerHTML = option.innerHTML.split('(')[0];
});

let usernameValidation = false;
let emailValidation = false;
let countryValidation = false;
let numberValidation = false;
let passwordValidation = false;
let passwordMatchValidation = false;

const validation = (input, regexValidation) => {
    formBtn.disabled = !usernameValidation || !emailValidation || !countryValidation || !numberValidation || !passwordValidation || !passwordMatchValidation ? true : false
    if (!regexValidation && input.value !== '') {
        input.parentElement.children[1].classList.add('show')
        input.classList.add('incorrect');
        input.classList.remove('correct');
    } else if (regexValidation) {
        input.parentElement.children[1].classList.remove('show')
        input.classList.remove('incorrect');
        input.classList.add('correct');
    } else if (input.value === '') {
        input.parentElement.children[1].classList.remove('show')
        input.classList.remove('incorrect');
        input.classList.remove('correct');
    }
}

( async () => {
    try {
        const response = await fetch('https://api.geoapify.com/v1/ipinfo?apiKey=075a9b41e69341ee9758b4158674af48', {method: 'GET'});
        const { country } = await response.json();
        [...inputCountries.children].forEach(option => {
            if (option.getAttribute('data-countryCode') === country.iso_code) {
                option.selected = true;
                inputCountries.classList.add('correct');
                spanCode.innerHTML = `+${option.value}`;
                spanCode.classList.add('correct');
                countryValidation = true;
            }
        });
    } catch (error) {
        if (error.message === 'Failed to fetch') {
            alert('No tienes internet!')
        }
        console.log(error.message);
    }
})();

inputUsername.addEventListener('input', e => {
    const USERNAME_REGEX = /^(?=.*[a-z])[a-z0-9].{3,8}$/;
    usernameValidation = USERNAME_REGEX.test(e.target.value);
    validation(inputUsername, usernameValidation);
});

inputEmail.addEventListener('input', e => {
    const EMAIL_REGEX = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    emailValidation = EMAIL_REGEX.test(e.target.value);
    validation(inputEmail, emailValidation);
});

inputNumber.addEventListener('input', e => {
    const NUMBER_REGEX = /^[0-9]{10}$/;
    numberValidation = NUMBER_REGEX.test(e.target.value);
    validation(inputNumber, numberValidation);
});

inputCountries.addEventListener('input', e => {
    const selected = [...e.target.children].find(option => option.selected);
    spanCode.innerHTML = `+${selected.value}`
    spanCode.classList.add('correct');
    countryValidation = selected.value === '' ? false : true;
    validation(inputCountries, countryValidation);
});

inputPassword.addEventListener('input', e => {
    const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[0-9]).{8,24}$/;
    passwordValidation = PASSWORD_REGEX.test(e.target.value);
    passwordMatchValidation = e.target.value === inputMatch.value;
    validation(inputPassword, passwordValidation);
    validation(inputMatch, passwordMatchValidation);
});

inputMatch.addEventListener('input', e => {
    passwordMatchValidation = inputPassword.value === e.target.value;
    validation(inputMatch, passwordMatchValidation);
});

