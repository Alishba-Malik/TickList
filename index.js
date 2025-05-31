document.addEventListener('DOMContentLoaded', () => {
    const todoList = document.getElementById('todoList');
    const input = document.getElementById('todoInput');
    const dueDate = document.getElementById('dueDate');

    const themeToggleBtn = document.querySelector('.theme-toggle');
    const stats = {
        total: document.getElementById('totalCount'),
        completed: document.getElementById('completedCount'),
        remaining: document.getElementById('remainingCount'),
    };

    let currentTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', currentTheme);
    updateThemeIcon();

    let todos = JSON.parse(localStorage.getItem('todos')) || [];

    renderTodos();

    themeToggleBtn.addEventListener('click', () => {
        currentTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.body.setAttribute('data-theme', currentTheme);
        localStorage.setItem('theme', currentTheme);
        updateThemeIcon();
    });

    document.querySelector('.add-btn').addEventListener('click', () => {
        const text = input.value.trim();
        const date = dueDate.value ? new Date(dueDate.value).toLocaleDateString() : 'No deadline';
        if (!text) return;

        todos.push({ text, date, completed: false });
        saveTodos();
        renderTodos();

        input.value = '';
        dueDate.value = '';
    });

    todoList.addEventListener('click', (e) => {
        const li = e.target.closest('li');
        const index = [...todoList.children].indexOf(li);

        if (e.target.matches('.delete-btn, .delete-btn *')) {
            li.classList.add('fade-out');
            setTimeout(() => {
                todos.splice(index, 1);
                saveTodos();
                renderTodos();
            }, 300);
        } else if (e.target.matches('.checkbox')) {
            todos[index].completed = !todos[index].completed;
            saveTodos();
            renderTodos();
        }
    });

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            filterTasks(btn.textContent.toLowerCase());
        });
    });

    function renderTodos() {
        todoList.innerHTML = '';
        todos.forEach(todo => {
            const li = document.createElement('li');
            li.className = 'todo-item fade-in';
            if (todo.completed) li.classList.add('completed');

            li.innerHTML = `
                <input type="checkbox" class="checkbox" ${todo.completed ? 'checked' : ''}>
                <span>${escapeHTML(todo.text)}</span>
                <span class="due-date">${escapeHTML(todo.date)}</span>
                <button class="delete-btn"><i class="fas fa-trash"></i></button>
            `;
            todoList.appendChild(li);
        });
        updateStats();
    }

    function updateThemeIcon() {
        const icon = themeToggleBtn.querySelector('i');
        icon.className = currentTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }

    function filterTasks(filter) {
        document.querySelectorAll('#todoList li').forEach(item => {
            const isCompleted = item.classList.contains('completed');
            item.style.display = (
                filter === 'all' ||
                (filter === 'completed' && isCompleted) ||
                (filter === 'active' && !isCompleted)
            ) ? 'flex' : 'none';
        });
    }

    function updateStats() {
        const total = todos.length;
        const completed = todos.filter(t => t.completed).length;
        stats.total.textContent = total;
        stats.completed.textContent = completed;
        stats.remaining.textContent = total - completed;
    }

    function escapeHTML(str) {
        return str.replace(/[&<>"']/g, m => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;',
            '"': '&quot;', "'": '&#39;'
        }[m]));
    }

    function saveTodos() {
        localStorage.setItem('todos', JSON.stringify(todos));
    }
});
