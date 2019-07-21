/* eslint-disable no-undef */
const a = document.querySelectorAll('a');
const imgg = document.querySelector('.amos');
const purchase = document.querySelector('.purchase-btn');
const report = document.querySelector('.report-btn');
const reportDialog = document.querySelector('.report');
const purchaseDialog = document.querySelector('.purchase');
const leftBar = document.querySelector('#left_bar');
const mainBar = document.querySelector('#main_bar');
const rightBar = document.querySelector('#right_bar');
// const Bar = document.querySelector('#bar');
const updateDialog = document.querySelector('.update-dialog');
const acceptDialog = document.querySelector('.accept-dialog');
const counterDialog = document.querySelector('.counter-dialog');
const rejectDialog = document.querySelector('.reject-dialog');
const close = document.querySelectorAll('.close_dialog');
const updatePrice = document.querySelectorAll('.update');
const acceptPrice = document.querySelectorAll('.accept');
const rejectPrice = document.querySelectorAll('.reject');
const small = document.querySelectorAll('.small');
const harsh = document.querySelector('.harsh');
const harsh111 = document.querySelector('.harsh111');
const counterPrice = document.querySelectorAll('.counter');
const dialog = document.querySelectorAll('dialog');
const search = document.querySelector('.search');
const changer = document.querySelector('.changer');
const myOrder = document.querySelector('.ord');
const postAds = document.querySelector('.pos');
const myAds = document.querySelector('.mads');


harsh.addEventListener('click', (event) => {
  event.preventDefault();
  leftBar.style.display = 'inline-grid';
  leftBar.style.left = '0px';
  harsh111.style.opacity = '0';
});

harsh111.addEventListener('click', (event) => {
  event.preventDefault();
  rightBar.style.display = 'inline-grid';
  rightBar.style.right = '0px';
  mainBar.style.opacity = '0.6';
  harsh.style.opacity = '0';
});

search.addEventListener('click', (event) => {
  event.preventDefault();
  rightBar.style.right = '-500px';
  harsh.style.opacity = '1';
  mainBar.style.opacity = '1';
});

if (rightBar.style.right === '-500px') {
  rightBar.style.opacity = '0';
}

// input.addEventListener('input', () => {
//   profile.attributes.src.value = URL.createObjectURL(input.files[0]);
// });

updatePrice.forEach((up) => {
  up.addEventListener('click', () => {
    updateDialog.showModal();
  });
});

small.forEach((mall) => {
  mall.addEventListener('click', () => {
    leftBar.style.left = '-500px';
    harsh111.style.opacity = '1';
  });
});
acceptPrice.forEach((accept) => {
  accept.addEventListener('click', () => {
    acceptDialog.showModal();
  });
});
rejectPrice.forEach((reject) => {
  reject.addEventListener('click', () => {
    rejectDialog.showModal();
  });
});
counterPrice.forEach((counter) => {
  counter.addEventListener('click', () => {
    counterDialog.showModal();
  });
});


purchase.addEventListener('click', () => {
  purchaseDialog.showModal();
  dialog[1].className = 'grow';
});

report.addEventListener('click', () => {
  reportDialog.showModal();
  dialog[0].className = 'grow';
});


close.forEach((clo) => {
  clo.addEventListener('click', () => {
    dialog.forEach((dia) => {
      setTimeout(() => { dia.close(); }, 300);
      dialog[0].classList.remove('grow');
    });
  });
});
