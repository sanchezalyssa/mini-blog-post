//firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, onValue, push } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

let appSettings = {
    databaseURL: "https://champions-1689f-default-rtdb.asia-southeast1.firebasedatabase.app/",
}
//set up firebase
let app = initializeApp(appSettings)
let database = getDatabase(app)
let championsInDB = ref(database, "champions")

//dom
let publishBtn = document.getElementById("publish-btn")
let inputEl = document.getElementById("text-area")
let postEl = document.getElementById("post-el")
let toPerson = document.getElementById("to-person")
let fromPerson = document.getElementById("from-person")

publishBtn.addEventListener("click", function () {
    //creating object to push multiple data into firebase
    let postData = {
        message: inputEl.value,
        to: toPerson.value,
        from: fromPerson.value,
    }

    if (inputEl.value && toPerson.value && fromPerson.value) {
        push(championsInDB, postData) //push data object into firebase
        clearInputValue() //clear text input
    }
})
//fetch database
onValue(championsInDB, function (snapshot) {
    //snapshot.exists - verify if true or false in order to delete last one in database
    if (snapshot.exists()) {
        clearPostElement() //need to clear element to prevent adding old value

        //Object.values - is the value in the database
        let messageArray = Object.values(snapshot.val()) //need to transform to an array
        messageArray.reverse() //make the value push to the beginning
        for (let i = 0; i < messageArray.length; i++) {
            let currentMessage = messageArray[i]

            appendToPostElement(currentMessage) //display the input value
        }
    }
})

function appendToPostElement(message) {
    let capitalizedTo = capitalizeFirstLetter(message.to) //from postData
    let capitalizedFrom = capitalizeFirstLetter(message.from) //from postData

    let listItem = document.createElement("li")
    listItem.innerHTML = `
    <p class="from-and-to">To: ${capitalizedTo}</p>
    <p class="message">${message.message}</p>
    <p class="from-and-to">From: ${capitalizedFrom}</p>
  `

    postEl.appendChild(listItem)
}
//make the first letter always capital
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
}

function clearPostElement() {
    postEl.innerHTML = ""
}

function clearInputValue() {
    inputEl.value = ""
    toPerson.value = ""
    fromPerson.value = ""
}
