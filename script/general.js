window.onload = function(event) {


	//Переменные ***************************************************************************************************
let idCount = 1;


let elementsDescription = {
	// name(стихия): {title: Название на русском, description: Краткое описание, hint:Описания подсказки, done:false(собрана ли уже эта комбинация)}
	steam: {title: 'Пар', description: 'Когда две бурные стихии встречаются, появляется их дитё', hint:'Огонь + [] И родится их дитё'},
	tornado: {title: 'Торнадо', description: 'Умопомрачительная сила и ужас', hint:'Грязь + [] + []. Паника и разрушение'},
	life: {title: 'Жизнь', description: 'прекрасная и неповторимая-жизнь', hint:'Вода +[] +[]. То благодаря чему мы здесь'},
	bacteria: {title: 'Бактерия', description: 'простейшая частица жизни', hint:'Земля +[]. Виновники многих бед'},
	death: {title: 'Смерть', description: 'конец любой жизни', hint:'Жизнь + [] + []. Конец всего'},
	animal: {title: 'Животное', description: 'наши далёкие предки и их друзья', hint:'Жизнь + []. звено эволюции'},
	human: {title: 'Человек', description: 'Венец эволюции', hint:'Жизнь + []. Венец эволюции'},
	lightning: {title: 'Молния', description: 'Невероятно много энергии в ярком пучке', hint:'Огонь + []. Яркое и громкое явление'},
	nature: {title: 'Природа', description: 'прекрасная и огромная, прородительница всего сущего.', hint:'Молния + [] + []. Зелёная сила'},
	work: {title: 'Работа', description: 'Занятие сделавшее нас людьми', hint:'Человек + [] + []. Благородное занятие'},
	city: {title: 'Город', description: 'Огромные муравейники где живут люди', hint:'Труд + [] + []. муравейник для людей'},
	people: {title: 'Общество', description: 'Большая организованная группа людей', hint:'Человек + []. нас много!!!'},

};

let elementsState = {
	steam: false,
	tornado: false,
	life: false,
	bacteria: false,
	death: false,
	animal: false,
	human: false,
	lightning: false,
	nature: false,
	work: false,
	city: false,
	people: false,
};

let elementsInfo = {
	// name: src
	fire: '../image/fire.webp',
	water: '../image/water.jpg',
	wind: '../image/wind.jpg',
	mud: '../image/mud.jpg',
	steam: '../image/steam.jpg',
	tornado: '../image/tornado.jpg',
	life: '../image/life.jpg',
	bacteria: '../image/bacteria.jpg',
	death: '../image/death.jpg',
	animal: '../image/animal.jpg',
	human: '../image/human.jpg',
	lightning: '../image/lightning.png',
	nature: '../image/nature.jpg',
	work: '../image/work.png',
	city: '../image/city.png',
	people: '../image/people.jpg',

};


let elementCombo = {
	//имя1имя2имя3 (В алфавитном порядке): name(Нового элемента)
	firewater: 'steam',
	mudwaterwind: 'tornado',
	firemudwater: 'life',
	lifemud: 'bacteria',
	lifemudmud: 'death',
	bacterialife: 'animal',
	animallife: 'human',
	firefire: 'lightning',
	lifelightningwater: 'nature',   //life lightning water:
	humanmudnature: 'work',         //human mud nature
	humanhuman: 'people',			//human human
	mudpeoplework: 'city',			//mud people work

}

let elementsCoords = {
	// id элемента: {x и y и name}

};

let gameMap = document.getElementById('gameMap');
let elementRadius = 32;
//end Переменные ***************************************************************************************************

// Сохранение

window.onbeforeunload = function(event) {
	if(!isRestart){
		localStorage.setItem('dataGame', JSON.stringify([elementsState, elementsCoords, idCount]));
	}else{
		localStorage.setItem('dataGame', null);
	}
	
}
// end Сохранение

// Движение элемента ***************************************************************************************************

document.addEventListener('mousedown', function(event) {
	if(event.which != 1){
		return;
	}
	let shiftX = event.offsetX + 4;
	let shiftY = event.offsetY;
	let currentTarget = null;

	let width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

	let height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

	function mooveAt(target, x, y) {
		let left = x - shiftX - 3;
		let top = y - shiftY - 3;

		if(x - shiftX - 3 <= 0){
			left = 0;
		}
		if(x + (elementRadius*2 - shiftX)>= width){
			left = width - elementRadius*2 - 3;
		}
		if(y - shiftY - 3 <= 0){
			top = 0;
		}
		if(y + (elementRadius*2 - shiftY)>= height){
			top = height - elementRadius*2 - 3;
		}
		target.style.left = left + 'px';
		target.style.top = top + 'px';
	}

	function mooveElement(event) {
		mooveAt(currentTarget, event.clientX, event.clientY);
	}

	function connectionElement(x, y) {
		let elementsArr = [currentTarget.id];
		let namesElements = [];
		for(let key of Object.keys(elementsCoords)){
			if(Math.sqrt(Math.pow(x - elementsCoords[key].x, 2) + Math.pow(y - elementsCoords[key].y, 2)) < elementRadius*2 && currentTarget.id != key){
				elementsArr.push(key);
				if(elementsArr.length == 3) break;
			}
		}


		for(let id of elementsArr){
			namesElements.push(elementsCoords[id].name);
		}
		namesElements.sort();
		let checkString = namesElements.join('');
		if(checkString in elementCombo){
			currentTarget = generateElement(elementCombo[checkString], x-elementRadius, y-elementRadius);
			elementsCoords[currentTarget.id] = {
				x: (x-elementRadius) + currentTarget.offsetWidth/2,
				y: (y-elementRadius) + currentTarget.offsetHeight/2,
				name: currentTarget.dataset.name
			};
			for(let id of elementsArr){
				document.getElementById(id).remove();
				delete elementsCoords[id];
			}

			let infoMessage = elementsDescription[currentTarget.dataset.name];
			if(!elementsState[currentTarget.dataset.name]){

				elementsState[currentTarget.dataset.name] = true;

				gameMap.dispatchEvent(new CustomEvent('message', {detail: {

				description: infoMessage.description,
				title: infoMessage.title,
				name: currentTarget.dataset.name

				}
			}));
			}

		}
		return;
	}

	function generalWork() {
		gameMap.addEventListener('mousemove', mooveElement);
		gameMap.addEventListener('mouseup', function downButton(event) {
			mooveAt(currentTarget, event.clientX, event.clientY);
			currentTarget.style.zIndex = 10;
			gameMap.removeEventListener('mousemove', mooveElement);
			gameMap.removeEventListener('mouseup', downButton);

			elementsCoords[currentTarget.id] = {
				x: (event.clientX - shiftX-3) + currentTarget.offsetWidth/2,
				y: (event.clientY - shiftY-3) + currentTarget.offsetHeight/2,
				name: currentTarget.dataset.name
			};
			
			if(deleteTrash(currentTarget.id)){
				return;
			}
			connectionElement((event.clientX - shiftX - 3) + elementRadius, (event.clientY - shiftY - 3) + elementRadius);
		})
	}


														//Само движение
	if(event.target.classList.contains('element')){
	event.preventDefault();
	
	currentTarget = event.target;
	event.target.style.zIndex = 1000;

	generalWork();

	}else if(event.target.classList.contains('element_static')){

		event.preventDefault();
		let newElement = generateElement(event.target.dataset.name, event.clientX - shiftX-3, event.clientY - shiftY-3);
		currentTarget = newElement;
		newElement.style.zIndex = 1000;
		generalWork();
	}	
});
//end Движение элемента ***************************************************************************************************



//Генерация элемента ***************************************************************************************************
function generateElement(name, x, y) {
	let element = document.createElement('div');
	element.classList.add('element');
	element.style.position = 'absolute';
	element.style.top = y +'px';
	element.style.left = x +'px';
	element.setAttribute('data-name', name);
	element.setAttribute('id', idCount);
	idCount++;
	gameMap.append(element);
	element.style.backgroundImage = 'url('+ elementsInfo[name] +')';
	return element;
}

//end Генерация элемента ***************************************************************************************************

// message *****************************************************************************************************************
let messageDescription = document.querySelector('#messageDescription');
let messageTitle = document.querySelector('#messageTitle');
let messageImage = document.getElementById('messageImage');
let messageBox = document.getElementById('message');
let promise = null;
let arrPromis = [];


function editMessage(event) {  

	messageBox.classList.remove('close');
	messageTitle.textContent = 'Поздравляю! Вы открыли элемент - '+event.detail.title;
	messageDescription.textContent = event.detail.description;
	messageImage.src = elementsInfo[event.detail.name];

}

gameMap.addEventListener('message', async(event)=>{
	
	if(promise){
			promise = promise.then(()=>{
			setTimeout(function() {editMessage(event)}, 500);
			return new Promise((resolve, reject)=>{
				setTimeout(function() {
						messageBox.classList.add('close');
						resolve();
					}, 5500);
			});
		});
	}else{
		editMessage(event);
		promise = new Promise((resolve, reject)=>{
					setTimeout(function() {
						messageBox.classList.toggle('close');
						resolve();
			}, 5000);
		});
	}
});



//end messsage ***************************************************************************************************************

// hint **********************************************************************************************************************
let isActiveHint = true;
let hintDescription = document.getElementById('hintDescription');
let hint = document.querySelector('#hint');
let hintCloseButton = document.getElementById('hintCloseButton');

setTimeout(function timeFunction() {
	if(isActiveHint){
		showHint();
		setTimeout(timeFunction, randomNumber(10000, 35000));
	}
}, 10000);


hintCloseButton.addEventListener('click', (event)=>{
	hint.classList.add('close');
});

function showHint() {
	let lengthElementsArr = Object.keys(elementsDescription).length;
	let elementsDescriptions = Object.values(elementsDescription);
	let randomIndex = randomNumber(0, lengthElementsArr-1);
	let count = 0;
	let isCurrentShow = false;

	for(let name of Object.keys(elementsState).reverse()){
		if(!elementsState[name]){
			isCurrentShow = true;
			hintDescription.textContent = elementsDescription[name].hint;
				
		}
	}	
	if(isCurrentShow){
		hint.classList.remove('close');
		setTimeout(function() {hint.classList.add('close');}, 8000);
	}
}

function randomNumber(left, right) {
	return Math.round(left - 0.5 + Math.random() * (right - left + 1));
}

// end hint ***************************************************************************************************************

// trashHolder ************************************************************************************************************
let trashHolder = document.getElementById('treshHolder');
function deleteTrash(id) {
	let trashHolderCoords = trashHolder.getBoundingClientRect();
	let checkDiagonal = 60 + elementRadius;
	if(Math.sqrt(Math.pow(trashHolderCoords.x+60 - elementsCoords[id].x, 2) + Math.pow(trashHolderCoords.y + 60 - elementsCoords[id].y, 2)) < checkDiagonal){
		document.getElementById(id).remove();
		delete elementsCoords[id];
		return true;
	}
	return false;
}

let treshAll = document.getElementById('trashAll');
treshAll.addEventListener('click', (event)=>{
	let elementsArr = Object.keys(elementsCoords);
	if(elementsArr.length > 0){
		for(let id of elementsArr){
			setTimeout(function() {document.getElementById(id).remove();}, 0);
			delete elementsCoords[id];
		}
	}
});

// end trashHolder ********************************************************************************************************

// Расширение панели меню *************************************************************************************************
let elementPanel = document.getElementById('elementPanel');


function generateStaticElement(name) {
	let element = document.createElement('div');
	element.className = 'element_static';
	element.setAttribute('data-name', name);
	elementPanel.append(element);
	element.style.backgroundImage = 'url('+ elementsInfo[name] +')';
	return element;
}

gameMap.addEventListener('message', function(event) {
	generateStaticElement(event.detail.name);
});


// end Расширение панели меню *********************************************************************************************


//меню

let menu = document.getElementById('menu');
let activeItem = null;

menu.addEventListener('click', function(event) {
	if(event.target == menu){
		menu.classList.toggle('close');
	}else if(event.target.dataset.detail){
		if(activeItem = event.target){
			event.target.classList.toggle('close');
		}else{
			event.target.classList.add('close');
			activeItem = event.target;
			event.target.classList.remove('close');
		}
	}else if(event.target.id == 'closeButton'){
		menu.classList.toggle('close');
	}
})


//end меню

//Загрузка
	let dataGame = localStorage.getItem('dataGame');
	let downloadElement;

	if(dataGame != null && dataGame !='null'){
		dataGame = JSON.parse(dataGame);
		elementsState = dataGame[0];
		elementsCoords = dataGame[1];
		idCount = dataGame[2];

		for(let name of Object.keys(elementsState)){
		 	if(elementsState[name]){
		 	generateStaticElement(name);
			}
		}
		 for(let id of Object.keys(elementsCoords)){
		 	downloadElement = generateElement(elementsCoords[id].name, elementsCoords[id].x,  elementsCoords[id].y);
		 	downloadElement.setAttribute('id', id);
		 }
	}
	document.getElementById('preloader').classList.add('close');
	setTimeout(function() {document.getElementById('preloader').remove()}, 500);
//end Загрузка

// Новая игра
let isRestart = false;
let restartButton = document.getElementById('restart');

document.getElementById('restartYes').addEventListener('click', (event)=>{
	isRestart = true;
	location.reload();
});

document.getElementById('restartNo').addEventListener('click', (event)=>{
	restartButton.classList.add('close');
});


	



}



// end Новая игра		



































