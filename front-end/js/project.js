const projectsList = document.getElementById('projects-list');
const addProjectBtn = document.getElementById('addProjectBtn');
const projectModal = document.getElementById('projectModal');
const projectModalTitle = document.getElementById('projectModalTitle');
const projectNameInput = document.getElementById('projectName');
const saveProjectBtn = document.getElementById('saveProjectChanges');
const closeProjectModalBtn = document.getElementById('closeProjectModal');
const cancelProjectBtn = document.getElementById('cancelProjectEdit');

const errorModal = document.getElementById('errorModal');
const errorMessageDisplay = document.getElementById('errorMessage');
const closeErrorModalBtn = document.getElementById('closeErrorModalBtn');

const API_BASE_URL = 'http://localhost:8080/api';

function showErrorModal(message) {
    errorMessageDisplay.textContent = message;
    errorModal.style.display = 'flex';
}

// Function to close the error modal
function closeErrorModal() {
    errorModal.style.display = 'none';
}

// Function to fetch projects from the API
async function fetchProjects() {
    try {
        const response = await fetch(`${API_BASE_URL}/project`, {
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include' // Include cookies in the request
        });

        if (!response.ok) {
            const errorData = await response.json();
            showErrorModal(errorData.error || 'Failed to fetch projects.');
            return;
        }

        const data = await response.json();
        renderProjects(data.projects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        showErrorModal('An unexpected error occurred while fetching projects.');
    }
}

// Function to render the project list
function renderProjects(projects) {
    projectsList.innerHTML = '';
    projects.forEach(project => {
        const projectRow = document.createElement('div');
        projectRow.className = 'project-row';
        projectRow.innerHTML = `
            <div class="project-name">
                <i class="fas fa-file-alt file-icon"></i>
                <div class="name-details">${project.project_name}</div>
            </div>
            <div class="deadline">
                <i class="fas fa-calendar"></i>
                <span>Created at: ${new Date(project.created_at).toLocaleDateString()}</span>
            </div>
            <div class="actions">
                <button class="btn-edit editProject" data-project-id="${project.project_id}" data-project-name="${project.project_name}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-delete deleteProject" data-project-id="${project.project_id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;

        // Row click for navigation to tasks (adjust URL as needed)
        projectRow.addEventListener('click', function(e) {
            if (!e.target.closest('.btn-delete') && !e.target.closest('.btn-edit')) {
                window.location.href = `task.html?project=${encodeURIComponent(project.project_name)}&projectId=${project.project_id}`;
            }
        });
        projectRow.style.cursor = 'pointer';
        projectsList.appendChild(projectRow);
    });

    // Add event listeners for delete and edit buttons after rendering
    document.querySelectorAll('.deleteProject').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const projectId = this.getAttribute('data-project-id');
            deleteProject(projectId);
        });
    });

    document.querySelectorAll('.editProject').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const projectId = this.getAttribute('data-project-id');
            const projectName = this.getAttribute('data-project-name');
            openEditProjectModal(projectId, projectName);
        });
    });
}

// Function to delete a project
async function deleteProject(projectId) {
    const confirmDelete = confirm(`Are you sure you want to delete this project?`);
    if (confirmDelete) {
        try {
            const response = await fetch(`${API_BASE_URL}/project/${projectId}`, {
                method: 'DELETE',
                credentials: 'include' // Include cookies
            });

            if (!response.ok) {
                const errorData = await response.json();
                showErrorModal(errorData.error || 'Failed to delete project.');
                return;
            }

            fetchProjects(); // Refresh the project list
        } catch (error) {
            console.error('Error deleting project:', error);
            showErrorModal('An unexpected error occurred while deleting the project.');
        }
    }
}

// Function to open the add new project modal
function openAddProjectModal() {
    projectModalTitle.textContent = 'Add New Project';
    projectNameInput.value = '';
    saveProjectBtn.setAttribute('data-mode', 'add');
    projectModal.style.display = 'block';
}

// Function to open the edit project modal
function openEditProjectModal(projectId, projectName) {
    projectModalTitle.textContent = 'Edit Project';
    projectNameInput.value = projectName;
    saveProjectBtn.setAttribute('data-mode', 'edit');
    saveProjectBtn.setAttribute('data-project-id', projectId);
    projectModal.style.display = 'block';
}

// Function to handle saving project changes (add or edit)
async function saveProjectChanges() {
    const projectName = projectNameInput.value.trim();
    const mode = saveProjectBtn.getAttribute('data-mode');
    const projectId = saveProjectBtn.getAttribute('data-project-id');

    if (!projectName) {
        showErrorModal('Project name cannot be empty.');
        return;
    }

    try {
        let response;
        let method = 'POST';
        let url = `${API_BASE_URL}/project`;

        if (mode === 'edit') {
            method = 'PUT';
            url = `${API_BASE_URL}/project/${projectId}`;
        }

        const formData = new FormData();
        formData.append('project_name', projectName);

        response = await fetch(url, {
            method: method,
            body: formData,
            credentials: 'include' // Include cookies
        });

        if (!response.ok) {
            const errorData = await response.json();
            showErrorModal(errorData.error || 'Failed to save project.');
            return;
        }

        closeProjectModal();
        fetchProjects(); // Refresh the project list
    } catch (error) {
        console.error('Error saving project:', error);
        showErrorModal('An unexpected error occurred while saving the project.');
    }
}

// Function to close the project modal
function closeProjectModal() {
    projectModal.style.display = 'none';
}

// Profile modal setup (remains the same)
function setupProfileModal() {
    const profileSection = document.getElementById('profileSection');
    const profileModal = document.getElementById('profileModal');
    const closeProfileModal = document.getElementById('closeProfileModal');
    const cancelProfileEdit = document.getElementById('cancelProfileEdit');
    const saveProfileChanges = document.getElementById('saveProfileChanges');
    const usernameDisplay = document.getElementById('username');
    const newUsernameInput = document.getElementById('newUsername');

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

document.addEventListener('DOMContentLoaded', function () {
    fetchProjects();
    setupProfileModal();
    setupProjectModal();

    addProjectBtn.addEventListener('click', openAddProjectModal);
    closeErrorModalBtn.addEventListener('click', closeErrorModal);
    window.addEventListener('click', function (event) {
        if (event.target === errorModal) {
            closeErrorModal();
        }
    });
});

function setupProjectModal() {
    closeProjectModalBtn.addEventListener('click', closeProjectModal);
    cancelProjectBtn.addEventListener('click', closeProjectModal);
    saveProjectBtn.addEventListener('click', saveProjectChanges);

    window.addEventListener('click', function (event) {
        if (event.target === projectModal) {
            closeProjectModal();
        }
    });
}