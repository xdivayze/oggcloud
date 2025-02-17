package user

import (
	"fmt"
)

func toString(u *User) string {
	return fmt.Sprintf("\tID:%s\n\tEmail:%s\n\tPasswordHash:%s\n\tEcdhSharedKey:%s\n\tCreatedAt:%s\n\tUpdatedAt:%s\n\t",
		u.ID.String(), u.Email, *u.PasswordHash, *u.EcdhSharedKey, u.CreatedAt.String(), u.UpdatedAt.String())

}
