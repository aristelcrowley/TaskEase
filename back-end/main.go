package main

import (
    "taskease/config"

	 "github.com/gofiber/fiber/v2"
)

func main() {
    config.ENVLoad()
    app := fiber.New()

    app.Listen(":3000")
}