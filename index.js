let currentTheme = localStorage.getItem('theme') || 'light';

document.addEventListener('DOMContentLoaded', () => {
    document.body.setAttribute('data-theme', currentTheme);
    updateThemeIcon();

    const savedTodos = getTodosFromStorage();
    renderTodos(savedTodos);
    updateStats();
});

function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.body.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
    updateThemeIcon();
}

function updateThemeIcon() {
    const themeIcon = document.querySelector('.theme-toggle i');
    themeIcon.className = currentTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
}

function getTodosFromStorage() {
    return JSON.parse(localStorage.getItem('todos')) || [];
}

function setTodosToStorage(todos) {
    localStorage.setItem('todos', JSON.stringify(todos));
}

function addTodo() {
    const input = document.getElementById('todoInput');
    const dueDate = document.getElementById('dueDate');
    const todoText = input.value.trim();

    if (!todoText) return;

    const date = dueDate.value ? new Date(dueDate.value).toLocaleDateString() : 'No deadline';
    const newTodo = { text: todoText, dueDate: date, completed: false };

    const todos = getTodosFromStorage();
    todos.push(newTodo);
    setTodosToStorage(todos);
    renderTodos(todos);
    input.value = '';
    dueDate.value = '';
    updateStats();
}

function renderTodos(todos) {
    const todoList = document.getElementById('todoList');
    todoList.innerHTML = '';

    todos.forEach((todo, index) => {
        const li = document.createElement('li');
        li.className = 'todo-item fade-in';
        if (todo.completed) li.classList.add('completed');

        li.innerHTML = `
            <input type="checkbox" class="checkbox" onchange="toggleComplete(this, ${index})" ${todo.completed ? 'checked' : ''}>
            <span>${todo.text}</span>
            <span class="due-date">${todo.dueDate}</span>
            <button class="delete-btn" onclick="deleteTodo(${index})">
                <i class="fas fa-trash"></i>
            </button>
        `;
        todoList.appendChild(li);
    });
}

function toggleComplete(checkbox, index) {
    const todos = getTodosFromStorage();
    todos[index].completed = checkbox.checked;
    setTodosToStorage(todos);
    renderTodos(todos);
    updateStats();
}

function deleteTodo(index) {
    const todos = getTodosFromStorage();
    todos.splice(index, 1);
    setTodosToStorage(todos);
    renderTodos(todos);
    updateStats();
}

function filterTasks(filter) {
    const items = document.querySelectorAll('#todoList li');
    items.forEach(item => {
        const isCompleted = item.classList.contains('completed');
        item.style.display =
            filter === 'all' ? 'flex' :
            filter === 'completed' && isCompleted ? 'flex' :
            filter === 'active' && !isCompleted ? 'flex' : 'none';
    });
}

function updateStats() {
    const todos = getTodosFromStorage();
    const total = todos.length;
    const completed = todos.filter(t => t.completed).length;
    const remaining = total - completed;

    document.getElementById('totalCount').textContent = total;
    document.getElementById('completedCount').textContent = completed;
    document.getElementById('remainingCount').textContent = remaining;
}

window.addTodo = addTodo;
window.toggleComplete = toggleComplete;
window.deleteTodo = deleteTodo;
window.filterTasks = filterTasks;
window.toggleTheme = toggleTheme;
