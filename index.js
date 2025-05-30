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

        const li = document.createElement('li');
        li.className = 'todo-item fade-in';
        li.innerHTML = `
            <input type="checkbox" class="checkbox">
            <span>${escapeHTML(text)}</span>
            <span class="due-date">${escapeHTML(date)}</span>
            <button class="delete-btn"><i class="fas fa-trash"></i></button>
        `;
        todoList.appendChild(li);

        input.value = '';
        dueDate.value = '';
        updateStats();
    });

    todoList.addEventListener('click', (e) => {
        if (e.target.matches('.delete-btn, .delete-btn *')) {
            const li = e.target.closest('li');
            li.classList.add('fade-out');
            setTimeout(() => {
                li.remove();
                updateStats();
            }, 300);
        } else if (e.target.matches('.checkbox')) {
            e.target.closest('li').classList.toggle('completed');
            updateStats();
        }
    });

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            filterTasks(btn.textContent.toLowerCase());
        });
    });

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
        const all = document.querySelectorAll('#todoList li');
        const done = document.querySelectorAll('#todoList li.completed');
        stats.total.textContent = all.length;
        stats.completed.textContent = done.length;
        stats.remaining.textContent = all.length - done.length;
    }

    function escapeHTML(str) {
        return str.replace(/[&<>"']/g, m => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;',
            '"': '&quot;', "'": '&#39;'
        }[m]));
    }
});
