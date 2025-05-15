package controllers

import (
	"taskease/database"
	"taskease/models"

	"github.com/gofiber/fiber/v2"
)

func GetUserByID(c *fiber.Ctx) error {
	userID := c.Locals("user_id").(int)

	var user models.User 

	if err := database.DB.First(&user, "user_id = ?", userID).Error; err != nil { 
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "User not found",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"username": user.Username,
	})
}