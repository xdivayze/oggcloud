package services

import (
	"fmt"
	"oggcloudserver/src/db"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func HandleFileUploadRequest(c *gin.Context) (*Session, error) {
	id := uuid.New()
	session_key := c.Request.FormValue("session_key")
	file_num, err := strconv.Atoi(c.Request.FormValue("file_count"))
	if err != nil {
		return nil, fmt.Errorf("error occured while parsing to int")

	}

	current_session := Session{
		ID:          id,
		SessionKey:  session_key,
		FileNumber:  file_num,
	}

	if res := db.DB.Save(&current_session); res.Error != nil {
		return nil, fmt.Errorf("error occured while saving instance to DB:\n\t%w", res.Error)
	}
	return &current_session, nil

}
