package file

import (
	"time"

	"github.com/google/uuid"
)

type File struct {
	ID         uuid.UUID `gorm:"type:uuid;primaryKey"`
	FileName   string
	Size       int64
	SessionID  uuid.UUID
	IndexNo 	int
	CreatedAt  time.Time
	UpdatedAt  time.Time
	Checksum   string
	HasPreview bool
	IsPreview bool
	PreviewID  *uuid.UUID `gorm:"index"`
	Preview    *File      `gorm:"foreignKey:PreviewID"`
}
