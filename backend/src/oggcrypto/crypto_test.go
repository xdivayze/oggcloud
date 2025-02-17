package oggcrypto_test

import (
	"encoding/hex"
	"fmt"
	"log"
	"oggcloudserver/src/oggcrypto"
	"os"
	"testing"
)

func TestAESEncryption(t *testing.T) {
	plaintext := []byte("bedava fare peynir kapanında olur.")
	key, err := oggcrypto.GenerateAESKey()
	if err != nil {
		log.Fatalf("error generating aes key:\n\t%v", err)
	}
	cipher, err := oggcrypto.EncryptAES(plaintext, key)
	if err != nil {
		log.Fatalf("error encrypting:\n\t%v", err)
	}

	decipheredtext, err := oggcrypto.DecryptAES(cipher, key)
	{
		decipheredtext := string(decipheredtext)
		plaintext := string(plaintext)
		if err != nil {
			log.Fatalf("decryption failed:\n\t%v", err)
		}
		if decipheredtext != plaintext {
			log.Fatalf("plaintext doesn't match decipheredtext:\n\t%s == %s", plaintext, decipheredtext)
		}
	}
	fmt.Fprintf(os.Stdout, "%x\nis equal to\n%x\n",plaintext,decipheredtext)

}

func TestECDHFunctions(t *testing.T) {
	defer os.Remove(oggcrypto.MASTERKEY_PATH)
	sk0, pk0, err := oggcrypto.GenerateECDHPair()
	if err != nil {
		log.Fatalf("error generating 0th ecdh pair:\n\t:%v", err)
	}
	sk1, pk1, err := oggcrypto.GenerateECDHPair()
	if err != nil {
		log.Fatalf("error generating 1st ecdh pair:\n\t:%v", err)
	}
	shared01, salt, err := oggcrypto.DeriveSharedSecret(sk0, pk1, nil)
	if err != nil {
		log.Fatalf("error generating shared secret 0:\n\t:%v", err)
	}
	shared10, salt10, err := oggcrypto.DeriveSharedSecret(sk1, pk0, salt)
	if err != nil {
		log.Fatalf("error generating shared secret 1:\n\t:%v", err)
	}

	{
		salt10 := hex.EncodeToString(salt10)
		salt := hex.EncodeToString(salt)
		if salt10 != salt {
			log.Fatalf("salt assertion failed, testing cannot continue:\n\t%s == %s", salt, salt10)
		}
	}

	{
		shared10 := hex.EncodeToString(shared10)
		shared01 := hex.EncodeToString(shared01)
		if shared10 != shared01 {
			log.Fatalf("shared key assertion failed, testing failed:\n\t%s == %s", shared10, shared01)
		}
	}

}

func TestAESGeneration(t *testing.T) {
	defer os.Remove(oggcrypto.MASTERKEY_PATH)
	data, err := os.ReadFile(oggcrypto.MASTERKEY_PATH)
	if err != nil {
		log.Fatalf("error reading file on path %s :\n\t:%v", oggcrypto.MASTERKEY_PATH, err)
	}
	if len(data) == 0 {
		log.Fatalf("master aes key on path %s reads null", oggcrypto.MASTERKEY_PATH)
	}
}
