package main

import (
    "taskease/config"
    "taskease/database"
    "taskease/routes"

	 "github.com/gofiber/fiber/v2"
)

func main() {
    config.ENVLoad()
    app := fiber.New()

    database.ConnectDB()
    database.MigrateDB()

    routes.SetupRoutes(app)
    
    app.Listen(":3000")
}