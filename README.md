# TaskEase - Task Management Website 

## Overview

TaskEase is a straightforward web application designed to help you manage your projects, keep track of notes, and review your task history. It provides a clean and intuitive interface to organize your workflow.


## Features

* **Project Management:** Organize your tasks within different projects.
* **Note Taking:** Jot down important ideas and information in a dedicated notes section.
* **Task History:** Review a log of your completed tasks, organized by month and year.
* **User Authentication:** Secure your data with user login and registration.


## Technologies Used

**Frontend:**

* HTML: For structuring the web pages.
* CSS: For styling the user interface.
* JavaScript: For client-side logic, handling user interactions, and making API calls.
* Express: Used as a frontend server to serve static files and handle routing..

**Backend:**

* Go: The programming language used for the backend.
* Fiber: A fast and expressive web framework for Go.


## Prerequisites

* Javascript
* Go
* Mysql


## Setup and Installation

To run TaskEase locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/aristelcrowley/TaskEase
    cd TaskEase
    ```

2. **Run your databaser server**
   
4. **Import "taskease.sql" from back-end/database/taskease.sql to your database**
    
5.  **Open terminal and navigate to the frontend directory:**
    ```bash
    cd front-end
    ```

6.  **Install frontend dependencies:**
    ```bash
    npm install
    ```

7.  **Configure frontend environment variables:**
    Create a `.env` file in your front-end directory then include this:
    ```bash
    API_BASE_URL=http://localhost:your_backend_port
    JWT_SECRET_KEY=your_preferred_secret_key (same in the back-end)
    ```

8.  **Run the frontend server:**
    ```bash
    node js/serverjs
    ```

9.  **Open new terminal and navigate to the backend directory:**
    ```bash
    cd back-end
    ```

10. **Install backend dependencies:**
    ```bash
    go mod tidy
    ```

11. **Configure backend environment variables:**
    Create a `.env` file in your back-end directory then include this:
    ```bash
    CB_USER=your_username
    DB_PASSWORD=your_password
    DB_NAME=your_imported_database_name
    DB_HOST=localhost
    DB_PORT=your_database_port
    BE_SERVER_PORT=your_backend_port
    FE_SERVER_PORT=your_frontend_port
    JWT_SECRET_KEY=your_preferred_secret_key (same in the front-end)
     ```

12. **Run the backend server:**
    ```bash
    go run main.go
    ```
    
13. **Open browser and navigate to the frontend server:**
    ```bash
    http://localhost:your_frontend_port
    ```


## API Endpoints 
Protected API (Requires JWT Token) starts with /api.


**Authentication:**

* `POST /register`: Register a new user.
* `POST /login`: Log in an existing user.
* `POST /api/logout`: Log out the current user (clear the token).

**User:**

* `GET /api/user`: Get the username of the currently logged-in user.

**Projects:**

* `POST /api/project`: Create a new project.
* `GET /api/project`: Get all projects belonging to the logged-in user.
* `PUT /api/project/:project_id`: Update an existing project.
* `DELETE /api/project/:project_id`: Delete an existing project.
* `GET /api/project/check-ownership/:project_id`: Check if the logged-in user owns the specific project when accessing /api/task.

**Tasks:**

* `POST /api/task`: Create a new task within a project.
* `GET /api/tasks/:project_id`: Get all tasks belonging to a specific project.
* `GET /api/task/:task_id`: Get a specific task by its ID.
* `PUT /api/task/:task_id`: Update an existing task.
* `DELETE /api/task/:task_id`: Delete an existing task.
* `GET /api/history`: Get the task history for the logged-in user.

**Subtasks:**

* `POST /api/subtask`: Create a new subtask for a task.
* `GET /api/subtask/:task_id`: Get all subtasks belonging to a specific task.
* `PUT /api/subtask/:subtask_id`: Update an existing subtask.
* `DELETE /api/subtask/:subtask_id`: Delete an existing subtask.

**Notes:**

* `POST /api/note`: Create a new note for the logged-in user.
* `GET /api/note`: Get all notes belonging to the logged-in user.
* `PUT /api/note/:note_id`: Update an existing note.
* `DELETE /api/note/:note_id`: Delete an existing note.


##  Software Testing (Postman)
> https://documenter.getpostman.com/view/40551639/2sB2qWGPti
