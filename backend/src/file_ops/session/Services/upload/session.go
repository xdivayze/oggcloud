package upload

import (
	"fmt"
	"oggcloudserver/src/db"
	"oggcloudserver/src/file_ops/file"
	"strings"
	"time"

	"github.com/google/uuid"
)

const COMPRESSION_ALG = "gzip"

type Session struct {
	ID         uuid.UUID `gorm:"type:uuid;primaryKey"`
	SessionChecksum string
	SessionKey string
	FileNumber int
	Files      []file.File `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL"`
	UserID     uuid.UUID
	CreatedAt  time.Time
	UpdatedAt  time.Time
}

func (s *Session) FindOwnedFileWithName(name string) (*file.File, error) {
	var files []file.File
	if err := db.DB.Model(s).Association("Files").Find(&files) ; err != nil {
		return nil, fmt.Errorf("error occured while finding associations:\n\t%w", err)
	}
	for _, f := range files {
		destroyedFileName0 := strings.Split(f.FileName, ".")
		destroyedFileName := strings.Split( destroyedFileName0[0], "_")[0]
		dbName := fmt.Sprintf("%s.%s", destroyedFileName, destroyedFileName0[1])
		if dbName == name {
			return &f, nil
		}
	}
	return nil, nil
}
