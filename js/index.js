// Html ELement 
var modal = document.getElementById("modal");
var statusInput = document.getElementById("status");
var categoryInput = document.getElementById("category");
var titleInput = document.getElementById("title");
var descriptionInput = document.getElementById("description");

var newTaskBtn = document.getElementById("newTask");
var addBtn = document.getElementById("addBtn");
var updateBtn = document.getElementById("updateBtn");

var searchInput = document.getElementById("searchInput");
var modeBtn = document.getElementById("mode");
var section = document.querySelectorAll("section");

var gridBtn = document.getElementById("gridBtn");
var barsBtn = document.getElementById("barsBtn");

var tasksContainer = document.querySelectorAll(".tasks")

var darkMode = false;
// App Variables 
var containers = {
    nextUp: document.getElementById("nextUp"),
    inProgress: document.getElementById("inProgress"),
    done: document.getElementById("done")
}
var countersEL = {
    nextUp: document.querySelector("#nextUp").querySelector("span"),
    inProgress: document.querySelector("#inProgress").querySelector("span"),
    done: document.querySelector("#done").querySelector("span")
}
var counters = {
    nextUp: 0,
    inProgress: 0,
    done: 0
}

let updateIndex;
const titleRegex = /^.{3,10}$/;
const descRegex = /^.{25,100}$/;
var tasksArr = getLocalStorage();
displayAllTasks();

// Functions 
function showModal() {
    window.scroll(0, 0);
    modal.classList.replace("d-none", "d-flex");
    addBtn.classList.replace("d-none", "d-block");
    updateBtn.classList.replace("d-block", "d-none");
    document.body.style.overflow = "hidden";
    titleInput.value = "";
    descriptionInput.value = "";
}

function hideModal() {
    modal.classList.replace("d-flex", "d-none");
    document.body.style.overflow = "auto";
}

function addTask() {
    if (validate(titleInput, titleRegex) && validate(descriptionInput, descRegex)) {
        var task = {
            status: statusInput.value,
            category: categoryInput.value,
            title: titleInput.value,
            description: descriptionInput.value,
            bgColor: "#0d1117"
        };
        tasksArr.push(task);
        setLocalStorage();
        displayTask(tasksArr.length - 1);
        hideModal();
    } else {
        alert("Invalid Data");
    }
}

function setCounter(status) {
    countersEL[status].innerHTML = +countersEL[status].innerHTML + 1;
}

function displayTask(index) {
    var taskHTML = `
    <div class="task" style="background-color: ${tasksArr[index].bgColor}">
      <h3 class="text-capitalize">${tasksArr[index].title}</h3>
      <p class="description text-capitalize">${tasksArr[index].description}</p>
      <h4 class="category ${tasksArr[index].category} text-capitalize">${tasksArr[index].category}</h4>
      <ul class="task-options list-unstyled d-flex gap-3 fs-5 m-0">
        <li><i class="bi bi-pencil-square" onclick="getTaskInfo(${index})"></i></li>
        <li><i class="bi bi-trash-fill" onclick="deleteTask(${index})"></i></li>
        <li><i class="bi bi-palette-fill" onclick="changeBackgroundColor(${index})"></i></li>
        <li><i class="bi bi-arrow-repeat" onclick="resetBackgroundColor(${index})"></i></li>
      </ul>
    </div>
    `;
    containers[tasksArr[index].status].querySelector(".tasks").innerHTML += taskHTML;
    setCounter(tasksArr[index].status);
}

function displayAllTasks() {
    for (var i = 0; i < tasksArr.length; i++) {
        displayTask(i);
    }
}

function setLocalStorage() {
    localStorage.setItem("tasks", JSON.stringify(tasksArr));
}

function getLocalStorage() {
    return JSON.parse(localStorage.getItem("tasks")) || [];
}

function deleteTask(index) {
    tasksArr.splice(index, 1);
    setLocalStorage();
    // reset containers
    resetContainers();
    // reset counters
    resetCounters();
    // display
    displayAllTasks();
}

function resetContainers() {
    for (key in containers) {
        containers[key].querySelector(".tasks").innerHTML = "";
    }
}

function resetCounters() {
    for (key in countersEL) {
        countersEL[key].innerHTML = 0;
    }
}

function searchTasks() {
    resetContainers();
    resetCounters();
    var term = searchInput.value;
    for (var i = 0; i < tasksArr.length; i++) {
        if (tasksArr[i].title.toLowerCase().includes(term.toLowerCase()) || tasksArr[i].category.toLowerCase().includes(term.toLowerCase())) {
            displayTask(i);
        }
    }
}

function getTaskInfo(index) {
    updateIndex = index;
    showModal();
    statusInput.value = tasksArr[index].status;
    categoryInput.value = tasksArr[index].category;
    titleInput.value = tasksArr[index].title;
    descriptionInput.value = tasksArr[index].description;

    addBtn.classList.replace("d-block", "d-none");
    updateBtn.classList.replace("d-none", "d-block");
}

function editTask() {
    tasksArr[updateIndex].status = statusInput.value;
    tasksArr[updateIndex].category = categoryInput.value;
    tasksArr[updateIndex].title = titleInput.value;
    tasksArr[updateIndex].description = descriptionInput.value;

    if (validate(titleInput, titleRegex) && validate(descriptionInput, descRegex)) {
        setLocalStorage();
        resetContainers();
        resetCounters();
        displayAllTasks();
        hideModal();
    } else {
        alert("Invalid Data");
    }
}

function validate(element, regex) {
    if (regex.test(element.value)) {
        element.classList.add("is-valid");
        element.classList.remove("is-invalid");
        element.parentElement.nextElementSibling.classList.replace("d-block", "d-none");
        return true;
    }

    element.classList.add("is-invalid");
    element.classList.remove("is-valid");
    element.parentElement.nextElementSibling.classList.replace("d-none", "d-block");
    return false;
}

function generateRandomColor() {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function changeBackgroundColor(index) {
    tasksArr[index].bgColor = generateRandomColor();
    setLocalStorage();
    resetContainers();
    resetCounters();
    displayAllTasks();
}

function resetBackgroundColor(index) {
    tasksArr[index].bgColor = "#0d1117";
    setLocalStorage();
    resetContainers();
    resetCounters();
    displayAllTasks();
}

function changeToBars(){
    gridBtn.classList.remove("active");
    barsBtn.classList.add("active");
    for(var i=0; i < section.length; i++){
        section[i].classList.remove("col-md-6", "col-lg-4");
        section[i].style.overflow = "auto"
    }
    for(var j = 0; j < tasksContainer.length; j++){
        tasksContainer[j].setAttribute("data-view", "bars")
    }
}
function changeToGrid(){
    barsBtn.classList.remove("active");
    gridBtn.classList.add("active");
    for (var i = 0; i < section.length; i++) {
        section[i].classList.add("col-md-6", "col-lg-4");
        section[i].style.overflow = "hidden";
    }
    for (var j = 0; j < tasksContainer.length; j++) {
        tasksContainer[j].setAttribute("data-view", "grid");
    }
}
function toggleDarkMode() {
    var root = document.documentElement;

    if (darkMode) {
        // Switch to light mode
        root.style.setProperty("--main-black", "#0d1117");
        root.style.setProperty("--sec-black", "#161b22");
        tasksContainer.forEach(task => {
            task.style.backgroundColor = "#0d1117";
        });

        darkMode = false;
    } else {
        // Switch to dark mode
        root.style.setProperty("--main-black", "#ffffff");
        root.style.setProperty("--sec-black", "#f8f9fa");
        tasksContainer.forEach(task => {
            task.style.backgroundColor = "#ffffff";
        });

        darkMode = true;
    }
}
// Events
newTaskBtn.addEventListener("click", showModal);
addBtn.addEventListener("click", addTask);
modal.addEventListener("click", function (event) {
    if (event.target.id === "modal") {
        hideModal();
    }
});

document.addEventListener("keyup", function (event) {
    if (event.code === "Escape") {
        hideModal();
    }
});
searchInput.addEventListener("input", searchTasks);

updateBtn.addEventListener("click", editTask);

titleInput.addEventListener("input", function () {
    validate(titleInput, titleRegex);
});
descriptionInput.addEventListener("input", function () {
    validate(descriptionInput, descRegex);
});

barsBtn.addEventListener("click", changeToBars)
gridBtn.addEventListener("click", changeToGrid)
modeBtn.addEventListener("click", toggleDarkMode);