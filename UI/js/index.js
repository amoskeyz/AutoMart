let barr = document.querySelector('.nav-bar');
const back = document.querySelector('.forward_button');
const dialog = document.querySelector('dialog');
const forward = document.querySelector('.back_button');
const scrollingAds = document.querySelector('.scrolling-ads');
const article = document.querySelectorAll('article');
const showDialog = document.querySelector('.show_dialog');
const close = document.querySelector('.close_dialog');
let navbar = document.querySelector('.nav-bar');
let navlink = document.querySelectorAll('.nav-link');
let navLogo = document.querySelector('.project-name');
let input = document.querySelector('#drop-down');
const email = document.querySelector('.name');
const label = document.querySelector('.label');


email.addEventListener('focus', () => {
    label.style.top = '-40px';
    label.style.fontSize = '13px';
  });
  
email.addEventListener('input', (event) => {
    event.preventDefault();
    const str = email.value;
    if (str.length > 0) {
      label.style.top = '-40px';
      label.style.fontSize = '13px';
    }
  });
  
email.addEventListener('focusout', () => {
    const str = email.value;
    if (str.length < 1) {
      label.style.top = '-20px';
      label.style.fontSize = '16px';
    }
  });


window.addEventListener('scroll', (event) => {
  event.preventDefault();
const screenScroll = document.documentElement.scrollTop;
   if (screenScroll > 100 && screenScroll < 550){
     barr.style.top = '-100px';
   } else{
    barr.style.top = '0px';
   }
	
	input.checked = false;
	
	if(screenScroll < 100) {
		navbar.classList.remove('whiteBackground');
		navlink.forEach(nav => { nav.classList.remove('themeColor');
		});
		navLogo.classList.remove('darkTheme');
	}
	else {
		navbar.classList.add('whiteBackground');
		navlink.forEach(nav => { nav.classList.add('themeColor');
		});
		navLogo.classList.add('darkTheme');
	}
});

const delay = (time) => {
	const newTime = new Promise((resolve, reject) => {
		setTimeout(() => {
		  resolve();
		}, time);
	})
	return newTime;
} 
let change = 0;
const moveLeft = async () => {
change = 0;
for (let i = 0; i < article.length -3; i++){
    scrollingAds.style.left = `-${change}px`;
	await delay(5000);
	change = change + 320;
}
	for (let i = 0; i < article.length -2; i++){
    scrollingAds.style.left = `-${change}px`;
	await delay(5000);
	change = change - 320;
}
}

(async function work(){ await moveLeft();})();
back.addEventListener('click',(e)=>{
	if (change !== ((article.length - 3)* 320 )){
	change = change + 320;
	scrollingAds.style.left = `-${change}px`;
}
	
})
forward.addEventListener('click',(e)=>{
	if(change !== 0){
		change = change - 320;
	scrollingAds.style.left = `-${change}px`;
	}
})

article.forEach(article =>{
	article.addEventListener('click',(e)=>{
	dialog.showModal();
		dialog.className = 'grow';
	let initialPath = e.path[0];
		let namePath = e.path[1];
		console.log(e.path[1]);
//		e.path[1].lastChild.previousSibling.innerTex
//		console.log(e);
	if(initialPath.tagName !== 'IMG'){
		initialPath = e.path[0].parentElement.firstElementChild;
		namePath = e.path[1].lastChild.previousSibling.lastElementChild
		if(initialPath.tagName !== 'IMG')
		initialPath = initialPath.firstElementChild;
		namePath = e.path[1].lastChild.previousSibling.lastElementChild
}

		
		showDialog.innerHTML =
		
		`<div class = "dialog_all"><div class="dialog_left">
					 <div class="dialog_logo">AutoMart</div>
					 <img src = ${initialPath.src}>
					 </div>
					<div class="dialog_car">
						<p>Please Sign-up or Login to Contact Dealers</p>
						<hr>
						<h2 class="dialog_carName">2018 Toyota Supra</h2>
						<p class="l ocation icon">Lagos</p>
						<p class="dialog_price">N600,000</p>
						<div class="dialog_button">
							<button class="dialog_signUp"><a class = "clicker" href="">Sign-Up</a></button>
							<button class="dialog_login"><a class="clicker" href="">Login</a></button>
						</div>
					 </div></div`;
	})
})


close.addEventListener('click',(e)=>{
	setTimeout( function(){dialog.close();}, 300);
	dialog.classList.remove('grow');
})

