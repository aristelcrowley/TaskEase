const API_BASE_URL = 'http://localhost:8080/api';
const historyListContainer = document.getElementById('history-list');
const profileModal = document.getElementById('profileModal');
const closeProfileModal = document.getElementById('closeProfileModal');
const cancelProfileEdit = document.getElementById('cancelProfileEdit');
const saveProfileChanges = document.getElementById('saveProfileChanges');
const usernameDisplay = document.getElementById('username');
const newUsernameInput = document.getElementById('newUsername');

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

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
            return payload.user_id; 
        } catch (error) {
            console.error('Error decoding JWT:', error);
            return null;
        }
    }
    return null;
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

    fetchTaskHistory(); // Call fetchTaskHistory when the page loads
    setupProfileModal();
});

async function fetchTaskHistory() {
    try {
        const response = await fetch(`${API_BASE_URL}/history`, {
            credentials: 'include'
        });
        if (!response.ok) {
            const error = await response.json();
            console.error('Failed to fetch task history:', error);
            historyListContainer.innerHTML = '<p class="error-message">Failed to load task history.</p>';
            return;
        }
        const data = await response.json();
        renderTaskHistory(data.history);
    } catch (error) {
        console.error('Error fetching task history:', error);
        historyListContainer.innerHTML = '<p class="error-message">Error loading task history.</p>';
    }
}

function formatDate(dateString) {
    if (!dateString) {
        console.error('Invalid date string (null or undefined):', dateString);
        return 'Invalid Date';
    }
    try {
        const date = new Date(dateString);
        if (isNaN(date)) {
            console.error('Invalid date string (parsing failed):', dateString);
            return 'Invalid Date';
        }
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString(undefined, options);
    } catch (error) {
        console.error('Error formatting date:', error, 'for string:', dateString);
        return 'Invalid Date';
    }
}

function renderTaskHistory(tasks) {
    historyListContainer.innerHTML = '';

    if (!tasks || tasks.length === 0) {
        historyListContainer.innerHTML = '<p>No completed tasks history available.</p>';
        return;
    }

    const groupedTasks = tasks.reduce((acc, task) => {
        let completionDateObj;
        if (task.UpdatedAt) {
            completionDateObj = new Date(task.UpdatedAt);
        } else if (task.updated_at) {
            completionDateObj = new Date(task.updated_at);
        }

        const completionMonthYear = completionDateObj && !isNaN(completionDateObj)
            ? `${completionDateObj.toLocaleString('default', { month: 'long' })} ${completionDateObj.getFullYear()}`
            : 'Unknown Month';

        if (!acc[completionMonthYear]) {
            acc[completionMonthYear] = [];
        }
        acc[completionMonthYear].push(task);
        return acc;
    }, {});

    for (const monthYear in groupedTasks) {
        const tasksInMonth = groupedTasks[monthYear];
        const historyGroup = document.createElement('div');
        historyGroup.className = 'history-group';

        const monthHeader = document.createElement('h3');
        monthHeader.className = 'history-date';
        monthHeader.textContent = monthYear;
        historyGroup.appendChild(monthHeader);

        tasksInMonth.forEach(task => {

            const taskName = task.TaskName || task.task_name || 'Unknown Task';
            let formattedDate = 'Unknown Date';
            let dateObj;
            if (task.UpdatedAt) {
                dateObj = new Date(task.UpdatedAt);
            } else if (task.updated_at) {
                dateObj = new Date(task.updated_at);
            }

            if (dateObj && !isNaN(dateObj)) {
                formattedDate = dateObj.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
            }

            const taskRow = document.createElement('div'); // DEFINE taskRow HERE
            taskRow.className = 'completed-task';
            taskRow.innerHTML = `
                <i class="fas fa-check-circle check-icon"></i>
                <span class="task-name">${taskName}</span>
                <span class="completion-time"><i class="fas fa-calendar-alt"></i> ${formattedDate}</span>
            `;
            historyGroup.appendChild(taskRow);
        });

        historyListContainer.appendChild(historyGroup);
    }
}

function setupProfileModal() {
    const profileSection = document.getElementById('profileSection');

    profileSection.addEventListener('click', function () {
        newUsernameInput.value = usernameDisplay.textContent;
        profileModal.style.display = 'block';
    });

    function closeModal() {
        profileModal.style.display = 'none';
    }

    closeProfileModal.addEventListener('click', closeModal);
    cancelProfileEdit.addEventListener('click', closeModal);

    saveProfileChanges.addEventListener('click', function () {
        const newUsername = newUsernameInput.value.trim();
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (!newUsername) {
            alert('Username cannot be empty');
            return;
        }

        if (newPassword && newPassword !== confirmPassword) {
            alert('New passwords do not match');
            return;
        }

        usernameDisplay.textContent = newUsername;
        alert('Profile updated successfully!');
        closeModal();

        document.getElementById('currentPassword').value = '';
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmPassword').value = '';
    });

    window.addEventListener('click', function (event) {
        if (event.target === profileModal) {
            closeModal();
        }
    });
}