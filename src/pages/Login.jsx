import { Turnstile } from "@marsidev/react-turnstile";
const turnstileSiteKey = "0x4AAAAAABzsHb0oW1jrht7C";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { loginUser } from "../utils/admin";
import GoogleLoginButton from "../components/GoogleLoginButton";

const Login = () => {
  const navigate = useNavigate();
  // const [token, setToken] = useState("");
  const [showForgotPopup, setShowForgotPopup] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [identifier, setIdentifier] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const data = await loginUser(identifier, password);

      localStorage.setItem("token", data.token);

      localStorage.setItem("user", JSON.stringify(data.user));

      if (data.user.role === "admin") {
        navigate("/admin");
      } else if (data.user.role === "contributor") {
        navigate("/dashboard");
      } else {
        navigate("/blogs");
      }
    } catch (error) {
      setError(error.message || "Invalid username/email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = (user) => {
    if (user.role === "admin") {
      navigate("/admin");
    } else if (user.role === "contributor") {
      navigate("/dashboard");
    } else {
      navigate("/blogs");
    }
  };
  const handleGithubLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/github`;
  };

  const handleForgotPassword = async (e) => {
  e.preventDefault();

  setForgotMessage("");
  setForgotError("");

  const email = forgotEmail.trim().toLowerCase();

  if (!email) {
    setForgotError("Please enter your email address.");
    return;
  }

  try {
    setForgotLoading(true);

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/auth/forgot-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Unable to send the password reset link."
      );
    }

    setForgotMessage(
      data.message || "If the account exists, a password reset link has been sent to your email."
    );
    setForgotEmail("");
  } catch (error) {
    setForgotError(error.message || "Something went wrong. Please try again.");
  } finally {
    setForgotLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4 py-8">
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl p-6 sm:p-8">
        <div className="mb-8">
          <h1 className="text-4 sm:text-3xl font-bold text-white border-b border-gray-800 pb-2">
            Login
          </h1>

          <p className="text-gray-400 mt-2">Login to your account</p>
        </div>

        {error && (
          <div className="mb-5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Username or Email
            </label>

            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white outline-none focus:border-blue-500"
              placeholder="Enter username or email"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">Password</label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white outline-none focus:border-blue-500"
              placeholder="Enter password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="glassy-icon px-3 border rounded-lg w-full py-3 text-white font-semibold disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="text-center text-gray-400 mt-3">
          <button
            type="button"
            onClick={() => {
              setForgotEmail("");
              setForgotMessage("");
              setForgotError("");
              setShowForgotPopup(true);
            }}
            className="text-blue-400 text-7 underline hover:text-blue-500 transition-colors"
          >
            Forgot Password?
          </button>
        </p>
        {/* Divider */}

        <div className="flex items-center gap-3 my-6">
          <div className="h-px bg-gray-800 flex-1" />

          <span className="text-gray-500 text-sm">OR</span>

          <div className="h-px bg-gray-800 flex-1" />
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {/* Google */}
          <div className="items-center">
            <GoogleLoginButton onSuccess={handleGoogleSuccess} />
          </div>
          {/* <div className="items-center rounded-md border border-gray-700">
            <button
              type="button"
              onClick={handleGithubLogin}
              className="text-5 flex items-center justify-center gap-4 py-2 transition hover:bg-neutGray-800"
            >
              <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current">
                <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55v-2.17c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.76 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.77.11 3.06.74.81 1.19 1.84 1.19 3.1 0 4.43-2.69 5.4-5.25 5.69.41.36.78 1.08.78 2.18v3.24c0 .3.21.66.79.55A10.99 10.99 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
              </svg>
              Continue with GitHub
            </button>
          </div> */}
        </div>

        <div className="flex flex-col items-center my-3">
          <div className="text-7 flex gap-3 text-gray-500 mt-0">
            Password Login: <span className="font-medium text-7 text-gray-400">1-Day Session</span>           
          </div>
          <div className="text-8 flex text-gray-500 mt-0">
           OR
          </div>
          <div className="text-7 flex gap-3 text-gray-500 mt-0">
            Google Login: <span className="font-medium text-7 text-gray-400">15-Day Session</span>
          </div>     
        </div>
        {/* <p className="w-full flex flex-wrap items-center justify-center">
        <Turnstile
          siteKey={turnstileSiteKey}
          onSuccess={(newToken) => setToken(newToken)}
          onError={() => setToken("")}
          onExpire={() => setToken("")}
        />
        {error.token && (
          <p className="text-suppRed-500 text-sm">{error.token}</p>
        )}
        </p> */}
        <p className="text-center text-gray-400 text-sm mt-6">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="text-blue-400 hover:text-blue-300"
          >
            Register
          </button>
        </p>  
        {showForgotPopup && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-lg"
            onClick={() => {
              if (!forgotLoading) setShowForgotPopup(false);
            }}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="forgot-password-title"
              className="w-full max-w-md rounded-2xl border border-gray-700 bg-gray-900 p-6 shadow-2xl sm:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <h2
                    id="forgot-password-title"
                    className="text-5 font-bold text-white"
                  >
                    Forgot Password?
                  </h2>

                  <p className="mt-2 text-8 text-gray-400">
                    Enter your registered email address to receive a password reset link.
                  </p>
                </div>

                <button
                  type="button"
                  aria-label="Close popup"
                  disabled={forgotLoading}
                  onClick={() => setShowForgotPopup(false)}
                  className="text-2xl leading-none text-gray-400 hover:text-white disabled:opacity-50"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleForgotPassword}>
                <label
                  htmlFor="forgot-email"
                  className="mb-2 block text-6 font-medium text-gray-300"
                >
                  Email address
                </label>

                <input
                  id="forgot-email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="you@gmail.com"
                  value={forgotEmail}
                  onChange={(e) => {
                    setForgotEmail(e.target.value);
                    setForgotError("");
                    setForgotMessage("");
                  }}
                  required
                  disabled={forgotLoading}
                  className="w-full text-7 rounded-lg px-2 py-0 text-white outline-none placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-60"
                />

                {forgotError && (
                  <p role="alert" className="mt-3 text-8 text-red-400">
                    {forgotError}
                  </p>
                )}

                {forgotMessage && (
                  <p role="status" className="mt-3 text-8 text-green-400">
                    {forgotMessage}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="mt-5 flex text-7 underline w-full items-center justify-center rounded-lg bg-blue-600 px-2 py-1 font-semibold transition-colors hover:bg-neutGray-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {forgotLoading ? "Sending..." : "Send Reset Link"}
                </button>

                <button
                  type="button"
                  disabled={forgotLoading}
                  onClick={() => setShowForgotPopup(false)}
                  className="mt-3 w-full text-7 rounded-lg border border-gray-700 px-2 py-1 text-gray-300 transition-colors hover:bg-neutGray-800 disabled:opacity-50"
                >
                  Back to Login
                </button>
              </form>
            </div>
          </div>
        )}      
      </div>
    </div>
  );
};

export default Login;
