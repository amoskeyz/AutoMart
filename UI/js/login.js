const display = document.querySelector('.next');
const add = document.querySelector('.form-container');
const form = document.querySelector('#form');
const goBack = document.querySelector(".go_back");
const email = document.querySelector(".input-email");
const input = document.querySelectorAll('input');
const no = document.querySelector('.no');
const image = document.querySelector('img');
const details = document.querySelector('.user-details');

details.style.opacity = '0';

let checker = false;
const pattern = {
	password: /^[\w@-]{8,20}$/,
	email: /^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/,
}

function validate(field,regex){
	if(regex.test(field.value)){
		field.className = 'valid';
		checker = true;
	} else{
		field.className = 'invalid';
		checker = false;
	}
}

input.forEach((input) => {
	input.addEventListener('keyup',(e) =>{
		validate(e.target,pattern[e.target.attributes.name.value])
	})
})

let submitFlag = false;

display.addEventListener('click',(event) =>{
    event.preventDefault();
    console.log('click');
    if(input[1].value === ''){
        no.style.display = 'block';
        setTimeout( function(){no.style.display = 'none';}, 3000)
    }else no.style.display = 'none';
    console.log(submitFlag, checker)
	if(checker && !submitFlag){
        console.log('im here')
        add.classList.add('move-left');
        add.classList.remove('move-right');
        image.attributes.src.value = 'img/22.jpg';
        details.style.opacity = '1';
        goBack.style.display = 'initial';
        submitFlag = true;
        console.log(submitFlag, checker)
        return;
    }

    if(submitFlag && input[2].value === ''){
        no.style.display = 'block';
        setTimeout( function(){no.style.display = 'none';}, 3000)
    }else if(submitFlag && input[2].value !== '') no.style.display = 'none';

    if (input[2].className !== 'valid'){
        return;
    }
    window.location.href= 'main.html';
    
});

goBack.addEventListener('click',(event) =>{
    event.preventDefault();
	goBack.style.display = 'none';
	add.classList.add('move-right');
    add.classList.remove('move-left');
    image.attributes.src.value = 'img/person-placeholder.jpg';
    details.style.opacity = '0';
    checker = true;
    submitFlag = false;
	
});


window.addEventListener('load', ()=>{
    inputs = form.querySelectorAll('input');
    inputs.forEach(input => {
        input.value = '';
    })
})
// console.log(submitFlag, checker)