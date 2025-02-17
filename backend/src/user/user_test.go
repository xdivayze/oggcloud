package user_test

import (
	"bytes"
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"oggcloudserver/src"
	"oggcloudserver/src/db"
	"oggcloudserver/src/oggcrypto"
	"oggcloudserver/src/user"
	"path/filepath"
	"runtime"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/joho/godotenv"
)

func TestRegisterUser(t *testing.T) {

	const examplemail string = "example@example.org"

	_, filename, _, _ := runtime.Caller(0)
	absfilepath, err := filepath.Abs(filename)
	if err != nil {
		t.Fatalf("error initializing package, couldn't get absolute file path:%v", err)
	}

	cwdir := filepath.Dir(absfilepath)

	dotenv_path := filepath.Join(cwdir, "../../.env")

	godotenv.Load(dotenv_path)
	if err != nil {
		t.Fatalf("Error loading .env file %v\n", err)
	}

	_, error := src.GetDB()
	if error != nil {
		t.Fatalf("error creating database:\n\t%v\n", err)
	}

	defer db.DB.Where("1 = 1").Delete(&user.User{})

	gin.SetMode(gin.TestMode)
	r := src.SetupRouter()
	w := httptest.NewRecorder()

	randomBytes := make([]byte, 60)
	_, err = rand.Read(randomBytes)
	if err != nil {
		t.Fatalf("error reading from random buffer:\n\t%v\n", err)
	}
	randomString := hex.EncodeToString(randomBytes)

	_, tp, err := oggcrypto.GenerateECDHPair()
	if err != nil {
		t.Fatalf("error generating ecdh pair:\n\t:%v\n", err)
	}
	pemBlock, err := oggcrypto.EncodePublicKeyToPEM(tp)
	if err != nil {
		t.Fatalf("error encoding public key:\n\t:%v\n", err)
	}

	data, err := json.Marshal(map[string]interface{}{
		"email":       examplemail,
		"password":    randomString,
		"ecdh_public": pemBlock,
	})

	if err != nil {
		t.Fatalf("error serializing to json:\n\t%v\n", err)
	}

	endpoint := "/api/user/register"
	req, err := http.NewRequest("POST", endpoint, bytes.NewBuffer(data))
	if err != nil {
		t.Fatalf("error creating new request:\n\t%v\n", err)
	}
	req.Header.Set("Content-Type", "application/json")

	r.ServeHTTP(w, req)
	if w.Code != http.StatusCreated {
		t.Fatalf("expected 201, got %d\n\tjsonBody:%s", w.Code, w.Body.String())
	}
	t.Logf("responseBody:\n\t%s\n", w.Body.String())
	_, res := user.GetUserFromMail(examplemail)
	if res != nil {
		t.Fatalf("error occured while getting user from database:\n\t%v\n", res.Error())
	}

	var jsonData map[string]interface{}
	if err := json.Unmarshal(w.Body.Bytes(), &jsonData); err != nil{
		t.Logf("error marshaling json:\n\t%v\n", err)
	}

	id, exists := jsonData["id"]
	if !exists {
		t.Logf("ID field doesn't exist on return json")
	}
	uuuid, err := uuid.Parse(id.(string))
	if err != nil {
		t.Logf("couldn't parse uuid:\n\t%v\n", err)
	}
	_, res = user.GetUserFromID(uuuid)
	if res != nil {
		t.Fatalf("error occured while getting user from database:\n\t%v\n", res.Error())
	}
}
