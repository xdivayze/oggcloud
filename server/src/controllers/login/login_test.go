package login

import (
	"bytes"
	"encoding/json"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/require"
	"github.com/xdivayze/oggcloud/src/db"
	"github.com/xdivayze/oggcloud/src/models/user"
	"golang.org/x/crypto/bcrypt"
)

func TestLogin(t *testing.T) {
	require := require.New(t)
	require.Nil(db.TestDB(), "Failed to create require instance")
	defer db.DB.Migrator().DropTable(db.TABLES...)

	router := gin.Default()
	router.POST("/login", func(c *gin.Context) {
		HandleLogin(c)
	})

	passwd := "hi mate"
	email := "duckduckgo"

	bcryptPassword, err := bcrypt.GenerateFromPassword([]byte(passwd), bcrypt.DefaultCost)

	require.Nil(err, "error occurred while generating mock user bcrypt")

	mockUser := user.User{
		BCryptPassword: string(bcryptPassword),
		EMail:          email,
	}

	require.Nil(mockUser.Save(db.DB), "error occurred while trying to save mock user")

	body, err := json.Marshal(map[string]string{
		LOGIN_EMAIL_JSON_KEY:    email,
		LOGIN_PASSWORD_JSON_KEY: passwd,
	})
	require.Nil(err, "error marshalling request body")

	req := httptest.NewRequest("POST", "/login", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")

	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, req)

	require.Equal(200, resp.Code, "expected status code 200")

	cookies := resp.Header().Values("Set-Cookie")
	require.NotEmpty(cookies, "no cookies were set")

}
