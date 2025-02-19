package services_test

import (
	"bytes"
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"net/http/httptest"
	"oggcloudserver/src"
	services "oggcloudserver/src/file_ops/session/Services"
	"oggcloudserver/src/user/testing_material"
	"os"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/stretchr/testify/require"
)

const TEST_TAR = "/root/oggcloudserver/Storage/testing/uploadtest/test.tar.gz"

func TestDataHandling(t *testing.T) {
	testing_material.LoadDotEnv(t)
	testing_material.LoadDB(t)

    //defer testing_material.FlushDB()

	gin.SetMode(gin.TestMode)
	r := src.SetupRouter()

	id := doCreateUser(t, r)
	udir := fmt.Sprintf("%s/%s", services.DIRECTORY_BASE, id.String())
	defer os.RemoveAll(udir)

	file, err := os.Open(TEST_TAR)
	if err != nil {
		t.Fatalf("error trying to open test tarball:\n\t%v\n", err)
	}
	defer file.Close()
	
	var requestBody bytes.Buffer
	writer := multipart.NewWriter(&requestBody)

	filepart, err := writer.CreateFormFile("file", "mytar.tar.gz")
	if err != nil {
		t.Fatalf("error creating form file:\n\t%v\n", err)
	}
	if _, err = io.Copy(filepart, file); err != nil {
		t.Fatalf("error with io operation:\n\t%v\n", err)
	}

	if err = writer.WriteField("id", id.String()); err != nil {
		t.Fatalf("error occured while writing field")
	}
	if err = writer.WriteField("file_count", "2"); err != nil {
		t.Fatalf("error occured while writing field")
	}

	ra := make([]byte, 64)
	if _, err = rand.Read(ra); err != nil {
		t.Fatalf("error generating random values:\n\t%v", err)
	}

	if err = writer.WriteField("session_key", hex.EncodeToString(ra)); err != nil {
		t.Fatalf("error occured while writing field")
	}
	writer.Close()

	req, err := http.NewRequest("POST", "/api/file/upload", &requestBody)
	if err != nil {
		t.Fatalf("error generating new request:\n\t%v\n", err)
	}

	req.Header.Set("Content-Type", writer.FormDataContentType())
	w:= httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusCreated {
		t.Fatalf("status returned isnt 201 but %d", w.Code)
	}

	var unmarshaled map[string]interface{}
	if err = json.Unmarshal(w.Body.Bytes(), &unmarshaled); err != nil {
		t.Fatalf("error occured while unmarshalling:\n\t%v\n", err)
	}
	sid, err := uuid.Parse(unmarshaled["sessionID"].(string))
	if err != nil {
		t.Fatalf("error occured while parsing to uuid:\n\t%v\n", err)
	}

	
	require.DirExists(t,fmt.Sprintf("%s/%s", udir,sid ))
	

}

func doCreateUser(t *testing.T, r *gin.Engine) uuid.UUID {
	userjson, _ := testing_material.GenerateUserJson(t)
	w := httptest.NewRecorder()
	endpoint := "/api/user/register"
	req, err := http.NewRequest("POST", endpoint, bytes.NewBuffer(userjson))
	if err != nil {
		t.Fatalf("error creating new request:\n\t%v\n", err)
	}
	req.Header.Set("Content-Type", "application/json")

	r.ServeHTTP(w, req)
	if w.Code != http.StatusCreated {
		t.Fatalf("expected 201, got %d\n\tjsonBody:%s", w.Code, w.Body.String())
	}

	var jsonobj map[string]interface{}
	if err = json.Unmarshal(w.Body.Bytes(), &jsonobj); err != nil {
		t.Fatalf("error occured while unmarshalling:\n\t%v\n", err)
	}
	id, err := uuid.Parse(jsonobj["id"].(string))
	if err != nil {
		t.Fatalf("error occured while parsing to uuid:\n\t%v\n", err)
	}
	return id
}
