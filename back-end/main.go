package main

import (
    "taskease/config"
    "taskease/database"

	 "github.com/gofiber/fiber/v2"
)

func main() {
    config.ENVLoad()
    app := fiber.New()

    database.ConnectDB()
    database.MigrateDB()

    app.Listen(":3000")
}