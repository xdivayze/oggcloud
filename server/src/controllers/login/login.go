package login

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/xdivayze/oggcloud/src/db"
	"github.com/xdivayze/oggcloud/src/models/user"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
	"time"
)

type LoginRequest struct {
	EMail        string `json:"eMail" binding:"required"`
	PasswordHash string `json:"passwordHash" binding:"required"`
}

func HandleLogin(c *gin.Context) {
	var body LoginRequest
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}
	foundUser, err := user.GetUserFromEMail(body.EMail, db.DB)

	if err != nil { //fail if no user is found or error occurs
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "user with specified email not found"})

		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "error occurred while fetching user from database"})

		}
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(foundUser.BCryptPassword), []byte(body.PasswordHash)); err != nil {
		if errors.Is(err, bcrypt.ErrMismatchedHashAndPassword) {
			c.Status(http.StatusUnauthorized)
		} else {
			c.Status(http.StatusInternalServerError)
		}
		return

	}

	jwtStringAccess, err := generateJWT(body.EMail, Access, time.Duration(JWT_COOKIE_EXPIRY_ACCESS_SECONDS))

	if err != nil {
		c.Status(http.StatusInternalServerError)
		return
	}

	jwtStringRefresh, err := generateJWT(body.EMail, Refresh, time.Duration(JWT_COOKIE_EXPIRY_REFRESH_SECONDS))
	if err != nil {
		c.Status(http.StatusInternalServerError)
		return
	}

	c.SetCookie("jwt_token", jwtStringAccess, JWT_COOKIE_EXPIRY_ACCESS_SECONDS, "/", "", true, true) //TODO change to domain name

	c.SetCookie("jwt_token_refresh", jwtStringRefresh, JWT_COOKIE_EXPIRY_REFRESH_SECONDS, "/", "", true, true) //TODO change to domain name

	c.Status(http.StatusOK)
}
