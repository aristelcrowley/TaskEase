package controllers

import (
	"strconv"
	"time"
	
	"taskease/database"
	"taskease/models"

	"github.com/gofiber/fiber/v2"
)

func CreateProject(c *fiber.Ctx) error {
	userID := c.Locals("user_id").(int)

	projectName := c.FormValue("project_name")

	if projectName == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Project name are required",
		})
	}

	project := models.Project{
		UserID:      userID,
		ProjectName: projectName,
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}

	if err := database.DB.Create(&project).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to create project",
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "Project created successfully",
		"project": project,
	})
}

func GetProjects(c *fiber.Ctx) error {
	tokenUserID := c.Locals("user_id").(int)

	var projects []models.Project
	if err := database.DB.Where("user_id = ?", tokenUserID).Find(&projects).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to retrieve projects",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"projects": projects,
	})
}

func UpdateProject(c *fiber.Ctx) error {
	tokenUserID := c.Locals("user_id").(int)

	projectIDStr := c.Params("project_id")
	projectID, err := strconv.Atoi(projectIDStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid project ID",
		})
	}

	var project models.Project
	if err := database.DB.Where("project_id = ?", projectID).First(&project).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Project not found",
		})
	}

	if tokenUserID != project.UserID {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"error": "You do not have permission to update this project",
		})
	}

	projectName := c.FormValue("project_name")
	if projectName != "" {
		project.ProjectName = projectName
	}

	project.UpdatedAt = time.Now()

	if err := database.DB.Save(&project).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to update project",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"project": project,
	})
}

func DeleteProject(c *fiber.Ctx) error {
	tokenUserID := c.Locals("user_id").(int)

	projectIDStr := c.Params("project_id")
	projectID, err := strconv.Atoi(projectIDStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid project ID",
		})
	}

	var project models.Project
	if err := database.DB.Where("project_id = ?", projectID).First(&project).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Project not found",
		})
	}

	if tokenUserID != project.UserID {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"error": "You do not have permission to delete this project",
		})
	}

	if err := database.DB.Delete(&project).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to delete project",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Project deleted successfully",
	})
}