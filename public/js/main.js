const list = document.getElementById("list");
const listInput = document.getElementById("list-input");
const addTaskBtn = document.getElementById("add-task");
const taskName = document.getElementById("task-name");
const taskDescription = document.getElementById("task-description");

function addTask(task) {
    taskName.value = "";
    taskDescription.value = "";
    const taskTemplate = `
            <li>
                <div>
                    <h2>${task.name}</h2>
                    <p>${task.description}</p>
                </div>
                <div>
                    <form action="/update">
                        <input type="checkbox" name="completion" ${task.completion}>
                        <input type="hidden" name="task-id" value="${task.id}">
                    </form>
                    <form action="/delete">
                        <input type="button" value="delete">
                        <input type="hidden" name="task-id" value="${task.id}">
                    </form>
                </div>
            </li>`
    list.innerHTML += taskTemplate;
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