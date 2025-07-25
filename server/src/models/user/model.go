package user

import "gorm.io/gorm"

type User struct {
	gorm.Model
	EMail          string `gorm:"unique"`
	BCryptPassword string
}
