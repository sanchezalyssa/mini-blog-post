import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js'
import {
	getDatabase,
	ref,
	onValue,
	push,
	remove,
} from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js'
//import { clearPostElement } from './functions'

let appSettings = {
	databaseURL:
		'https://champions-1689f-default-rtdb.asia-southeast1.firebasedatabase.app/',
}
//set up firebase
let app = initializeApp(appSettings)
let database = getDatabase(app)
let championsInDB = ref(database, 'champions')

//dom
let publishBtn = document.getElementById('publish-btn')
let inputEl = document.getElementById('text-area')
let postEl = document.getElementById('post-el')

publishBtn.addEventListener('click', function () {
	let inputValue = inputEl.value
	if (inputValue) {
		push(championsInDB, inputValue) //push data into database
		clearInputValue() //clear text input
	}
})
//fetch database
onValue(championsInDB, function (snapshot) {
	//snapshot.exists - verify if true or false in order to delete last one in database
	if (snapshot.exists()) {
		clearPostElement() //need to list element to prevent adding old value

		//Object.values - is the value in the database
		let currentItem = Object.entries(snapshot.val()) //need to transform to an array
		currentItem.reverse() //make the value push it to the beginning
		for (let i = 0; i < currentItem.length; i++) {
			let postItem = currentItem[i]

			appendToPostElement(postItem) //display the input value
		}
	}
})

function appendToPostElement(item) {
	let itemID = item[0] //id of value in database
	let itemValue = item[1] // value of data in database
	let listItem = document.createElement('li') //create list element
	listItem.textContent = itemValue
	postEl.append(listItem)

	listItem.addEventListener('dblclick', function () {
		let locationOfChampionsInDB = ref(database, `champions/${itemID}`)
		remove(locationOfChampionsInDB)
	})
}

function clearPostElement() {
	postEl.innerHTML = ''
}

function clearInputValue() {
	inputEl.value = ''
}
