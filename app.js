const taskInput = document.querySelector('#task-input')
const emptyList = document.querySelector('#empty-state')
const addTaskBtn = document.getElementById('add-btn')
const taskListElement = document.getElementById('task-list')

let tasks = []

if (localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'))
}

tasks.forEach((task) => renderTask(task))

checkEmptyList()

// Добавление задачи
addTaskBtn.onclick = function () {
    const taskText = taskInput.value

    if (!taskInput.value == '') {
        const newTask = {
        id: Date.now(),
        text: taskText,
        done: false,
        }
        tasks.push(newTask)

        renderTask(newTask)

        taskInput.value = ''
        taskInput.focus() 
    }
    checkEmptyList()
    saveToLocalStorage()
}

// Удаление задачи
taskListElement.addEventListener('click', function (event) {
    if (event.target.dataset.action === 'delete') {
        const parentTask = event.target.closest('li')
        
        const id = Number(parentTask.id)
        const index = tasks.findIndex((task) => task.id === id)
        tasks.splice(index, 1)

        parentTask.remove()
    }

    checkEmptyList()
    saveToLocalStorage()
})

// Выполнение задачи
taskListElement.addEventListener('click', function (event) {
    if (event.target.dataset.action === 'done') {
        const parentTask = event.target.closest('li')
        // Как делать не надо))
        // if (parentTask.classList.value === "task-item task-done") {
        //     parentTask.classList.remove('task-done')
        // } else {
        //     parentTask.classList.add('task-done')
        // }
        // Как делать надо))

        const id = Number(parentTask.id)
        const task = tasks.find((task) => task.id === id)
        task.done = !task.done

        parentTask.classList.toggle('task-done')
    }
    saveToLocalStorage()
})

// Проверка на пустой список
function checkEmptyList() {
    if (tasks.length == 0) {
        emptyList.classList.remove('none')
    } else {
        emptyList.classList.add('none')
    }
}

// Сохранение в lovalStorage
function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks))
}

// Рендер задачи
function renderTask(task) {
    const cssClass = task.done ? 'task-item task-done' : 'task-item'
    const taskHTML = `<li id="${task.id}" class="${cssClass}">
                    <button class="task-button complete-button" data-action="done" >✓</button>
                    <span class="task-text">${task.text}</span>
                    <button class="task-button delete-button" data-action="delete">✕</button>
                    </li> `
    taskListElement.insertAdjacentHTML('beforeend', taskHTML)
}