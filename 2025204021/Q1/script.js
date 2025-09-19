document.addEventListener('DOMContentLoaded', function() {
    const taskForm = document.getElementById('taskForm');
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');

    // Part 1: Task Creation Functionality
    taskForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const taskText = taskInput.value.trim();
        if (taskText === '') return;

        createTaskItem(taskText);
        taskInput.value = '';
        taskInput.focus();
    });

    function createTaskItem(text) {
        const listItem = document.createElement('li');
        listItem.className = 'task-item';
        listItem.draggable = true;

        listItem.innerHTML = `
            <span class="task-text">${text}</span>
            <button class="remove-btn" data-action="remove">Remove</button>
        `;

        taskList.appendChild(listItem);

        // Add drag event listeners to the new task
        addDragListeners(listItem);
    }

    // Part 2: Task Removal using Event Delegation
    taskList.addEventListener('click', function(event) {
        if (event.target.getAttribute('data-action') === 'remove') {
            const taskItem = event.target.closest('.task-item');
            if (taskItem) {
                taskItem.remove();
            }
        }
    });

    // Part 3: Drag and Drop Functionality
    let draggedElement = null;

    function addDragListeners(element) {
        element.addEventListener('dragstart', handleDragStart);
        element.addEventListener('dragend', handleDragEnd);
    }

    function handleDragStart(event) {
        draggedElement = this;
        this.classList.add('dragging');

        // Set drag effect
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/html', this.outerHTML);
    }

    function handleDragEnd(event) {
        this.classList.remove('dragging');
        draggedElement = null;
        taskList.classList.remove('drag-over');
    }

    // Make task list a drop zone
    taskList.addEventListener('dragover', function(event) {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
        this.classList.add('drag-over');

        const afterElement = getDragAfterElement(taskList, event.clientY);
        if (afterElement == null) {
            taskList.appendChild(draggedElement);
        } else {
            taskList.insertBefore(draggedElement, afterElement);
        }
    });

    taskList.addEventListener('dragleave', function(event) {
        if (!taskList.contains(event.relatedTarget)) {
            this.classList.remove('drag-over');
        }
    });

    taskList.addEventListener('drop', function(event) {
        event.preventDefault();
        this.classList.remove('drag-over');

        if (draggedElement) {
            const afterElement = getDragAfterElement(taskList, event.clientY);
            if (afterElement == null) {
                taskList.appendChild(draggedElement);
            } else {
                taskList.insertBefore(draggedElement, afterElement);
            }
        }
    });

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.task-item:not(.dragging)')];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;

            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }
});