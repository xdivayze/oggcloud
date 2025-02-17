package routes

import (
	"encoding/hex"
	"fmt"
	"log"
	"net/http"
	"oggcloudserver/src/db"
	"oggcloudserver/src/functions"
	"oggcloudserver/src/user"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

//TODO password length check
//TODO email check
//TODO add more compertmantalization to tidy up the code maybe a controller directory and another subdirectory for each route

func RegisterUser(c *gin.Context) {
	log.SetPrefix("ERROR: ")
	var jsonData map[string]interface{}

	if err := c.ShouldBindJSON(&jsonData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("couldn't parse json\n\t:%v", err.Error())})
		return
	}

	mail, s := functions.FieldAssignment(c, "email", jsonData)
	if s != 0 {
		return
	}

	passwordhex, s := functions.FieldAssignment(c, "password", jsonData)
	if s != 0 {
		return
	}

	hexpass, err := hex.DecodeString(passwordhex)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "error occured registering user"})
		log.Printf("error occured while generating bytes from hex:\n\t%v\n", err)
		return
	}

	bcryptPass, err := bcrypt.GenerateFromPassword(hexpass, bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "error occured registering user"})
		log.Printf("error occured while generating bcrypt:\n\t%v\n", err)
		return
	}
	password := string(bcryptPass)

	ecdhclientpub, s := functions.FieldAssignment(c, "ecdh_public", jsonData)
	if s != 0 {
		return
	}
	sharedkey, serverpub, err := user.GenerateAndEncryptSharedKey(ecdhclientpub) //salt is prepended to sharedkey
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "error occured registering user"})
		log.Printf("error occured while generating and encrypting the shared key:\n\t%v\n", err)
		return
	}
	id := uuid.New()
	user := user.User{
		ID:            id,
		Email:         mail,
		PasswordHash:  &password,
		EcdhSharedKey: &sharedkey,
	}
	result := db.DB.Create(&user)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "error occured registering user"})
		log.Printf("error occured while registering user to database:\n\t%v\n", result.Error)
	}
	c.JSON(http.StatusCreated, gin.H{
		"id":                  id,
		"ServerECDHPublicKey": serverpub,
	})
	log.SetPrefix("INFO: ")
	log.Println("user created:\n", user.ToString())

}
