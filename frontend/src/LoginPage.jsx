import React, { useActionState } from "react";
import { MainLayout } from "./MainLayout.jsx";
import "./LoginPage.css";
import { Link } from "react-router";
import { VALID_ROUTES } from "./shared/ValidRoutes.js";

export function LoginPage({ isRegistering }) {
  const usernameInputId = React.useId();
  const passwordInputId = React.useId();
  const emailInputId = React.useId();
  async function apiRequest(url, body) {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const data =
      response.headers.get("content-length") !== "0"
        ? await response.json()
        : null;
    if (!response.ok) {
      throw new Error(`Error ${data.message}`);
    }
    return data;
  }
  async function registerUser(username, email, password) {
    return await apiRequest("/api/users", {
      username: username,
      email: email,
      password: password,
    });
  }
  async function loginUser(username, password) {
    return await apiRequest("/api/auth/tokens", {
      username: username,
      password: password,
    });
  }
  const [result, submitAction, isPending] = useActionState(
    async (prevState, formData) => {
      const email = formData.get("email");
      const username = formData.get("username");
      const password = formData.get("password");
      try {
        if (isRegistering) {
          await registerUser(username, email, password);
          return { success: true, message: "Account created sucessfully!" };
        } else {
          const data = await loginUser(username, password);
          console.log("Auth token:", data.token);
          return { success: true, message: "Logged in sucessfully!" };
        }
      } catch (error) {
        return { success: false, message: error.message };
      }
    },

    null,
  );

  return (
    <>
      {isRegistering ? <h2>Register a new account</h2> : <h2>Login</h2>}
      <form className="LoginPage-form" action={submitAction}>
        {isRegistering && (
          <>
            <label htmlFor={emailInputId}>Email</label>
            <input
              name="email"
              disabled={isPending}
              id={emailInputId}
              required
            />
          </>
        )}

        <label htmlFor={usernameInputId}>Username</label>
        <input
          disabled={isPending}
          name="username"
          id={usernameInputId}
          required
        />

        <label htmlFor={passwordInputId}>Password</label>

        <input
          disabled={isPending}
          name="password"
          id={passwordInputId}
          type="password"
          required
        />
        <input disabled={isPending} type="submit" value="Submit" />
        <div aria-live="polite">
          {result && (
            <p style={{ color: result.success ? "green" : "red" }}>
              {result.message}
            </p>
          )}
        </div>
      </form>
      {isRegistering ? (
        <p>
          Already have an accont?{" "}
          <Link to={VALID_ROUTES.LOGIN}>Login here </Link>
        </p>
      ) : (
        <p>
          Don't have an account?{" "}
          <Link to={VALID_ROUTES.REGISTER}>Register here</Link>
        </p>
      )}
    </>
  );
}
