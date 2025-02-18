package src

import (
	"oggcloudserver/src/db"
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
	return r
}

func GetDB() (*gorm.DB, error) {
	err := db.Create_DB()
	db.DB.AutoMigrate(&model.User{}, &auth.AuthorizationCode{})
	return db.DB, err
}
