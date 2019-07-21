/* eslint-disable no-use-before-define */
/* eslint-disable no-undef */

const name = document.querySelector('.name');
const email = document.querySelector('.email');
const photo = document.querySelector('.photo');
const notify = document.querySelector('.notify');
const roll = document.querySelector('.roll');
const purchaseError = document.querySelector('.purchase-error');
const manu = document.querySelector('.manu');
const mod = document.querySelector('.mod');
const boo = document.querySelector('.boo');
const cost = document.querySelector('.cost');
const sta = document.querySelector('.sta');
const stat = document.querySelector('.stat');
const dialogStatus = document.querySelector('.dia-status');
const dialogPrice = document.querySelector('.dia-price');
const purchaseOrder = document.querySelector('.purchase-order');


let idPath;
window.addEventListener('load', async (event) => {
  event.preventDefault();
  try {
    carLoader();
    getUserProfile();
    // a.forEach((car) => {
    //   // console.log(car);
    //   car.addEventListener('click', () => {
    //     // const details = (e.path[0]);
    //     // console.log('i am here');
    //   });
    // });
  } catch (error) {
    notify.append = `${error}`;
  }
});

showBox.addEventListener('click', async (e) => {
  let initialPath = e.path[0];
  idPath = e.path[1].id;
  let namePath = e.path[1];

  if (initialPath.tagName !== 'IMG') {
    initialPath = e.path[0].parentElement.firstElementChild;
    namePath = e.path[1].lastChild.previousSibling.lastElementChild;
    if (initialPath.tagName !== 'IMG') { initialPath = initialPath.firstElementChild; }
    namePath = e.path[1].lastChild.previousSibling.lastElementChild;
  }

  imgg.attributes.src.value = `${initialPath.attributes.src.value}`;

  if (idPath === '') idPath = e.path[0].id;

  const url = `${devURL}car/${idPath}`;
  const { responseObj, statusCode } = await fetcher(url, 'GET');

  if (statusCode === 200) {
    manu.textContent = `Manufacturer: ${responseObj.data.manufacturer}`;
    mod.textContent = `Model: ${responseObj.data.model}`;
    boo.textContent = `Body Type: ${responseObj.data.body_type}`;
    cost.textContent = `Price: N${responseObj.data.price}`;
    stat.textContent = `State: ${responseObj.data.state}`;
    sta.textContent = `status: ${responseObj.data.status}`;
    sta.textContent = `status: ${responseObj.data.status}`;
    dialogPrice.textContent = `Price: N${responseObj.data.price}`;
    dialogStatus.textContent = `Status: ${responseObj.data.status}`;
  }
});

const amountPurchase = document.querySelector('.price-offered');
const priceOff = () => {
  const amount = amountPurchase.value;
  const price = { amount, car_id: idPath };
  return price;
};

roll.style.display = 'none';

purchaseOrder.addEventListener('click', async () => {
  purchaseError.style.color = 'red';
  purchaseOrder.style.color = 'slateblue';
  roll.style.display = 'initial';
  const details = priceOff();

  if (details.amount === '') {
    purchaseError.textContent = 'Amount is required';
    roll.style.display = 'none';
    purchaseOrder.style.color = 'white';
    return;
  }

  const url = `${devURL}order`;
  const { responseObj, statusCode } = await fetcher(url, 'POST', details);

  if (statusCode === 201) {
    purchaseError.style.color = 'green';
    purchaseError.textContent = 'Order Successfully Created';
    await setTimeout(() => {
      purchaseDialog.close();
      roll.style.display = 'none';
      purchaseOrder.style.color = 'white';
      purchaseError.textContent = '';
      amountPurchase.value = '';
    }, 4000);
  }

  if (statusCode === 400) {
    purchaseError.textContent = `${responseObj.error}`;
    roll.style.display = 'none';
    purchaseOrder.style.color = 'white';
  }
});

const carLoader = async () => {
  try {
    const url = `${devURL}car`;
    const { responseObj, statusCode } = await fetcher(url, 'GET');

    if (statusCode === 200) {
      const { data } = responseObj;
      data.forEach(async (cars) => {
        const {
          id, manufacturer, model, price, car_image, status,
        } = cars;
        const carObj = {
          id, manufacturer, model, price, car_image, status,
        };
        showBox.innerHTML += displayCars(carObj);
      });

      notify.style.display = 'none';
      spinne.style.display = 'none';
      Bar.style.display = 'block';
      showBox.style.display = 'flex';
    } else if (statusCode === 404) {
      showBox.innerHTML = '';
      showBox.innerHTML = responseObj.error;
    } else if (statusCode === 401) {
      window.location = 'index.html';
    }
  } catch (err) {
    spinne.style.display = 'none';
    notify.textContent = 'Network Error, Please Reload';
  }
};

const details = {
  email: localStorage.userDet,
};

const getUserProfile = async () => {
  try {
    const url = `${devURL}user`;
    const { responseObj, statusCode } = await fetcher(url, 'POST', details);

    if (statusCode === 400) window.location = 'index.html';

    photo.attributes.src.value = `${responseObj.data.profile_pic}`;
    name.textContent = `${responseObj.data.first_name} ${responseObj.data.last_name}`;
    email.textContent = `${responseObj.data.email}`;
  } catch (err) {
    notify.appendChild = `${err}`;
  }
};
