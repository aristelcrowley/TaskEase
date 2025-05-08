package models

import "time"

type Subtask struct {
    ID        uint      `gorm:"primaryKey;autoIncrement" json:"id"`
    Title     string    `json:"title"`
    Status    string    `json:"status"`
    TaskID    uint      `json:"task_id"`
    CreatedAt time.Time `json:"created_at"`
    UpdatedAt time.Time `json:"updated_at"`
}