package controllers

import (
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
	"taskease/database"
	"taskease/models"
)

func CreateSubtask(c *fiber.Ctx) error {
	userID := c.Locals("userID").(int)
	taskIDStr := c.FormValue("task_id")
	title := c.FormValue("title")

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
			"error": "You do not have permission to add a subtask to this task",
		})
	}

	if title == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Subtask title is required",
		})
	}

	subtask := models.Subtask{
		TaskID:    taskID,
		Title:     title,
		Status:    "Pending",
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	if err := database.DB.Create(&subtask).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to create subtask",
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "Subtask created successfully",
		"subtask": subtask,
	})
}

func GetSubtasks(c *fiber.Ctx) error {
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
			"error": "You do not have permission to view subtasks of this task",
		})
	}

	var subtasks []models.Subtask
	if err := database.DB.Where("task_id = ?", taskID).Find(&subtasks).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to retrieve subtasks",
		})
	}

	if len(subtasks) == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "Theres no subtask for this task",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"subtasks": subtasks,
	})
}

func UpdateSubtask(c *fiber.Ctx) error {
	userID := c.Locals("userID").(int)
	subtaskIDStr := c.Params("subtask_id")

	subtaskID, err := strconv.Atoi(subtaskIDStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid subtask ID",
		})
	}

	var subtask models.Subtask
	if err := database.DB.First(&subtask, "id = ?", subtaskID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Subtask not found",
		})
	}

	var task models.Task
	if err := database.DB.First(&task, "task_id = ?", subtask.TaskID).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch task",
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
			"error": "You do not have permission to update this subtask",
		})
	}

	title := c.FormValue("title")
	status := c.FormValue("status")

	if title != "" {
		subtask.Title = title
	}
	if status != "" {
		if status != "Pending" && status != "Completed" {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Status must be either 'Pending' or 'Completed'",
			})
		}
		subtask.Status = status
	}

	subtask.UpdatedAt = time.Now()

	if err := database.DB.Save(&subtask).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to update subtask",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"subtask": subtask,
	})
}

func DeleteSubtask(c *fiber.Ctx) error {
	userID := c.Locals("userID").(int)
	subtaskIDStr := c.Params("subtask_id")

	subtaskID, err := strconv.Atoi(subtaskIDStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid subtask ID",
		})
	}

	var subtask models.Subtask
	if err := database.DB.First(&subtask, "id = ?", subtaskID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Subtask not found",
		})
	}

	var task models.Task
	if err := database.DB.First(&task, "task_id = ?", subtask.TaskID).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch task",
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
			"error": "You do not have permission to delete this subtask",
		})
	}

	if err := database.DB.Delete(&subtask).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to delete subtask",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Subtask deleted successfully",
	})
}
