package models
import "time"

type Task struct {
	TaskID      int       `json:"task_id"`
	ProjectID   int       `json:"project_id"`
	TaskName    string    `json:"task_name"`
	Status      string    `json:"status"`
	Deadline    time.Time `json:"deadline"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}