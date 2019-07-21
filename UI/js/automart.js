/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

const showBox = document.querySelector('.scrolling-ads');
const input = document.querySelector('.iin');
const post = document.querySelector('.postAds');
const spinne = document.querySelector('.spinne');
const spin = document.querySelector('.spin');
const Bar = document.querySelector('#bar');
const modelDetails = document.querySelector('.model-details');
const profile = document.querySelector('.pross');


modelDetails.style.display = 'none';
showBox.style.display = 'none';
Bar.style.display = 'none';
let carStatus;
const displayCars = (carObj) => {
  carStatus = 'newest';
  const {
    id, car_image, manufacturer, model, status, price,
  } = carObj;
  // console.log(carObj);
  if (status === 'sold') carStatus = 'solder';
  const carHtml = `</a>
  <a href="#section2" class="${carStatus} carss">
  <article id = ${id} class="four">
      <img src=${car_image} class="cars">
      <h4>${manufacturer} ${model}</h4>
           <p class="location icon">Nigeria</p>
      <p>N${price}</p>
  </article>
  </a>`;

  return carHtml;
};

const getCarDetails = () => {
  const manufacturer = document.querySelector('.manufacturer').value;
  const model = document.querySelector('.model').value;
  const bodyType = document.querySelector('.body-type').value;
  const price = document.querySelector('.price').value;
  const state = document.querySelector('.state').value;
  // const location = document.querySelector('.locationn').value;
  const carObj = {
    manufacturer, model, body_type: bodyType, price, state,
  };
  return carObj;
};
let carimage;

input.addEventListener('input', async (e) => {
  // console.log(profile);
  profile.attributes.src.value = URL.createObjectURL(input.files[0]);
  const fet = async (formData) => {
    const object = {
      method: 'post',
      headers: new Headers({
        token,
      }),
      body: formData,
    };

    const response = await fetch(`${devURL}upload`, object);
    const statusCode = response.status;
    const responseObj = await response.json();
    return { responseObj, statusCode };
  };

  const formData = new FormData();
  formData.append('photo', input.files[0]);
  formData.append('files', 'photo');

  spin.showModal();

  carimage = await fet(formData);
  // console.log(carimage);

  spin.className = 'grow';

  if (carimage.statusCode === 200) {
    modelDetails.style.display = 'block';
    spin.close();
    // post.disable = false;
  }

  if (carimage.statusCode === 400) {
    // modelDetails.style.display = 'none';
    notify.textContent = 'Network Error, Please Reload';
    spin.close();
  }
});
// console.log(post.disable = true);
post.addEventListener('click', async () => {
  if (carimage.responseObj.data) {
    const carDetails = getCarDetails();
    const url = `${devURL}/car/`;
    const postCar = await fetcher(url, 'POST', carDetails);

    if (postCar.statusCode === 201) {
      const urx = `${devURL}cars/${postCar.responseObj.data.id}`;
      const { responseObj, statusCode } = await fetcher(urx, 'PATCH', { car_image: carimage.responseObj.data });
      if (statusCode === 200) {
        // console.log(responseObj);
        window.location = 'main.html';
      }
    }
    // if (statusCode === 400) {

    // }
  }
});
