/* eslint-disable no-param-reassign */
/* eslint-disable no-shadow */
/* eslint-disable no-undef */
const display = document.querySelector('.next');
const add = document.querySelector('.form-container');
const form = document.querySelector('#form');
const goBack = document.querySelector('.go_back');
const input = document.querySelectorAll('input');
const no = document.querySelector('.no');
const image = document.querySelector('img');
const userName = document.querySelector('.user-name');
const userEmail = document.querySelector('.user-email');
const detailss = document.querySelector('.user-details');
const spinner = document.querySelector('.spinner');

spinner.style.display = 'none';

detailss.style.opacity = '0';

let checker = false;
const pattern = {
  password: /^[\w@-]{8,20}$/,
  email: /^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/,
};

function validate(field, regex) {
  if (regex.test(field.value)) {
    field.className = 'valid';
    checker = true;
  } else {
    field.className = 'invalid';
    checker = false;
  }
}

input.forEach((input) => {
  input.addEventListener('keyup', (e) => {
    validate(e.target, pattern[e.target.attributes.name.value]);
  });
});

const getLoginDetails = () => {
  const email = document.querySelectorAll('input')[1].value;
  const password = document.querySelectorAll('input')[2].value;
  const obj = { email, password };
  return obj;
};

const getUser = () => {
  const email = document.querySelectorAll('input')[1].value;
  const obj = { email };
  return obj;
};

let submitFlag = false;

display.addEventListener('click', async (event) => {
  event.preventDefault();
  display.classList.remove('effect');
  display.classList.add('uuu');
  spinner.style.display = 'initial';
  display.disable = true;

  try {
    const details = getUser();
    if (input[1].value === '') {
      spinner.style.display = 'none';
      display.classList.add('effect');
      display.classList.remove('uuu');
      no.style.display = 'block';
      setTimeout(() => { no.style.display = 'none'; }, 3000);
    } else if (!checker) {
      no.style.display = 'none';
      spinner.style.display = 'none';
      display.classList.add('effect');
      display.classList.remove('uuu');
    }

    if (checker && !submitFlag) {
      const url = `${devURL}user`;
      const { responseObj, statusCode } = await fetcher(url, 'POST', details);

      if (statusCode === 200) {
        add.classList.add('move-left');
        add.classList.remove('move-right');
        console.log(responseObj);
        userName.textContent = `${responseObj.data.first_name} ${responseObj.data.last_name}`;
        userEmail.textContent = `${responseObj.data.email}`;
        image.attributes.src.value = `${responseObj.data.profile_pic}`;
        detailss.style.opacity = '1';
        goBack.style.display = 'initial';
        spinner.style.display = 'none';
        display.classList.add('effect');
        display.classList.remove('uuu');
        submitFlag = true;
        return;
      }

      if (statusCode === 400) {
        spinner.style.display = 'none';
        display.classList.add('effect');
        display.classList.remove('uuu');
        no.textContent = 'User Does Not Exist';
        no.style.display = 'block';
        setTimeout(() => { no.style.display = 'none'; }, 3000);
        return;
      }
    }

    if (submitFlag && input[2].value === '') {
      spinner.style.display = 'none';
      display.classList.add('effect');
      display.classList.remove('uuu');
      no.style.display = 'block';
      setTimeout(() => { no.style.display = 'none'; }, 3000);
    } else if (submitFlag && input[2].value !== '') no.style.display = 'none';

    if (input[2].className !== 'valid') {
      return;
    }

    const user = getLoginDetails();
    const url = `${devURL}/auth/signin`;
    const { responseObj, statusCode } = await fetcher(url, 'POST', user);

    if (statusCode === 200) {
      no.textContent = 'Login Successful';
      no.style.display = 'block';
      no.style.color = 'rgb(23, 148, 23)';
      const { token } = responseObj.data;
      localStorage = '';
      localStorage.setItem('token', token);
      localStorage.setItem('userDet', input[1].value);

      if (responseObj.data.email === 'admin@automart.com') {
        setTimeout(() => { window.location = 'admin.html'; }, 3000);
        return;
      }

      setTimeout(() => { window.location = 'main.html'; }, 3000);
    }
    if (statusCode === 400) {
      spinner.style.display = 'none';
      display.classList.add('effect');
      display.classList.remove('uuu');
      no.textContent = 'Incorrect Password';
      no.style.display = 'block';
      setTimeout(() => { no.style.display = 'none'; }, 3000);
    }

    if (!checker) {
      spinner.style.display = 'none';
      display.classList.add('effect');
      display.classList.remove('uuu');
      return;
    }
  } catch (error) {
    spinner.style.display = 'none';
    display.classList.add('effect');
    display.classList.remove('uuu');
    no.style.color = 'red';
    no.textContent = 'Connection error, please try again';
    no.style.display = 'block';
    display.disable = false;
    setTimeout(() => { no.style.display = 'none'; }, 3000);
  }
});

goBack.addEventListener('click', (event) => {
  event.preventDefault();
  goBack.style.display = 'none';
  add.classList.add('move-right');
  add.classList.remove('move-left');
  image.attributes.src.value = 'img/person-placeholder.jpg';
  detailss.style.opacity = '0';
  checker = true;
  submitFlag = false;
});


window.addEventListener('load', () => {
  inputs = form.querySelectorAll('input');
  inputs.forEach((input) => {
    input.value = '';
  });
});
