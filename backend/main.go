package main

import (
	"fmt"
	"github.com/joho/godotenv"
	"log"
	"oggcloudserver/src"
	"oggcloudserver/src/oggcrypto"
	"os"
)

func LoadDotenv() error {
	return godotenv.Load()
}

func main() {
	defer os.Remove(oggcrypto.MASTERKEY_PATH)
	err := LoadDotenv()
	if err != nil {
		log.Fatal("Error loading .env file %w", err)
	}

	pguri := os.Getenv("POSTGRES_URI")
	fmt.Println(pguri)

	r := src.SetupRouter()

	dbl, err := src.GetDB()
	if err != nil {
		log.Fatalf("error occured while getting the database:\n\t%v", err)
	}

	fmt.Print("%w", dbl)
	r.Run(":5000")
}
