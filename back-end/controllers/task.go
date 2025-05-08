package controllers

import (
	"strconv"
	"time"

	"taskease/database"
	"taskease/models"

	"github.com/gofiber/fiber/v2"
)

func CreateTask(c *fiber.Ctx) error {
	userID := c.Locals("userID").(int)

	projectIDStr := c.FormValue("project_id")
	taskName := c.FormValue("task_name")
	deadlineStr := c.FormValue("deadline")
	
	projectID, err := strconv.Atoi(projectIDStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid project ID",
		})
	}

	var project models.Project
	if err := database.DB.First(&project, "project_id = ?", projectID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Project not found",
		})
	}
	if project.UserID != userID {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"error": "You do not have permission to add a task to this project",
		})
	}

	deadline, err := time.Parse("2006-01-02", deadlineStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid deadline format. Use YYYY-MM-DD",
		})
	}

	if taskName == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Task name is required",
		})
	}


	task := models.Task{
		ProjectID: projectID,
		TaskName:  taskName,
		Status:    "Pending",
		Deadline:  deadline,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	if err := database.DB.Create(&task).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to create task",
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "Task created successfully",
		"task":    task,
	})
}

func GetTasks(c *fiber.Ctx) error {
	userID := c.Locals("userID").(int)

	projectIDStr := c.Params("project_id")
	projectID, err := strconv.Atoi(projectIDStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid project ID",
		})
	}

	var project models.Project
	if err := database.DB.First(&project, "project_id = ?", projectID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Project not found",
		})
	}
	if project.UserID != userID {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"error": "You do not have permission to view tasks for this project",
		})
	}

	var tasks []models.Task
	if err := database.DB.Where("project_id = ? AND status = ?", projectID, "Pending").Find(&tasks).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to retrieve tasks",
		})
	}

	if len(tasks) == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "Task tidak tersedia",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"tasks": tasks,
	})
}

func GetTaskByID(c *fiber.Ctx) error {
	userID := c.Locals("userID").(int)
	taskIDStr := c.Params("task_id")

	taskID, err := strconv.Atoi(taskIDStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid task ID",
		})
	}

	var task models.Task
	if err := database.DB.First(&task, "task_id = ?", taskID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Task not found",
		})
	}

	var project models.Project
	if err := database.DB.First(&project, "project_id = ?", task.ProjectID).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to retrieve project",
		})
	}

	if project.UserID != userID {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"error": "You do not have permission to view this task",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"task": task,
	})
}


func UpdateTask(c *fiber.Ctx) error {
	userID := c.Locals("userID").(int)
	taskIDStr := c.Params("task_id")

	taskID, err := strconv.Atoi(taskIDStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid task ID",
		})
	}

	var task models.Task
	if err := database.DB.First(&task, "task_id = ?", taskID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Task not found",
		})
	}

	var project models.Project
	if err := database.DB.First(&project, "project_id = ?", task.ProjectID).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch project",
		})
	}
	if project.UserID != userID {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"error": "You do not have permission to update this task",
		})
	}

	taskName := c.FormValue("task_name")
	status := c.FormValue("status")
	deadlineStr := c.FormValue("deadline")

	if taskName != "" {
		task.TaskName = taskName
	}
	if status != "" {
		if status != "Pending" && status != "Completed" {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Status must be either 'Pending' or 'Completed'",
			})
		}
		task.Status = status
	}
	if deadlineStr != "" {
		deadline, err := time.Parse("2006-01-02", deadlineStr)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Invalid deadline format. Use YYYY-MM-DD",
			})
		}
		task.Deadline = deadline
	}

	task.UpdatedAt = time.Now()

	if err := database.DB.Save(&task).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to update task",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"task": task,
	})
}


func DeleteTask(c *fiber.Ctx) error {
	userID := c.Locals("userID").(int)
	taskIDStr := c.Params("task_id")

	taskID, err := strconv.Atoi(taskIDStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid task ID",
		})
	}

	var task models.Task
	if err := database.DB.First(&task, "task_id = ?", taskID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Task not found",
		})
	}

	var project models.Project
	if err := database.DB.First(&project, "project_id = ?", task.ProjectID).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch project",
		})
	}
	if project.UserID != userID {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"error": "You do not have permission to delete this task",
		})
	}

	if err := database.DB.Delete(&task).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to delete task",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Task deleted successfully",
	})
}

func GetTaskHistory(c *fiber.Ctx) error {
	userID := c.Locals("userID").(int)

	var tasks []models.Task
	if err := database.DB.Joins("JOIN projects ON tasks.project_id = projects.project_id").
		Where("projects.user_id = ? AND tasks.status = ?", userID, "Completed").
		Order("tasks.updated_at DESC").
		Find(&tasks).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to retrieve task history",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"history": tasks,
	})
}
