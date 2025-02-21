package retrieve

import (
	"fmt"
	"log"
	"net/http"
	"oggcloudserver/src/db"
	"oggcloudserver/src/file_ops/file"
	"oggcloudserver/src/user/model"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

const FILE_ID_FIELD = "fileID"
const PULL_METHOD_FIELD = "pullMethod"

func HandleRetrieve(c *gin.Context) { //work with offset get requests, not multiple photos at one request or ID
	log.SetPrefix("ERR: ")
	returnedFile := &file.File{}
	if c.Request.Header.Get(PULL_METHOD_FIELD) == "offset" {
		var err error
		returnedFile, err = getFileWithOffset(c)

		if err != nil {
			log.Printf("error occured while getting image:\n\t%v\n", err)
			return
		}
	} else if c.Request.Header.Get(PULL_METHOD_FIELD) == "id" {
		fileID := c.Request.Header.Get(FILE_ID_FIELD)
		if fileID == "" {
			log.Printf("error occured while getting request header with field %s\n", FILE_ID_FIELD)
			c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("field with name %s doesn't exist", FILE_ID_FIELD)})
			return
		}
		if res := db.DB.Find(returnedFile, "id = ?", fileID); res.Error != nil {
			log.Printf("error occured while finding file with id %s:\n\t%v\n", fileID, res.Error)
			if res.Error == gorm.ErrRecordNotFound {
				c.JSON(http.StatusNotFound, gin.H{"error": fmt.Sprintf("file with id %s doesn't exist", fileID)})
				return
			}
			c.JSON(http.StatusInternalServerError, gin.H{"error": "error occured while trying to find file"})
			return
		}
		u := &model.User{}
		db.DB.Where("email = ?", c.GetHeader("email")).Find(u)
		if returnedFile.UserID != u.ID {
			log.Printf("user doesn't own requested file")
			c.Status(http.StatusForbidden)
			return
		}

	} else {
		c.JSON(http.StatusBadRequest, gin.H{"error": "pull method not specified"})
		return
	}

	if err := doLoadFileAndStream(c, returnedFile); err != nil { 
		log.Printf("error occured while loading and streaming file:\n\t%v\n ", err)
		return
	}
}
