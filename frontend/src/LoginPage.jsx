import React, { useActionState } from "react";
import { MainLayout } from "./MainLayout.jsx";
import "./LoginPage.css";
import { Link } from "react-router";
import { VALID_ROUTES } from "./shared/ValidRoutes.js";

export function LoginPage({ isRegistering }) {
  const usernameInputId = React.useId();
  const passwordInputId = React.useId();
  const emailInputId = React.useId();
  const [result, submitAction, isPending] = useActionState(
    async (prevState, formData) => {
      const email = formData.get("email");
      const username = formData.get("username");
      const password = formData.get("password");

      try {
        const response = await fetch(`/api/users`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            username: username,
            password: password,
          }),
        });

        console.log("Sucessfully created an account");
        if (!response.ok) {
          throw new Error(
            `Error: HTTP ${response.status} ${response.statusText}`,
          );
        }
      } catch (e) {
        //TODO: do something
        console.error(e);
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
