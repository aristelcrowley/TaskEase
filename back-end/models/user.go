package models

import "time"

type User struct {
    UserID    int       `gorm:"primaryKey;autoIncrement" json:"user_id"`
    Username  string    `gorm:"unique" json:"username"`
    Password  string    `json:"password"`
    IsAdmin   bool      `json:"is_admin"`
    CreatedAt time.Time `json:"created_at"`
}
