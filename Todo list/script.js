

const taskInput = document.querySelector(".task-input input"),
filters = document.querySelectorAll(".filters span"),//we select of filters then span tag filters means that on checking it send to completed section and not then still present in all and also in pending
clearAll = document.querySelector(".clear-btn"),
taskBox = document.querySelector(".task-box");

let editId,
isEditTask = false,
 // getting local storage todos-list
todos = JSON.parse(localStorage.getItem("todo-list"));// we have to parse this localstorage value to js object
// filters means that on checking it send to completed section and not then still present in all and also in pending
filters.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector("span.active").classList.remove("active");
        btn.classList.add("active");
        showTodo(btn.id);
    });
});

function showTodo(filter) {// filters means that on checking it send to completed section and not then still present in all and also in pending
    let liTag = "";
    if(todos) {
        todos.forEach((todo, id) => {
            // if todo status is completed , set the completed to checked
            let completed = todo.status == "completed" ? "checked" : "";
            // this completed is made because on refreshing page our checked todos not changes which is fullfil by passing this completed to ${completed}
            if(filter == todo.status || filter == "all") {// filters means that on checking it send to completed section and not then still present in all and also in pending
                 //  in edit task li onclick== we pass name and id both because we also want to edit the name of respective id
                liTag += `<li class="task">
                            <label for="${id}">
                                <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${completed}>
                                <p class="${completed}">${todo.name}</p>
                            </label>
                            <div class="settings">
                                <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                                <ul class="task-menu">
                               
                                    <li onclick='editTask(${id}, "${todo.name}")'><i class="uil uil-pen"></i>Edit</li>
                                    <li onclick='deleteTask(${id}, "${filter}")'><i class="uil uil-trash"></i>Delete</li>
                                </ul>
                            </div>
                        </li>`;
            }
        });
    }
    // if li isnt empty insert thid value inside taskbox else insert span
    taskBox.innerHTML = liTag || `<span>You don't have any task here</span>`;
    let checkTask = taskBox.querySelectorAll(".task");
    !checkTask.length ? clearAll.classList.remove("active") : clearAll.classList.add("active");
    taskBox.offsetHeight >= 300 ? taskBox.classList.add("overflow") : taskBox.classList.remove("overflow");
}
showTodo("all");

function showMenu(selectedTask) {
    // getting task menu div
    let menuDiv = selectedTask.parentElement.lastElementChild;
    menuDiv.classList.add("show");
    document.addEventListener("click", e => {
        // below three line code use for when show is open and we click on other part of document then it get closed on click
        if(e.target.tagName != "I" || e.target != selectedTask) {
            menuDiv.classList.remove("show");// this will add a new class inside the mention class
        }
    });
}

function updateStatus(selectedTask) {
    //getting paargrph that contain task name
    let taskName = selectedTask.parentElement.lastElementChild;
    if(selectedTask.checked) {
        taskName.classList.add("checked");//here this property of js is used to update class status in html code 
        // update the status of selected task to compeleted in local storage  
        todos[selectedTask.id].status = "completed";
    } else {
        taskName.classList.remove("checked");
        // update the status of selected task to pending in local storage  
        todos[selectedTask.id].status = "pending";
    }
    localStorage.setItem("todo-list", JSON.stringify(todos))//The JSON. stringify() method converts a JavaScript object or value to a JSON string
}

function editTask(taskId, textName) {
    editId = taskId;// the task which want to edit , we have to equal it to editid so we can use it outside this function
    isEditTask = true;// make it true so that it pass in else condition in para syntaxs where we add eventlistner
    taskInput.value = textName;//by this after clicking on edit button the respective todo get written into the input from where we add task button after enter it add it into new task , not update it 
    taskInput.focus();
    taskInput.classList.add("active");
}

function deleteTask(deleteId, filter) {
    isEditTask = false;
    // removing selected task from array/ todos
    todos.splice(deleteId, 1);
    localStorage.setItem("todo-list", JSON.stringify(todos));// saving updated todos to localhost 
    showTodo(filter);//by this call after tabbing on delete button it get removed from list prevousily it only shown on application(in inspect)
}

clearAll.addEventListener("click", () => {
    isEditTask = false;
    // removing all items of array/todos
    todos.splice(0, todos.length);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo("all")
});

taskInput.addEventListener("keyup", e => {
    let userTask = taskInput.value.trim();
    if(e.key == "Enter" && userTask) {
        if(!isEditTask) {// here isedited is not true ,means if  edit button is not called then we push the written input task as new task
            todos = !todos ? [] : todos;// !todos is not exist then pass empty to todos 
            let taskInfo = {name: userTask, status: "pending"};
            todos.push(taskInfo);
        } else {// else we will change the editid , which is same
            isEditTask = false;
            todos[editId].name = userTask;
        }
        taskInput.value = "";
        localStorage.setItem("todo-list", JSON.stringify(todos));
        showTodo(document.querySelector("span.active").id);
    }
});


 //The trim() method removes whitespace from both ends of a string and returns a new string, without modifying the original string.