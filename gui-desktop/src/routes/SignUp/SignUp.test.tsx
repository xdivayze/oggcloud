import axios from "axios";
import { Provider } from "react-redux";
import { vi, type Mock, describe, beforeEach, it, expect } from "vitest";
import { store } from "../../app/store";
import SignUp, {
  SignUpErrorMessageTestID,
  SignUpSubmitBtnTestID,
} from "./SignUp";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import {
  SignUpPasswordRepeatTestID,
  SignUpEMailSpanTestID,
  SignUpPasswdSpanTestID,
} from "./components/InputBase";
import { sha256 } from "@noble/hashes/sha2.js";
import { utf8ToBytes } from "@noble/hashes/utils.js";
import { SIGN_UP_ENDPOINT, type ISignUpRequest } from "./implementation";

vi.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

const exampleMail = "example@example.org";
const examplePassword = "password15";
const verificationCode = "code15";

describe("sign up page", () => {
  //TODO fire verify click, enter verification code, then submit
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("updates authentication state through reducer", async () => {
    (axios.post as unknown as Mock).mockResolvedValueOnce({
      status: 201,
    });

    render(
      <Provider store={store}>
        <SignUp />
      </Provider>
    );

    const emailSpan = screen.getByTestId(SignUpEMailSpanTestID);
    emailSpan.textContent = exampleMail;
    fireEvent.input(emailSpan, { target: { textContent: exampleMail } });

    const passwordSpan = screen.getByTestId(SignUpPasswdSpanTestID);
    passwordSpan.textContent = examplePassword;
    fireEvent.input(passwordSpan, { target: { textContent: examplePassword } });

    const passwordRepeatSpan = screen.getByTestId(SignUpPasswordRepeatTestID);
    passwordRepeatSpan.textContent = examplePassword;
    fireEvent.input(passwordRepeatSpan, {
      target: { textContent: examplePassword },
    });

    const submitBtn = screen.getByTestId(SignUpSubmitBtnTestID);
    fireEvent.click(submitBtn);

    await waitFor(async () => {
      const passwordHash = btoa(
        String.fromCharCode(...sha256(utf8ToBytes(examplePassword)))
      );

      const body: ISignUpRequest = {
        verificationCode: "",
        eMail: exampleMail,
        passwordHash: passwordHash,
      };

      expect(mockedAxios.post).toHaveBeenCalledWith(
        SIGN_UP_ENDPOINT,
        { body },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(screen.getByTestId(SignUpErrorMessageTestID).textContent);
      expect(screen.getByTestId(SignUpErrorMessageTestID).textContent).toBe("");
    });
  });
});
