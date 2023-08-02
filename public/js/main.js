const list = document.getElementById("list");
const listInput = document.getElementById("list-input");
const addTaskBtn = document.getElementById("add-task");
const taskName = document.getElementById("task-name");
const taskDescription = document.getElementById("task-description");

function addTask(task) {
    taskName.value = "";
    taskDescription.value = "";
    const taskTemplate = `
            <li class="li" data-id="${task.id}">
                <div>
                    <h2>${task.name}</h2>
                    <p>${task.description}</p>
                </div>
                <div>
                    <form action="/update">
                        <input class="checkbox" type="checkbox" name="completion" data-id="${task.id}" onclick="updateTask('${task.id}');" ${task.completion}>
                    </form>
                    <form action="/delete">
                        <input type="button" value="delete" onclick="deleteTask('${task.id}');">
                    </form>
                </div>
            </li>`
    list.innerHTML += taskTemplate;
}

function deleteTask(id) {
    const task = document.querySelector(`.li[data-id="${id}"]`);
    fetch("/delete", {
        method: "POST",
        body: JSON.stringify({id: id}),
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then((response) => {
        if (!response.ok) throw `Error: ${response.status}`;
        return response.json();
    })
    .then(()=> {task.remove()})
    .catch((error) => {
        console.log(error);
    })
}

function updateTask(id) {
    const checkbox = document.querySelector(`.checkbox[data-id="${id}"]`);
    const form = {
        id: id,
        status: checkbox.checked
    }
    fetch("/update", {
        method: "POST",
        body: JSON.stringify(form),
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then((response) => {
        if (!response.ok) throw `Error: ${response.status}`;
        return response.json();
    })
    // .then((data) => {alert("Task successfully updated");})
    .catch((error) => {
        console.log(error);
    })
}

addTaskBtn.onclick = () => {
    let form ={
        "name": taskName.value,
        "description": taskDescription.value
    };
    fetch("/add", {
        method: "POST",
        body: JSON.stringify(form),
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => {
        if (!response.ok) throw `Error: ${response.status}`;
        return response.json();
    })
    .then(data => {
        addTask(data);
    })
    .catch(error => {
        throw `${error}`;
    });
}