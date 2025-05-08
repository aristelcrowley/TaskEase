package main

import (
    "log"

    "taskease/config"
    "taskease/database"
    "taskease/routes"

	 "github.com/gofiber/fiber/v2"
)

func main() {
    config.ENVLoad()
    app := fiber.New()

    database.ConnectDB()

    routes.SetupRoutes(app)

    log.Println("Server starting on port 3000")
    if err := app.Listen(":3000"); err != nil {
        log.Fatalf("Failed to start server: %v", err)
    }
}