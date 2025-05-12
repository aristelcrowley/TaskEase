package main

import (
    "os"

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

    port := os.Getenv("SERVER_PORT")
	app.Listen(":"+port)
}