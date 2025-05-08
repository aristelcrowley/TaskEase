package database

import (
    "fmt"
    "os"

    "gorm.io/driver/mysql"
    "gorm.io/gorm"
    "github.com/joho/godotenv"
)

var DB *gorm.DB

func ConnectDB() error {
    err := godotenv.Load()
    if err != nil {
        return fmt.Errorf("Error loading .env file: %v", err)
    }

    dsn := fmt.Sprintf("%s:%s@tcp(%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
        os.Getenv("DB_USER"),
        os.Getenv("DB_PASSWORD"),
        os.Getenv("DB_HOST"),
        os.Getenv("DB_NAME"))

    var errConnect error
    DB, errConnect = gorm.Open(mysql.Open(dsn), &gorm.Config{})
    if errConnect != nil {
        return fmt.Errorf("Error connecting to the database: %v", errConnect)
    }

    return nil
}
