package retrieve_test

import (
	"net/http"
	"net/http/httptest"
	"oggcloudserver/src"
	"oggcloudserver/src/file_ops/session/Services/retrieve"
	"oggcloudserver/src/user/auth"
	"oggcloudserver/src/user/model"
	"oggcloudserver/src/user/testing_material"
	"os"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/require"
)

func TestDownloadIntegrity(t *testing.T) {
	require := require.New(t)

	testing_material.ModeFlush = false
	testing_material.TestDataHandling(t)
	testing_material.ModeFlush = true

	defer func() {
		if testing_material.ModeFlush {
			testing_material.FlushDB()
			os.RemoveAll(testing_material.Udir)
		}
	}()

	endpoint := "/api/file/retrieve"

	gin.SetMode(gin.TestMode)
	r := src.SetupRouter()
	req, err := http.NewRequest("GET", endpoint, nil)
	require.Nil(err)

	req.Header.Set(model.EMAIL_FIELDNAME, testing_material.EXAMPLE_MAIL)
	req.Header.Set(auth.AUTH_CODE_FIELDNAME, testing_material.Auth)
	req.Header.Set(retrieve.PULL_METHOD_FIELD, "offset")
	req.Header.Set(retrieve.PREVIEW_WISH_FIELD, "true")
	req.Header.Set(retrieve.OFFSET_FIELD, "0")

	w := httptest.NewRecorder()

	r.ServeHTTP(w, req)

	req.FormFile("file") //retrieve file, write etc

}
