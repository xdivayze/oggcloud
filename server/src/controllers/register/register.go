package register

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/xdivayze/oggcloud/src/db"
	"github.com/xdivayze/oggcloud/src/models/user"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type RegisterRequest struct {
	EMail        string `json:"eMail" binding:"required"`
	PasswordHash string `json:"passwordHash" binding:"required"`
}

func HandleRegister(c *gin.Context) {
	var jsonData RegisterRequest
	if err := c.ShouldBindJSON(&jsonData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}

	foundUser, err := user.GetUserFromEMail(jsonData.EMail, db.DB)
	if err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) { // if error is not due to not found user, fail
			c.JSON(http.StatusConflict, gin.H{"error": "user with same e-mail already exists"})
			return
		}
	}
	if foundUser != nil { //if a user is found, fail
		c.JSON(http.StatusConflict, gin.H{"error": "user with same e-mail already exists"})
		return
	}
	passwordBcrypt, err := bcrypt.GenerateFromPassword([]byte(jsonData.PasswordHash), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "error occured while processing password"})
		return
	}
	createdUser := user.User{
		BCryptPassword: string(passwordBcrypt),
		EMail:          jsonData.EMail,
	}
	if err := createdUser.Save(db.DB); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "error occurred while saving user to database"})
		return
	}
	c.Status(http.StatusOK)

}
