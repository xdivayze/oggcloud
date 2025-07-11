package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/xdivayze/oggcloud/src/db"
)

var PORT uint = 8080

//this web server is REST only, web page may be served later as a secondary objective

func main() {
	if err := godotenv.Load(); err != nil {
		log.Fatalf("error occured while loading dotenv file:\n\t%v\n", err)
	}

	if err := db.ConnectDB(); err != nil {
		log.Fatalf("error occurred while connecting to db: \n\t%v", err)
	}

	r := gin.Default()
	//TODO register routes function

	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGKILL, syscall.SIGTERM)
	defer stop()

	srv := &http.Server{
		Addr:    fmt.Sprintf(":%d", PORT),
		Handler: r,
	}

	go func() {
		log.Printf("Starting server on port %d...\n", PORT)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Error starting server: %v\n", err)
		}
	}()

	<-ctx.Done() // Wait for shutdown signal
	log.Println("Received shutdown signal, shutting down server...")

	if err := srv.Shutdown(context.Background()); err != nil { // Gracefully shutdown the server
		log.Fatalf("Error shutting down server: %v\n", err)
	}

	log.Println("Server shut down gracefully")
	if os.Getenv("DEV") == "true" {
		// Drop tables only in development mode
		log.Println("Dropping tables...")
		db.DB.Migrator().DropTable(db.TABLES...)
	}
	log.Println("Database connection closed")

}
