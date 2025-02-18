package src

import (
	"oggcloudserver/src/db"
	"oggcloudserver/src/file_ops/file"
	"oggcloudserver/src/file_ops/session"
	services "oggcloudserver/src/file_ops/session/Services"
	"oggcloudserver/src/user/auth"
	"oggcloudserver/src/user/model"
	loginuser "oggcloudserver/src/user/routes/login_user"
	registeruser "oggcloudserver/src/user/routes/register_user"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()
	userRoutes := r.Group("/api/user")
	{
		userRoutes.POST("/register", registeruser.RegisterUser)
		userRoutes.POST("/login", loginuser.LoginUser)
	}
	fileRoutes := r.Group("/api/file")
	{
		fileRoutes.POST("/upload", session.HandleFileUpload)
	}
	return r
}

func GetDB() (*gorm.DB, error) {
	err := db.Create_DB()
	db.DB.AutoMigrate(&model.User{}, &auth.AuthorizationCode{}, &file.File{}, &services.Session{})
	return db.DB, err
}
