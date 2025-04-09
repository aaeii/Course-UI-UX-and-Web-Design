const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const taskDescription = document.querySelector('#taskDescription');
const tasksList = document.querySelector('#tasksList');
const taskDate = document.querySelector('#taskDate');
const taskPriority = document.querySelector('#priority');
let tasks = [];
if (localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.forEach(function (task) {
        renderTask(task);
    })
}

function updateTaskList(sortedTasks) {
    tasksList.innerHTML = "";
    sortedTasks.forEach(renderTask); 
}

const filterButton = document.querySelector('#filter');
filterButton.addEventListener('click', sort);
function sort() {
    const tasks2 = [...tasks];
    const sortOrder = document.querySelector('#dateFilter').value;
    const sortPriority = document.querySelector('#priorityFilter').value;
    // console.log('Выбранный порядок сортировки:', sortOrder);
    // console.log('Выбранный приоритет:', sortPriority);
    let sortedTasks;

    if (sortOrder === 'dateMax') {
        sortedTasks = tasks2.slice().sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sortOrder === 'dateMin') {
        sortedTasks = tasks2.slice().sort((a, b) => new Date(b.date) - new Date(a.date));
    } else {
        sortedTasks = tasks2;
    }

    if (sortPriority !== 'all') {
        sortedTasks = sortedTasks.filter(task => task.priority === sortPriority);
    }

    // console.log('Отсортированные и отфильтрованные задачи:', sortedTasks);
    saveToLocalStorage();
    updateTaskList(sortedTasks);
}


form.addEventListener('submit', addTask);
function addTask(event) {
    event.preventDefault();//убираем обновление страницы
    const taskText = taskInput.value;
    const taskTextDescription = taskDescription.value;
    const taskDatee = taskDate.value;

    if (!taskText || !taskDatee) {
        alert("Пожалуйста, заполните текст задачи и выберите дату.");
        return;
    }
    if (new Date(taskDatee) <= new Date()) {
        alert('Некорректный срок выполнения.');
        return;
    }
    const newTask = {
        id: Date.now(),
        text: taskText,
        textD: taskTextDescription,
        date: taskDatee,
        priority: taskPriority.value,
        done: false,
        edit: 0
    };
    tasks.push(newTask);
    renderTask(newTask);

    taskInput.value = "";
    taskInput.focus();
    taskDescription.value = "";
    saveToLocalStorage();
}
//удаление задачи
tasksList.addEventListener('click', deleteTask);
function deleteTask(event) {
    if (event.target.dataset.action !== 'delete') {
        return;
    }
    const parentNode = event.target.closest('.list-group-item');
    //определяем id
    const id = parentNode.id;
    const index = tasks.findIndex(function (task) {
        return task.id == id;
    });
    tasks.splice(index, 1);//удаление
    parentNode.remove();
    saveToLocalStorage();
}

//отмечаем задачу завершенной
tasksList.addEventListener('click', doneTask);
function doneTask(event) {
    if (event.target.dataset.action === 'done') {
        const parentNode = event.target.closest('.list-group-item');
        const id = parentNode.id;
        const task = tasks.find(function (task) {
            return task.id == id;
        });
        task.done = !task.done;
        saveToLocalStorage();
        const taskTitle = parentNode.querySelector('.task-title');
        taskTitle.classList.toggle('done');
        const taskDescription = parentNode.querySelector('.task-description');
        taskDescription.classList.toggle('done');

    }

}

function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTask(task) {
    const cssClass = task.done ? "task-title done" : "task-title";
    const cssClass2 = task.done ? "task-description done" : "task-description";

    let priorityColor = '';

    switch (task.priority) {
        case 'low':
            priorityColor = 'rgb(221, 255, 226)';
            break;
        case 'medium':
            priorityColor = 'rgb(255, 243, 211)';
            break;
        case 'high':
            priorityColor = 'rgb(255, 218, 218)';
            break;
    }
    //разметка для новой задачи
    const taskHTML = `<li id="${task.id}" class="list-group-item task-item">
					<span class="${cssClass}">${task.text}</span>
                    <span class="${cssClass2}">${task.textD}</span>
                    <div>
                    <span class="task-priority" style="background-color: ${priorityColor}">${task.priority}</span>
                    </div>
                    <div>
                      <span class="task-date" >${task.date}</span> 
                    </div>
					<div class="task-item__buttons">
						<button type="button" data-action="done" class="btn-action" title="Done">
							<img src="src//img/tick.svg" alt="Done">
						</button>
						<button type="button" data-action="delete" class="btn-action" title="Delete">
							<img src="src/img/cross.svg" alt="Delete" >
						</button>
					</div>

                    
				</li>`;
    //добавляем задачу на страницу
    tasksList.insertAdjacentHTML('beforeend', taskHTML);
}
