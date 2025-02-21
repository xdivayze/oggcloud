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
	CreatedAt  time.Time
	UpdatedAt  time.Time
	UserID uuid.UUID
	FileType   *string
	Checksum   *string
	HasPreview bool
	IsPreview  bool
	PreviewID  *uuid.UUID `gorm:"index"`
	Preview    *File      `gorm:"foreignKey:PreviewID"`
}
