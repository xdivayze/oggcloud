package src

import (
	"oggcloudserver/src/db"
	"oggcloudserver/src/user"
	"oggcloudserver/src/user/routes"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()
	userRoutes := r.Group("/api/user")
	{
		userRoutes.POST("/register", routes.RegisterUser)
	}
	return r
}

func GetDB() (*gorm.DB, error) {
	err := db.Create_DB()
	db.DB.AutoMigrate(&user.User{})
	return db.DB, err
}
