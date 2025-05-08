package models

import "time"

type Subtask struct {
	ID        int       `json:"id"`
	TaskID    int       `json:"task_id"`
	Title     string    `json:"title"`
	Status    string    `json:"status"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}