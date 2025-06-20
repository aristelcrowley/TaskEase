const API_BASE_URL = 'http://localhost:8080/api';
const tasksContainer = document.querySelector('.tasks-container');
const taskModal = document.getElementById('task-modal');
const closeTaskModalBtn = document.querySelector('.close-modal2');
const addTaskBtn = document.getElementById('add-task-btn');
const saveTaskBtn = document.getElementById('save-task-btn');
const deleteTaskBtn = document.getElementById('delete-task-btn');
const addSubtaskBtn = document.getElementById('add-subtask-btn');
const subtasksContainer = document.getElementById('subtasks-container');
let currentTaskId = null;
let currentProjectId = null; 

const profileModal = document.getElementById('profileModal');
const closeProfileModal = document.getElementById('closeProfileModal');
const cancelProfileEdit = document.getElementById('cancelProfileEdit');
const saveProfileChanges = document.getElementById('saveProfileChanges');
const usernameDisplay = document.getElementById('username');

function getUserIdFromTokenCookie() {
    const token = getCookie('token');
    if (token) {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            const payload = JSON.parse(jsonPayload);
            return payload.user_id; // Assuming your JWT payload has 'user_id'
        } catch (error) {
            console.error('Error decoding JWT:', error);
            return null;
        }
    }
    return null;
}

async function fetchUsername() {
    try {
        const response = await fetch(`${API_BASE_URL}/user`, { 
            credentials: 'include'
        });
        if (!response.ok) {
            const error = await response.json();
            console.error('Failed to fetch user info:', error);
            usernameDisplay.textContent = 'User'; // Default name if fetch fails
            return;
        }
        const userData = await response.json();
        if (userData && userData.username) { // Adjust 'username' to the actual field
            usernameDisplay.textContent = userData.username;
        } else if (userData && userData.name) { // Check for 'name' as a fallback
            usernameDisplay.textContent = userData.name;
        } else {
            usernameDisplay.textContent = 'User';
            console.warn('Username or name not found in user data.');
        }
    } catch (error) {
        console.error('Error fetching user info:', error);
        usernameDisplay.textContent = 'User'; // Default name on error
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const projectLink = document.getElementById('project-link');
    if (projectLink) {
        projectLink.addEventListener('click', function(event) {
            event.preventDefault();
            const userId = getUserIdFromTokenCookie();
            if (userId) {
                this.href = `/project/${userId}`;
                window.location.href = this.href;
            } else {
                console.error('User ID not found in token cookie.');
            }
        });
    }

    const noteLink = document.getElementById('note-link');
    if (noteLink) {
        noteLink.addEventListener('click', function(event) {
            event.preventDefault();
            const userId = getUserIdFromTokenCookie();
            if (userId) {
                this.href = `/note/${userId}`;
                window.location.href = this.href;
            } else {
                console.error('User ID not found in token cookie.');
            }
        });
    }

    const historyLink = document.getElementById('history-link');
    if (historyLink) {
        historyLink.addEventListener('click', function(event) {
            event.preventDefault();
            const userId = getUserIdFromTokenCookie();
            if (userId) {
                this.href = `/history/${userId}`;
                window.location.href = this.href;
            } else {
                console.error('User ID not found in token cookie.');
            }
        });
    }

    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) {
        logoutLink.addEventListener('click', function(event) {
            event.preventDefault(); // 
            document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; 
            window.location.href = '/'; 
        });
    }
    
    init(); 
});

function init() {
    const pathSegments = window.location.pathname.split('/');
    currentProjectId = pathSegments[pathSegments.indexOf('task') + 1];

    if (!currentProjectId) {
        console.error('Project ID not found in the URL.');
        return;
    }

    fetchTasks(currentProjectId);
    setupEventListeners();
    fetchUsername();
}

const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
};

async function fetchTasks(projectId) {
    tasksContainer.innerHTML = ''; 
    try {
        const response = await fetch(`${API_BASE_URL}/tasks/${projectId}`, {
            credentials: 'include'
        });
        if (!response.ok) {
            const error = await response.json();
            console.error('Failed to fetch tasks:', error);
            tasksContainer.innerHTML = '<p class="error-message">Failed to load tasks.</p>';
            return;
        }
        const data = await response.json();
        renderTasks(data.tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        tasksContainer.innerHTML = '<p class="error-message">Error loading tasks.</p>';
    }
}

function renderTasks(tasks) {
    tasksContainer.innerHTML = '';
    tasks.forEach(task => {
        const taskCard = document.createElement('div');
        taskCard.className = 'task-card';
        taskCard.dataset.id = task.task_id; 

        taskCard.innerHTML = `
            <div class="task-header">
                <h3 class="task-title">${task.task_name}</h3>
            </div>
            <div class="task-details">
                <p><strong>Deadline:</strong> ${formatDate(task.deadline)}</p>
            </div>
        `;

        taskCard.addEventListener('click', () => {
            openTaskModal(task.task_id);
        });
        tasksContainer.appendChild(taskCard);
    });
}

async function fetchSubtasks(taskId) {
    try {
        const response = await fetch(`${API_BASE_URL}/subtask/${taskId}`, {
            credentials: 'include'
        });
        if (!response.ok) {
            const error = await response.json();
            console.error('Failed to fetch subtasks:', error);
            return [];
        }
        const data = await response.json();
        return data.subtasks;
    } catch (error) {
        console.error('Error fetching subtasks:', error);
        return [];
    }
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

function setupEventListeners() {
    if (closeTaskModalBtn) {
        closeTaskModalBtn.addEventListener('click', closeTaskModal);
    } else {
        console.error('Close modal button not found! Selector: .close-modal2');
    }

    window.addEventListener('click', (e) => {
        if (e.target === taskModal) closeTaskModal();
    });

    if (addTaskBtn) {
        addTaskBtn.addEventListener('click', openNewTaskModal);
    }

    if (saveTaskBtn) {
        saveTaskBtn.addEventListener('click', saveTaskChanges);
    }

    if (deleteTaskBtn) {
        deleteTaskBtn.addEventListener('click', deleteTask);
    }

    if (addSubtaskBtn) {
        addSubtaskBtn.addEventListener('click', addSubtask);
    }
}

function openNewTaskModal() {
    if (!taskModal) return;

    document.getElementById('task-name').value = '';
    document.getElementById('task-deadline').value = '';
    document.getElementById('task-complete').checked = false;

    const completeGroup = document.querySelector('.modal-body2 > .form-group2:nth-child(4)');
    if (completeGroup) {
        completeGroup.style.display = 'none';
    }
    if (deleteTaskBtn) {
        deleteTaskBtn.style.display = 'none';
    }
    
    subtasksContainer.innerHTML = '';

    currentTaskId = null;
    taskModal.style.display = 'block';
}

async function openTaskModal(taskId) {
    if (!taskModal) return;

    currentTaskId = taskId;


    try {
        const response = await fetch(`${API_BASE_URL}/task/${taskId}`, {
            credentials: 'include'
        });
        if (!response.ok) {
            const error = await response.json();
            console.error('Failed to fetch task details:', error);
            alert('Failed to load task details.');
            return;
        }
        const taskData = await response.json();
        const task = taskData.task;

        document.getElementById('task-name').value = task.task_name;
        document.getElementById('task-deadline').value = task.deadline.split('T')[0]; // Format date
        document.getElementById('task-complete').checked = task.status === 'Completed';

        const subtasks = await fetchSubtasks(taskId);
        renderSubtasks(subtasks);

        const completeGroup = document.querySelector('.modal-body2 > .form-group2:nth-child(4)');
        if (completeGroup) {
            completeGroup.style.display = 'block';
        }
        if (deleteTaskBtn) {
            deleteTaskBtn.style.display = 'block';
        }

        taskModal.style.display = 'block';

    } catch (error) {
        console.error('Error fetching task details:', error);
        alert('Error loading task details.');
    }
}

function renderSubtasks(subtasks) {
    subtasksContainer.innerHTML = '';
    if (!subtasks || subtasks.length === 0) {
        const noSubtaskMessage = document.createElement('p');
        noSubtaskMessage.textContent = 'No subtasks for this task yet.';
        subtasksContainer.appendChild(noSubtaskMessage);
        return;
    }

    subtasks.forEach(subtask => {
        const subtaskElement = document.createElement('div');
        subtaskElement.className = 'subtask-item';
        subtaskElement.dataset.id = subtask.id;

        subtaskElement.innerHTML = `
            <input type="text" value="${subtask.title}" class="subtask-name">
            <div class="subtask-actions">
                <label class="checkbox-container2">
                    <input type="checkbox" class="subtask-complete" ${subtask.status === 'Completed' ? 'checked' : ''} data-subtask-id="${subtask.id}">
                    <span class="checkmark2"></span>
                </label>
                <button class="delete-subtask" data-subtask-id="${subtask.id}"><i class="fas fa-trash"></i></button>
            </div>
        `;

        const deleteButton = subtaskElement.querySelector('.delete-subtask');
        deleteButton.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteSubtask(e.target.dataset.subtaskId || e.target.closest('button').dataset.subtaskId, subtaskElement);
        });

        const completeCheckbox = subtaskElement.querySelector('.subtask-complete');
        completeCheckbox.addEventListener('change', (e) => {
            updateSubtaskStatus(e.target.dataset.subtaskId, e.target.checked ? 'Completed' : 'Pending');
        });

        subtasksContainer.appendChild(subtaskElement);
    });
}

function addSubtask() {
    const newSubtaskElement = document.createElement('div');
    newSubtaskElement.className = 'subtask-item';
    newSubtaskElement.innerHTML = `
        <input type="text" placeholder="Enter subtask name" class="subtask-name">
        <div class="subtask-actions">
            <label class="checkbox-container2">
                <input type="checkbox" class="subtask-complete" data-subtask-id="new-${Date.now()}">
                <span class="checkmark2"></span>
            </label>
            <button class="delete-subtask" data-subtask-id="new-${Date.now()}"><i class="fas fa-trash"></i></button>
        </div>
    `;

    newSubtaskElement.querySelector('.delete-subtask').addEventListener('click', (e) => {
        e.stopPropagation();
        newSubtaskElement.remove();
    });

    subtasksContainer.appendChild(newSubtaskElement);
    newSubtaskElement.querySelector('.subtask-name').focus();
}

async function saveTaskChanges() {
    if (!currentProjectId) {
        console.error('Project ID is not available.');
        return;
    }

    const taskName = document.getElementById('task-name').value.trim();
    if (!taskName) {
        alert('Please enter a task name');
        return;
    }

    const taskDeadlineInput = document.getElementById('task-deadline').value;
    if (!taskDeadlineInput) {
        alert('Please select a deadline for the task');
        return;
    }
    const taskDeadline = taskDeadlineInput;
    const taskComplete = document.getElementById('task-complete').checked;
    const status = taskComplete ? 'Completed' : 'Pending';

    const subtaskElements = document.querySelectorAll('.subtask-item');
    const subtasksData = Array.from(subtaskElements).map(el => {
        const nameInput = el.querySelector('.subtask-name');
        const completeCheckbox = el.querySelector('.subtask-complete');
        const subtaskId = el.dataset.id;
        return {
            id: subtaskId ? parseInt(subtaskId) : null,
            title: nameInput.value.trim(),
            status: completeCheckbox.checked ? 'Completed' : 'Pending',
        };
    }).filter(subtask => subtask.title !== '');

    const formData = new FormData();
    formData.append('project_id', currentProjectId);
    formData.append('task_name', taskName);
    formData.append('deadline', taskDeadline);
    formData.append('status', status); 

    try {
        let response;
        if (currentTaskId) {
            response = await fetch(`${API_BASE_URL}/task/${currentTaskId}`, {
                method: 'PUT',
                body: formData,
                credentials: 'include'
            });
        } else {
            response = await fetch(`${API_BASE_URL}/task`, {
                method: 'POST',
                body: formData,
                credentials: 'include'
            });
        }
        if (!response.ok) {
            const error = await response.json();
            console.error('Failed to save task:', error);
            alert('Failed to save task.');
            return;
        }

        const savedTask = await response.json();

        await Promise.all(subtasksData.map(async (subtask) => {
            const subtaskFormData = new FormData();
            subtaskFormData.append('title', subtask.title);

            if (subtask.id) {
                subtaskFormData.append('status', subtask.status);
                await fetch(`${API_BASE_URL}/subtask/${subtask.id}`, {
                    method: 'PUT',
                    body: subtaskFormData,
                    credentials: 'include'
                });
            } else if (subtask.title) {

                subtaskFormData.append('task_id', savedTask.task.task_id);
                await fetch(`${API_BASE_URL}/subtask`, {
                    method: 'POST',
                    body: subtaskFormData,
                    credentials: 'include'
                });
            }
        }));

        fetchTasks(currentProjectId);
        closeTaskModal();

    } catch (error) {
        console.error('Error saving task:', error);
        alert('Error saving task.');
    }
}

async function deleteTask() {
    if (!currentTaskId) return;
    if (confirm('Are you sure you want to delete this task?')) {
        try {
            const response = await fetch(`${API_BASE_URL}/task/${currentTaskId}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            if (!response.ok) {
                const error = await response.json();
                console.error('Failed to delete task:', error);
                alert('Failed to delete task.');
                return;
            }
            fetchTasks(currentProjectId);
            closeTaskModal();
        } catch (error) {
            console.error('Error deleting task:', error);
            alert('Error deleting task.');
        }
    }
}

async function deleteSubtask(subtaskId, subtaskElement) {
    if (!subtaskId) return;
    if (subtaskId.startsWith('new-')) {
        subtaskElement.remove();
        return;
    }
    if (confirm('Are you sure you want to delete this subtask?')) {
        try {
            const response = await fetch(`${API_BASE_URL}/subtask/${subtaskId}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            if (!response.ok) {
                const error = await response.json();
                console.error('Failed to delete subtask:', error);
                alert('Failed to delete subtask.');
                return;
            }
            subtaskElement.remove();
        } catch (error) {
            console.error('Error deleting subtask:', error);
            alert('Error deleting subtask.');
        }
    }
}

async function updateSubtaskStatus(subtaskId, newStatus) {
    if (!subtaskId) return;
    try {
        const response = await fetch(`${API_BASE_URL}/subtask/${subtaskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: newStatus }),
            credentials: 'include'
        });
        if (!response.ok) {
            const error = await response.json();
            console.error('Failed to update subtask status:', error);
            alert('Failed to update subtask status.');
        }
        
    } catch (error) {
        console.error('Error updating subtask status:', error);
        alert('Error updating subtask status.');
    }
}

function closeTaskModal() {
    if (taskModal) {
        taskModal.style.display = 'none';
    }
    currentTaskId = null;
}

function openProfileModal() {
    if (!profileModal) return;

    const usernameElement = document.querySelector('.profile-info h3');
    if (usernameElement && document.getElementById('newUsername')) {
        document.getElementById('newUsername').value = usernameElement.textContent;
    }

    if (document.getElementById('currentPassword')) {
        document.getElementById('currentPassword').value = '';
    }

    if (document.getElementById('newPassword')) {
        document.getElementById('newPassword').value = '';
    }

    if (document.getElementById('confirmPassword')) {
        document.getElementById('confirmPassword').value = '';
    }

    profileModal.style.display = 'block';
}

function closeProfileModalFunc() {
    if (profileModal) {
        profileModal.style.display = 'none';
    }
}

function saveProfileFunc() {
    const newUsername = document.getElementById('newUsername').value.trim();
    const currentPassword = document.getElementById('currentPassword').value.trim();
    const newPassword = document.getElementById('newPassword').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();

    if (!newUsername) {
        alert('Username cannot be empty');
        return;
    }

    if (currentPassword) {
        if (!newPassword) {
            alert('New password cannot be empty');
            return;
        }

        if (newPassword !== confirmPassword) {
            alert('New passwords do not match');
            return;
        }
        console.log('Password change requested');
        // In a real application, you would send this data to the backend
        // to update the user's profile.
    } else {
        // If no current password, assume only username update
        console.log('Username update requested');
        // In a real application, you would send the newUsername to the backend.
    }

    const usernameElement = document.querySelector('.profile-info h3');
    if (usernameElement) {
        usernameElement.textContent = newUsername;
    }

    alert('Profile updated successfully!');
    closeProfileModalFunc();
}

document.addEventListener('DOMContentLoaded', init);