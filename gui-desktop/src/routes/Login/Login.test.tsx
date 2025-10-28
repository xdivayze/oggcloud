import axios from "axios";
import { describe, it, vi, type Mock, expect, beforeEach } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Login, SubmitTestID } from "./Login";
import { EMailSpanTestID, PasswdSpanTestID } from "./Components/ButtonBody";
import { sha256 } from "@noble/hashes/sha2.js";
import { LOGIN_ENDPOINT, type ILoginRequest } from "./implementation";
import { Provider } from "react-redux";
import { store } from "../../app/store";
import { utf8ToBytes } from "@noble/hashes/utils.js";

vi.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("Login page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("updates global variable on login success", async () => {
    (axios.post as unknown as Mock).mockResolvedValueOnce({
      status: 200,
    });

    render(
      <Provider store={store}>
        <Login />
      </Provider>
    );

    const emailSpan = screen.getByTestId(EMailSpanTestID);
    const testMail = "alice@example.com";
    emailSpan.textContent = testMail;
    fireEvent.input(emailSpan, { target: { textContent: testMail } });

    const passwordSpan = screen.getByTestId(PasswdSpanTestID);
    const testPassword = "correct";
    passwordSpan.textContent = testPassword;
    fireEvent.input(passwordSpan, { target: { textContent: testPassword } });

    const submitBtn = screen.getByTestId(SubmitTestID);
    fireEvent.click(submitBtn);

    await waitFor(async () => {
      const passwordHash = btoa(
        String.fromCharCode(...sha256(utf8ToBytes(testPassword)))
      );

      const body: ILoginRequest = {
        eMail: testMail,
        passwordHash,
      };

      expect(mockedAxios.post).toHaveBeenCalledWith(
        LOGIN_ENDPOINT,
        { body },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      expect(screen.getAllByText("success.").length).toBe(1);
    });
  });
});
