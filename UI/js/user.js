/* eslint-disable no-undef */
const spinner = document.querySelector('.spinner');
const bnt = document.querySelector('.bnt');
const deet = document.querySelector('.deet');
const de = document.querySelector('.deet-message');
const deh = document.querySelector('.deet-header');
spinner.style.display = 'none';


const getSignUpDetails = () => {
  const firstName = document.querySelectorAll('.userName')[0].value;
  const lastName = document.querySelectorAll('.userName')[1].value;
  const email = document.querySelectorAll('.userName')[2].value;
  const password = document.querySelector('#password').value;
  const phoneNumber = document.querySelector('#number').value;
  const obj = {
    firstName, lastName, email, password, phoneNumber,
  };
  return obj;
};

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  try {
    const details = getSignUpDetails();
    spinner.style.display = 'initial';
    bnt.style.color = 'slateblue';
    bnt.disable = true;
    spinner.style.display = 'initial';
    const url = `${devURL}auth/signup`;
    deet.style.transform = 'scale(0)';
    const { responseObj, statusCode } = await fetcher(url, 'POST', details);
    if (statusCode === 201) {
      deh.style.color = 'green';
      deh.textContent = 'Registered Successful';
      de.textContent = 'Welcome';
      deet.style.transform = 'scale(1)';
      const { token } = responseObj.data;
      localStorage.setItem('authtoken', token);
      setTimeout(() => { window.location = 'main.html'; }, 3000);
    } else {
      deh.textContent = 'Error';
      deh.style.color = 'red';
      de.textContent = `${responseObj.error}`;
      deet.style.transform = 'scale(1)';
      spinner.style.display = 'none';
      bnt.style.color = 'white';
      bnt.disable = false;
    }
  } catch (error) {
    spinner.style.display = 'none';
    bnt.style.color = 'white';
    deh.textContent = 'Network';
    deh.style.color = 'red';
    de.textContent = 'Connection error please try again';
    deet.style.transform = 'scale(1)';
    bnt.disable = false;
  }
  bnt.disable = false;
});
