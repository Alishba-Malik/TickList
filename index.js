let currentTheme = localStorage.getItem('theme') || 'light';

document.addEventListener('DOMContentLoaded', () => {
    document.body.setAttribute('data-theme', currentTheme);
    updateThemeIcon();
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

function addTodo() {
    const input = document.getElementById('todoInput');
    const dueDate = document.getElementById('dueDate');
    const todoText = input.value.trim();
    
    if (!todoText) return;

    const todoList = document.getElementById('todoList');
    const li = document.createElement('li');
    const date = dueDate.value ? new Date(dueDate.value).toLocaleDateString() : 'No deadline';

    li.className = 'todo-item fade-in';
    li.innerHTML = `
        <input type="checkbox" class="checkbox" onchange="toggleComplete(this)">
        <span>${todoText}</span>
        <span class="due-date">${date}</span>
        <button class="delete-btn" onclick="deleteTodo(this)">
            <i class="fas fa-trash"></i>
        </button>
    `;

    todoList.appendChild(li);
    input.value = '';
    dueDate.value = '';
    updateStats();
}

function toggleComplete(checkbox) {
    const li = checkbox.closest('li');
    li.classList.toggle('completed');
    updateStats();
}

function deleteTodo(button) {
    const li = button.closest('li');
    li.classList.add('fade-out');
    setTimeout(() => {
        li.remove();
        updateStats();
    }, 300);
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
    const total = document.querySelectorAll('#todoList li').length;
    const completed = document.querySelectorAll('#todoList li.completed').length;
    
    document.getElementById('totalCount').textContent = total;
    document.getElementById('completedCount').textContent = completed;
    document.getElementById('remainingCount').textContent = total - completed;
}
