package src

import (
	"oggcloudserver/src/db"

	"gorm.io/gorm"
)

func GetDB() (*gorm.DB, error) {
	db.Create_DB()
	return db.DB, nil
}
