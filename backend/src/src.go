package src

import (
	"oggcloudserver/src/db"
	"oggcloudserver/src/user/model"
	"oggcloudserver/src/user/routes/register_user"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()
	userRoutes := r.Group("/api/user")
	{
		userRoutes.POST("/register", registeruser.RegisterUser)
	}
	return r
}

func GetDB() (*gorm.DB, error) {
	err := db.Create_DB()
	db.DB.AutoMigrate(&model.User{})
	return db.DB, err
}
