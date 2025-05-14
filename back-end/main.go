package main

import (
    "os"

    "taskease/config"
    "taskease/database"
    "taskease/routes"

	 "github.com/gofiber/fiber/v2"
     "github.com/gofiber/fiber/v2/middleware/cors"
)

func main() {
    config.ENVLoad()
    database.ConnectDB()

    app := fiber.New()

    feport := os.Getenv("FE_SERVER_PORT")
    app.Use(cors.New(cors.Config{
		AllowOrigins:     "http://localhost:" + feport,
        AllowHeaders:     "Origin, Content-Type, Accept",
        AllowCredentials: true,  
        AllowMethods:     "GET,POST,HEAD,PUT,DELETE,PATCH,OPTIONS",  
	}))

    routes.SetupRoutes(app)

    beport := os.Getenv("BE_SERVER_PORT")
	app.Listen(":"+beport)
}