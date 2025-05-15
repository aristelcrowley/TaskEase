const API_BASE_URL = 'http://localhost:8080/api';
const notesContainer = document.querySelector('.notes-container');
const addNoteBtn = document.getElementById('add-note-btn');
const noteModal = document.getElementById('note-modal');
const closeNoteModal = document.getElementById('close-note-modal');
const cancelNoteBtn = document.getElementById('cancel-note');
const saveNoteBtn = document.getElementById('save-note');

const editNoteModal = document.getElementById('edit-note-modal');
const closeEditNoteModal = document.getElementById('close-edit-note-modal');
const cancelEditNoteBtn = document.getElementById('cancel-edit-note');
const updateNoteBtn = document.getElementById('update-note');
const editNoteTitleInput = document.getElementById('edit-note-title');
const editNoteContentInput = document.getElementById('edit-note-content');

const profileBtn = document.getElementById('profileBtn');
const profileModal = document.getElementById('profileModal');
const closeProfileModal = document.getElementById('closeProfileModal');
const cancelProfileEditBtn = document.getElementById('cancelProfileEdit');
const saveProfileChangesBtn = document.getElementById('saveProfileChanges');
const usernameDisplay = document.getElementById('username');
const newUsernameInput = document.getElementById('newUsername');

let currentEditNoteId = null;

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

async function fetchNotes() {
    try {
        const response = await fetch(`${API_BASE_URL}/note`, {
            headers: {
                'Authorization': `Bearer ${getCookie('token')}`,
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Failed to fetch notes:', response.status, errorData);
            notesContainer.innerHTML = `<p class="error-message">Failed to load notes: ${errorData.error || 'Unknown error'}</p>`;
            return;
        }
        const data = await response.json();
        console.log("API Response (Notes):", data.notes); // Log the response
        renderNotes(data.notes);
    } catch (error) {
        console.error('Error fetching notes:', error);
        notesContainer.innerHTML = '<p class="error-message">Error loading notes.</p>';
    }
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

function createNoteElement(note) {
    const noteCard = document.createElement('div');
    noteCard.classList.add('note-card');
    noteCard.dataset.noteId = note.note_id; // Use note.note_id

    noteCard.innerHTML = `
        <div class="note-header">
            <h3>${note.note_name || 'Untitled'}</h3>
            <div class="note-actions">
                <button class="edit-note-btn" data-note-id="${note.note_id}" data-note-name="${note.note_name}" data-note-desc="${note.note_desc}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="delete-note-btn" data-note-id="${note.note_id}">
                    <i class="fas fa-trash note-delete"></i>
                </button>
            </div>
        </div>
        <p class="note-content">${note.note_desc || ''}</p>
        <div class="note-footer">Created on ${new Date(note.created_at).toLocaleDateString()}</div>
    `;
    return noteCard;
}

function renderNotes(notes) {
    notesContainer.innerHTML = '';
    notes.forEach(note => {
        notesContainer.appendChild(createNoteElement(note));
    });

    // Add event listeners after rendering (event delegation)
    notesContainer.querySelectorAll('.delete-note-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const noteId = this.getAttribute('data-note-id');
            deleteNote(noteId);
        });
    });

    notesContainer.querySelectorAll('.edit-note-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const noteId = this.getAttribute('data-note-id');
            const noteName = this.getAttribute('data-note-name');
            const noteDesc = this.getAttribute('data-note-desc');
            openEditNoteModal({ NoteID: noteId, NoteName: noteName, NoteDesc: noteDesc });
        });
    });
}

addNoteBtn.addEventListener('click', () => {
    noteModal.style.display = 'block';
    document.querySelector('#note-modal .modal-title').textContent = 'Add New Note';
    document.getElementById('note-title').value = '';
    document.getElementById('note-content').value = '';
    saveNoteBtn.onclick = saveNewNote;
});

async function saveNewNote() {
    const title = document.getElementById('note-title').value.trim();
    const content = document.getElementById('note-content').value.trim();

    if (title || content) {
        try {
            const formData = new FormData();
            formData.append('note_name', title || 'Untitled');
            formData.append('note_desc', content || '');

            const response = await fetch(`${API_BASE_URL}/note`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${getCookie('token')}`
                },
                body: formData,
                credentials: 'include'
            });

            if (response.ok) {
                noteModal.style.display = 'none';
                await fetchNotes(); // Reload notes
            } else {
                const error = await response.json();
                console.error('Failed to create note:', error);
                alert(`Failed to create note: ${error.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error creating note:', error);
            alert('Error creating note.');
        }
    } else {
        alert('Please enter a title or content for your note.');
    }
}

function openEditNoteModal(note) {
    currentEditNoteId = note.NoteID;
    console.log("Opening edit modal for note ID:", currentEditNoteId); // <--- ADD THIS LINE
    editNoteTitleInput.value = note.NoteName || '';
    editNoteContentInput.value = note.NoteDesc || '';
    editNoteModal.style.display = 'block';
    document.querySelector('#edit-note-modal .modal-title').textContent = 'Edit Note';
}

async function updateNote() {
    const title = editNoteTitleInput.value.trim();
    const content = editNoteContentInput.value.trim();

    if (title || content) {
        try {
            const formData = new FormData();
            formData.append('note_name', title || 'Untitled');
            formData.append('note_desc', content || '');

            const response = await fetch(`${API_BASE_URL}/note/${currentEditNoteId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${getCookie('token')}`
                },
                body: formData,
                credentials: 'include'
            });

            if (response.ok) {
                editNoteModal.style.display = 'none';
                await fetchNotes(); // Reload notes
                currentEditNoteId = null;
            } else {
                const error = await response.json();
                console.error('Failed to update note:', error);
                alert(`Failed to update note: ${error.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error updating note:', error);
            alert('Error updating note.');
        }
    } else {
        alert('Please enter a title or content for your note.');
    }
}

async function deleteNote(noteId) {
    if (confirm('Are you sure you want to delete this note?')) {
        try {
            const response = await fetch(`${API_BASE_URL}/note/${noteId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${getCookie('token')}`
                },
                credentials: 'include'
            });

            if (response.ok) {
                await fetchNotes(); // Reload notes
            } else {
                const error = await response.json();
                console.error('Failed to delete note:', error);
                alert(`Failed to delete note: ${error.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error deleting note:', error);
            alert('Error deleting note.');
        }
    }
}

closeNoteModal.addEventListener('click', () => {
    noteModal.style.display = 'none';
});

cancelNoteBtn.addEventListener('click', () => {
    noteModal.style.display = 'none';
});

closeEditNoteModal.addEventListener('click', () => {
    editNoteModal.style.display = 'none';
    currentEditNoteId = null;
});

cancelEditNoteBtn.addEventListener('click', () => {
    editNoteModal.style.display = 'none';
    currentEditNoteId = null;
});

updateNoteBtn.addEventListener('click', updateNote);

window.addEventListener('click', (event) => {
    if (event.target === noteModal) {
        noteModal.style.display = 'none';
    }
    if (event.target === editNoteModal) {
        editNoteModal.style.display = 'none';
        currentEditNoteId = null;
    }
    if (event.target === profileModal) {
        profileModal.style.display = 'none';
    }
});

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

    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) {
        logoutLink.addEventListener('click', function(event) {
            event.preventDefault(); // 
            document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; 
            window.location.href = '/'; 
        });
    }

    fetchNotes();
    fetchUsername();
});