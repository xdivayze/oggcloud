package retrieve

import (
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"oggcloudserver/src/file_ops/file"
	"oggcloudserver/src/file_ops/session/Services/upload"
	"os"
	"strconv"
	"sync"

	"github.com/gin-gonic/gin"
)

func doLoadFileAndStream(c *gin.Context, f *file.File) error {

	var dirtype string
	if f.IsPreview {
		dirtype = upload.PREVIEW_DIR_NAME
	} else {
		dirtype = upload.STORAGE_DIR_NAME
	}

	filePath := fmt.Sprintf("%s/%s/%s/%s/%s", upload.DIRECTORY_BASE, f.UserID, f.SessionID,dirtype, f.FileName)
	loadedFile, err := os.Open(filePath)
	if err != nil {
		return fmt.Errorf("error occured while loading file")
	}
	defer loadedFile.Close()

	pr, pw := io.Pipe()
	writer := multipart.NewWriter(pw)

	fieldWriteQueue := map[string]string{
		"fileID":    f.ID.String(),
		"checksum":  *f.Checksum,
		"fileType":  *f.FileType,
		"fileName":  f.FileName,
		"isPreview": strconv.FormatBool(f.IsPreview),
	}

	var wg sync.WaitGroup
	wg.Add(1)

	go func() {
		defer pw.Close()
		defer writer.Close()
		defer wg.Done()

		for fname, val := range fieldWriteQueue {
			err = writer.WriteField(fname, val)
			if err != nil {
				pw.CloseWithError(fmt.Errorf("error occured while writing field %s with value %s:\n\t%w", fname, val, err))
				return 
			}
		}

		part, err := writer.CreateFormFile("file", f.FileName)
		if err != nil {
			pw.CloseWithError(fmt.Errorf("error occured while trying to create multipart form file:\n\t%w", err))
			return
		}
		_, err = io.Copy(part, loadedFile)
		if err != nil {
			pw.CloseWithError(fmt.Errorf("error occured while trying to copy file buffer into multipart writer:\n\t%w", err))
			return
		}

	}()

	c.Header("Content-Type", writer.FormDataContentType())
	c.Status(http.StatusOK)

	if _, err := io.Copy(c.Writer, pr); err != nil {
		c.AbortWithStatus(http.StatusInternalServerError)
		return fmt.Errorf("error occured while streaming file to client:\n\t%w", err)
	}
	wg.Wait()

	return nil

}
