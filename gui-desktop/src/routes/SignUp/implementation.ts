import { sha256 } from "@noble/hashes/sha2.js";
import { utf8ToBytes } from "@noble/hashes/utils.js";

export const SIGN_UP_ENDPOINT = "/sign-up";

export interface ISignUpRequest {
  eMail: string;
  passwordHash: string;
  verificationCode: string;
}

export interface ISendSignUpRequestReturn {
  status: number;
  statusText: string;
}

export async function sendSignUpRequest(
  eMail: string,
  passwordPlain: string,
  verificationCode: string
) {
  const passwordHash = btoa(
    String.fromCharCode(...sha256(utf8ToBytes(passwordPlain)))
  );
  const body: ISignUpRequest = {
    eMail,
    passwordHash,
    verificationCode,
  };

  const response = await axios.post(
    SIGN_UP_ENDPOINT,
    {
      body,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return { status: response.status, statusText: response.statusText };
}
