import { sha256 } from "@noble/hashes/sha2.js"
import { utf8ToBytes } from "@noble/hashes/utils.js"
import axios from "axios"

export const LOGIN_ENDPOINT = "/login"

export interface ILoginRequest {
    eMail: string,
    passwordHash: string,
}


export async function sendLoginRequest(eMail: string, passwordPlain: string) { //input plain text password and hash later
    const passwordHash = btoa(String.fromCharCode( ...sha256 (utf8ToBytes(passwordPlain)))) //encode as base64
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

