package model

import (
	services "oggcloudserver/src/file_ops/session/Services"
	"oggcloudserver/src/user/auth"
	"time"

	"github.com/google/uuid"
)

type User struct {
	ID                 uuid.UUID `gorm:"type:uuid;primaryKey"`
	Email              string    `gorm:"unique"`
	PasswordHash       *string
	EcdhSharedKey      *string
	AuthorizationCodes []auth.AuthorizationCode `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL"`
	Sessions           []services.Session       `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL"`
	CreatedAt          time.Time
	UpdatedAt          time.Time
}
