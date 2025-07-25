package login

import (
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

const JWT_COOKIE_EXPIRY_ACCESS_SECONDS = JWT_EXPIRY_MINS * 60
const JWT_COOKIE_EXPIRY_REFRESH_SECONDS = 7 * 24 * 60 * 60

const JWT_EXPIRY_MINS = 30

type TokenType string

const LOGIN_EMAIL_JSON_KEY = "eMail"
const LOGIN_PASSWORD_JSON_KEY = "passwordHash"

const (
	Access  TokenType = "access"
	Refresh TokenType = "refresh"
)

func generateJWT(mail string, tokenType TokenType, expSecs time.Duration) (string, error) {
	claims := jwt.MapClaims{
		"eMail":     mail,
		"tokenType": tokenType,
		"exp":       time.Now().Add(expSecs * time.Second).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	secret := []byte(os.Getenv("JWT_SECRET"))
	return token.SignedString(secret)
}
