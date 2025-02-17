package db

import (
	"fmt"
	"log"
	"os"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

func Create_DB() {
	dsn := os.Getenv("POSTGRES_URI")
	fmt.Println(dsn)
	var err error
	DB, err = setupDatabase(dsn)
	if err != nil {
		log.Fatal("%w", err)
	}
}

func setupDatabase(dsn string) (*gorm.DB, error) {
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		return nil, fmt.Errorf("failed to connect to db %w", err)
	}

	return db, nil

}
