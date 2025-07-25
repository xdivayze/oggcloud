package user

import (
	"gorm.io/gorm"
)

func GetUserFromEMail(mail string, db *gorm.DB) (*User, error) {
	var user User
	err := db.First(&user, "e_mail = ?", mail).Error
	return &user, err
}

func (user *User) Delete(db *gorm.DB) error {
	return db.Delete(&user).Error
}

func (user *User) Save(db *gorm.DB) error {
	return db.Save(&user).Error
}

func (user *User) Create(db *gorm.DB) error {
	return db.Create(&user).Error
}
