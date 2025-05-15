package models

import "time"

type Note struct {
	NoteID    int       `gorm:"primaryKey" json:"note_id"`
	UserID    int       `json:"user_id"`
	NoteName  string    `json:"note_name"`
	NoteDesc  string    `json:"note_desc"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
