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
	"oggcloudserver/src/db"
	"oggcloudserver/src/file_ops/file"
	services "oggcloudserver/src/file_ops/session/Services"
	"oggcloudserver/src/user/model"
	"oggcloudserver/src/user/testing_material"
	"os"
	"strings"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/stretchr/testify/require"
)

const TEST_TAR = "/root/oggcloudserver/Storage/testing/uploadtest/test.tar.gz"

var mode_flush = true
var udir string

func TestDBIntegrity(t *testing.T) {
	require := require.New(t)
	mode_flush = false
	TestDataHandling(t)
	mode_flush = true
	defer func() {
		if mode_flush {
			testing_material.FlushDB()
			os.RemoveAll(udir)
		}
	}()
	lx := strings.Split(udir, "/")
	id := lx[len(lx)-1]
	var u model.User
	var l []services.Session
	uid, err := uuid.Parse(id)
	require.Nil(err)
	res := db.DB.Find(&u,uid )
	require.Nil(res.Error)

	err = db.DB.Model(&u).Association("Sessions").Find(&l)
	require.Nil(err)
	
	storageDir, err := os.ReadDir(fmt.Sprintf("%s/%s/%s", udir,l[0].ID,"Storage")) 
	require.Nil(err)
	for _, f := range storageDir {
		var foundFile file.File
		res := db.DB.Where("file_name = ?", f.Name()).First(&foundFile)
		require.Nil(res.Error)
		if !strings.HasSuffix( foundFile.FileName, "json") {
			require.True(foundFile.HasPreview || foundFile.IsPreview)
			if foundFile.HasPreview {
				var previewFile file.File
				db.DB.Model(&foundFile).Association("Preview").Find(&previewFile)
				require.NotNil(previewFile)
			} 
			
		}
	}
}

func TestDataHandling(t *testing.T) {
	testing_material.LoadDotEnv(t)
	testing_material.LoadDB(t)

	defer func() {
		if mode_flush {
			testing_material.FlushDB()
		}
	}()

	gin.SetMode(gin.TestMode)
	r := src.SetupRouter()

	id := doCreateUser(t, r)
	udir = fmt.Sprintf("%s/%s", services.DIRECTORY_BASE, id.String())

	defer func() {
		if mode_flush {
			os.RemoveAll(udir)
		}
	}()

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
	if err = writer.WriteField("checksum", "943ce510ede7b561769fec1bde0b2b03d6f3df698a82d01e3de6eca8853528eb"); err != nil {
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
	w := httptest.NewRecorder()
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

	require.DirExists(t, fmt.Sprintf("%s/%s/Storage", udir, sid))
	require.DirExists(t, fmt.Sprintf("%s/%s/Preview", udir, sid))

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
