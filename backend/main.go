package main

import (
	"fmt"
	"log"
	"oggcloudserver/src"
	"oggcloudserver/src/oggcrypto"
	"os"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	defer os.Remove(oggcrypto.MASTERKEY_PATH)
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file %w", err)
	}

	pguri := os.Getenv("POSTGRES_URI")
	fmt.Println(pguri)

	r := gin.Default()

	dbl, _ := src.GetDB()
	fmt.Print("%w", dbl)
	

	r.Run(":5000")
}