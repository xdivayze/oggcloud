package db

import (
	"fmt"
	"os"

	"log"

	"github.com/xdivayze/oggcloud/src/models/user"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

var TABLES = []any{ //list of db models to auto migrate

	&user.User{},
}

func ConnectDB() error {
	host := os.Getenv("DB_HOST")
	port := os.Getenv("DB_PORT")
	user := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASSWORD")
	dbname := os.Getenv("DB_NAME")

	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
		host, user, password, dbname, port)

	db, err := gorm.Open(postgres.Open(dsn))
	if err != nil {
		return fmt.Errorf("Error occurred while connecting to postgres:\n\t%w\n", err)
	}

	DB = db
	log.Println("DB connection established")

	//db configs
	if os.Getenv("DEV") == "true" { //drop tables at the start to ease load on dev environment
		DB.Migrator().DropTable(TABLES...)
		log.Println("Dropping tables in development mode")
	}
	DB.AutoMigrate(TABLES...)
	//--
	return nil
}
