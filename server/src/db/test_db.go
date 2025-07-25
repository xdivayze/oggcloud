package db

import (
	"fmt"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func TestDB() error {
	//initialize sqlite in-memory database

	db, err := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	if err != nil {
		return fmt.Errorf("failed to connect to the database:\n\t %w\n", err)
	}
	// Migrate the schema
	err = db.AutoMigrate(TABLES...)
	if err != nil {
		return fmt.Errorf("failed to migrate the database schema:\n\t %w\n", err)
	}

	DB = db

	return nil

}
