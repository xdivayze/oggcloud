import { sha256 } from "@noble/hashes/sha2.js"
import { utf8ToBytes } from "@noble/hashes/utils.js"
import axios from "axios"

export const LOGIN_ENDPOINT = "/login"

export interface ILoginRequest {
    eMail: string,
    passwordHash: string,
}

function computeAndReturnBase64Hash(passwordPlain: string): string {
    const passwordHashBytes = sha256 (utf8ToBytes(passwordPlain))
    const passwordHashB64 = Buffer.from(passwordHashBytes).toString("base64");
    return passwordHashB64;
}


export async function sendLoginRequest(eMail: string, passwordPlain: string) { //input plain text password and hash later
    const passwordHash = computeAndReturnBase64Hash(passwordPlain);
    const body: ILoginRequest = {
        eMail,
        passwordHash,

    }
    const response = await axios.post(LOGIN_ENDPOINT, {
        body
        
    },{
        headers: {
            "Content-Type": "application/json"
        },
        
    })

    return response.status

}

