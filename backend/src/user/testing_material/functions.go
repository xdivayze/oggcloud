package testing_material

import (
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"oggcloudserver/src"
	"oggcloudserver/src/oggcrypto"
	"testing"

	"github.com/joho/godotenv"
)

const EXAMPLE_MAIL = "example@example.org"
const DOTENV_PATH = "/root/oggcloudserver/backend/.env"

func GenerateUserJson(t *testing.T) []byte {
	randomBytes := make([]byte, 60)
	_, err := rand.Read(randomBytes)
	if err != nil {
		t.Fatalf("error reading from random buffer:\n\t%v\n", err)
	}
	randomString := hex.EncodeToString(randomBytes)

	_, tp, err := oggcrypto.GenerateECDHPair()
	if err != nil {
		t.Fatalf("error generating ecdh pair:\n\t:%v\n", err)
	}
	pemBlock, err := oggcrypto.EncodePublicKeyToPEM(tp)
	if err != nil {
		t.Fatalf("error encoding public key:\n\t:%v\n", err)
	}

	data, err := json.Marshal(map[string]interface{}{
		"email":       EXAMPLE_MAIL,
		"password":    randomString,
		"ecdh_public": pemBlock,
	})

	if err != nil {
		t.Fatalf("error serializing to json:\n\t%v\n", err)
	}
	return data
}

func LoadDB(t *testing.T) {
	_, err := src.GetDB()
	if err != nil {
		t.Fatalf("error creating database:\n\t%v\n", err)
	}
}

func LoadDotEnv(t *testing.T) {
	err := godotenv.Load(DOTENV_PATH)
	if err != nil {
		t.Fatalf("Error loading .env file %v\n", err)
	}
}
