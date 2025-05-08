package controllers

import (
	"os"
	"time"
	"taskease/database"
	"taskease/models"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v4"
)

func Register(c *fiber.Ctx) error {
	username := c.FormValue("username")
	password := c.FormValue("password")

	if username == "" || password == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Username and password are required",
		})
	}

	var existingUser models.User
	if err := database.DB.Where("username = ?", username).First(&existingUser).Error; err == nil {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{
			"error": "Username already taken",
		})
	}

	newUser := models.User{
		Username: username,
		Password: password,
		Role:     "user", 
	}

	if err := database.DB.Create(&newUser).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to register user",
		})
	}

	return c.JSON(fiber.Map{
		"message": "User registered successfully",
	})
}

func Login(c *fiber.Ctx) error {
	username := c.FormValue("username")
	password := c.FormValue("password")

	if username == "" || password == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Username and password are required",
		})
	}

	var user models.User
	if err := database.DB.Where("username = ? AND password = ?", username, password).First(&user).Error; err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid credentials",
		})
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub":  user.UserID,
		"role": user.Role,
		"exp":  time.Now().Add(time.Hour * 24).Unix(),
	})

	tokenString, err := token.SignedString([]byte(os.Getenv("JWT_SECRET_KEY")))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to generate token",
		})
	}

	return c.JSON(fiber.Map{
		"token": tokenString,
	})
}


func Logout(c *fiber.Ctx) error {
	return c.JSON(fiber.Map{
		"message": "Logged out successfully",
	})
}
