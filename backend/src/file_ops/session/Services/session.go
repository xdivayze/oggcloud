package services

import (
	"oggcloudserver/src/file_ops/file"
	"time"

	"github.com/google/uuid"
)

const COMPRESSION_ALG = "gzip"

type Session struct {
	ID         uuid.UUID `gorm:"type:uuid;primaryKey"`
	SessionKey string
	FileNumber int
	Files      []file.File `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL"`
	UserID     uuid.UUID
	CreatedAt  time.Time
	UpdatedAt  time.Time
}
