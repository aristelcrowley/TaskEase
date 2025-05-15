package controllers

import (
	"strconv"
	"time"

	"taskease/database"
	"taskease/models"

	"github.com/gofiber/fiber/v2"
)

func CreateNote(c *fiber.Ctx) error {
	userID := c.Locals("user_id").(int)

	noteName := c.FormValue("note_name")
	noteDesc := c.FormValue("note_desc")

	if noteName == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Note name is required",
		})
	}

	note := models.Note{
		UserID:    userID,
		NoteName:  noteName,
		NoteDesc:  noteDesc,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	if err := database.DB.Create(&note).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to create note",
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "Note created successfully",
		"note":    note,
	})
}

func GetNotes(c *fiber.Ctx) error {
	tokenUserID := c.Locals("user_id").(int)

	var notes []models.Note
	if err := database.DB.Where("user_id = ?", tokenUserID).Find(&notes).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to retrieve notes",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"notes": notes,
	})
}

func GetNoteByID(c *fiber.Ctx) error {
	tokenUserID := c.Locals("user_id").(int)

	noteIDStr := c.Params("note_id")
	noteID, err := strconv.Atoi(noteIDStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid note ID",
		})
	}

	var note models.Note
	if err := database.DB.Where("note_id = ? AND user_id = ?", noteID, tokenUserID).First(&note).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Note not found or does not belong to you",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"note": note,
	})
}

func UpdateNote(c *fiber.Ctx) error {
	tokenUserID := c.Locals("user_id").(int)

	noteIDStr := c.Params("note_id")
	noteID, err := strconv.Atoi(noteIDStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid note ID",
		})
	}

	var note models.Note
	if err := database.DB.Where("note_id = ? AND user_id = ?", noteID, tokenUserID).First(&note).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Note not found or does not belong to you",
		})
	}

	noteName := c.FormValue("note_name")
	noteDesc := c.FormValue("note_desc")

	if noteName != "" {
		note.NoteName = noteName
	}
	if noteDesc != "" {
		note.NoteDesc = noteDesc
	}

	note.UpdatedAt = time.Now()

	if err := database.DB.Save(&note).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to update note",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Note updated successfully",
		"note":    note,
	})
}

func DeleteNote(c *fiber.Ctx) error {
	tokenUserID := c.Locals("user_id").(int)

	noteIDStr := c.Params("note_id")
	noteID, err := strconv.Atoi(noteIDStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid note ID",
		})
	}

	var note models.Note
	if err := database.DB.Where("note_id = ? AND user_id = ?", noteID, tokenUserID).First(&note).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Note not found or does not belong to you",
		})
	}

	if err := database.DB.Delete(&note).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to delete note",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Note deleted successfully",
	})
}