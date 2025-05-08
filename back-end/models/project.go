package models

import "time"

type Project struct {
	ProjectID   int       `json:"project_id"`
	UserID      int       `json:"user_id"`
	ProjectName string    `json:"project_name"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}