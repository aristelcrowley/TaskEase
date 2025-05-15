package routes

import (
    "taskease/controllers"
    "taskease/middlewares"

    "github.com/gofiber/fiber/v2"
)

func SetupRoutes(app *fiber.App) {
    app.Post("/register", controllers.Register)
    app.Post("/login", controllers.Login)

    protected := app.Group("/api", middlewares.VerifyToken())

	protected.Post("/logout", controllers.Logout)

    protected.Post("/project", controllers.CreateProject)
    protected.Get("/project", controllers.GetProjects)
    protected.Put("/project/:project_id", controllers.UpdateProject)
    protected.Delete("/project/:project_id", controllers.DeleteProject)
    protected.Get("/project/check-ownership/:project_id", controllers.CheckProjectOwnership)

	protected.Post("/task", controllers.CreateTask)
	protected.Get("/tasks/:project_id", controllers.GetTasks)
	protected.Get("/task/:task_id", controllers.GetTaskByID)
	protected.Put("/task/:task_id", controllers.UpdateTask)
	protected.Delete("/task/:task_id", controllers.DeleteTask)
	protected.Get("/history", controllers.GetTaskHistory)

    protected.Post("/subtask", controllers.CreateSubtask)
    protected.Get("/subtask/:task_id", controllers.GetSubtasks)
    protected.Put("/subtask/:subtask_id", controllers.UpdateSubtask)
    protected.Delete("/subtask/:subtask_id", controllers.DeleteSubtask)

    protected.Post("/note", controllers.CreateNote)
    protected.Get("/note", controllers.GetNotes)
    protected.Put("/note/:note_id", controllers.UpdateNote)
    protected.Delete("/note/:note_id", controllers.DeleteNote)

    admin := protected.Group("/user", middlewares.IsAdmin)
    admin.Post("/", controllers.CreateUser)
    admin.Get("/", controllers.GetUsers)
    admin.Put("/:id", controllers.UpdateUser)
    admin.Delete("/:id", controllers.DeleteUser)
}