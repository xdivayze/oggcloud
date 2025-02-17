package user

import (
	"time"

	"github.com/google/uuid"
) 

type User struct {
	ID uuid.UUID `gorm:"type:uuid;primaryKey"`
	Email string `gorm:"unique"`
	PasswordHash *string
	EcdhSharedKey *string
	CreatedAt time.Time
	UpdatedAt time.Time
}

