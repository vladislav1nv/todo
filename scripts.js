const taskInput = document.querySelector('#task-input')
const emptyList = document.querySelector('#empty-state')
const addTaskBtn = document.getElementById('add-btn')
const taskListElement = document.getElementById('task-list')
const addDBBtn = document.getElementById('add-DB-btn')

let tasks = []

loadTasks()

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
})

// Проверка на пустой список
function checkEmptyList() {
    if (tasks.length == 0) {
        emptyList.classList.remove('none')
    } else {
        emptyList.classList.add('none')
    }
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

// Сохранение в базу данных
addDBBtn.onclick = function () {
    fetch("http://localhost:5000/save-tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tasks)
    })
    .then(res => res.json())
    .then(data => alert("Сохранено задач: " + data.count))
}

// Загрузка из базы данных
function loadTasks() {
    fetch("http://localhost:5000/get-tasks")
    .then(res => res.json())
    .then(data => {
        tasks = data;
        tasks.forEach((task) => renderTask(task))
        checkEmptyList()
    })
}