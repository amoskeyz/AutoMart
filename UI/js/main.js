// console.log('i am here');
const a = document.querySelectorAll('a');
const imgg = document.querySelector('.amos');
const purchase = document.querySelector('.purchase-btn');
const report = document.querySelector('.report-btn');
const reportDialog = document.querySelector('.report');
const purchaseDialog = document.querySelector('.purchase');
const leftBar = document.querySelector('#left_bar');
const mainBar = document.querySelector('#main_bar');
const rightBar = document.querySelector('#right_bar');
const Bar = document.querySelector('#bar');
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
const input = document.querySelector('.iin');
const profile = document.querySelector('.pro');
const search = document.querySelector('.search');
// console.log(dialog);

harsh.addEventListener('click', (event) => {
    event.preventDefault();
    leftBar.style.display = 'inline-grid';
    leftBar.style.left = '0px';
    // mainBar.style.display = 'none';
    // Bar.style.display = 'none';
    harsh111.style.opacity = '0'
  });

  harsh111.addEventListener('click', (event) => {
    event.preventDefault();
    rightBar.style.display = 'inline-grid';
    rightBar.style.right = '0px';
    mainBar.style.opacity='0.6';
    harsh.style.opacity = '0'
    // mainBar.style.display = 'none';
    // Bar.style.display = 'none';
  });

  search.addEventListener('click', (event) => {
    event.preventDefault();
    // rightBar.style.display = 'inline-grid';
    rightBar.style.right = '-500px';
    harsh.style.opacity = '1';
    // rightBar.style.display = 'none';
    // mainBar.style.display = 'none';
    // Bar.style.display = 'none';
    // if(rightBar.style.right === '-500px'){
    //     rightBar.style.display= 'none'
    // }
    mainBar.style.opacity='1'
  });

  if(rightBar.style.right === '-500px'){
      rightBar.style.opacity= '0'
  }


// console.log(URL.createObjectURL(input.files[0]));

input.addEventListener('input',(e)=>{
    profile.attributes.src.value = URL.createObjectURL(input.files[0]);
    // console.log(profile.attributes.src.value)
})

// console.log(purchase)
a.forEach(car =>{
    car.addEventListener('click', (e) =>{
        let details = (e.path[0]);
        // if(details.tagName == 'IMG'){
        // }

        imgg.attributes.src.value = `${details.attributes.src.value}`;
        console.log(details.attributes.src.value);
    })
})

updatePrice.forEach(up =>{
    up.addEventListener('click', (e) =>{
        updateDialog.showModal();
    })
})

small.forEach(mall =>{
    mall.addEventListener('click', (e) =>{
        leftBar.style.left = '-500px';
        harsh111.style.opacity = '1'
    })
})
acceptPrice.forEach(accept =>{
    accept.addEventListener('click', (e) =>{
        acceptDialog.showModal();
    })
})
rejectPrice.forEach(reject =>{
    reject.addEventListener('click', (e) =>{
        rejectDialog.showModal();
    })
})
counterPrice.forEach(counter =>{
    counter.addEventListener('click', (e) =>{
        counterDialog.showModal();
    })
})


purchase.addEventListener('click', (e) =>{
    purchaseDialog.showModal();
    dialog[1].className = 'grow';
    // console.log('i am here');
});

report.addEventListener('click', (e) =>{
    reportDialog.showModal();
    dialog[0].className = 'grow';
})


close.forEach(clo =>{
clo.addEventListener('click',(e)=>{
    dialog.forEach(dia =>{
        setTimeout( function(){dia.close();}, 300);
        dialog[0].classList.remove('grow');
    })
	// setTimeout( function(){dialog.close();}, 300);
    // dialog.classList.remove('grow');
    // console.log('i am here');
})
})

// console.log(imgg.attributes.src)