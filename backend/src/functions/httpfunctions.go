package functions

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

func FieldAssignment(c *gin.Context, fieldname string, json map[string]interface{}) (string, int) {
	field, exists := json[fieldname]
	if !exists {
		c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("field doesn't exists '%s'", field)})
		return "", -1
	}
	return field.(string), 0
}