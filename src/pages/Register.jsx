import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  sendRegistrationOTP,
  verifyRegistrationOTP,
} from "../utils/admin";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);

  const [usernameStatus, setUsernameStatus] =
    useState("");

  const [checkingUsername, setCheckingUsername] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [resending, setResending] =
    useState(false);

  const [error, setError] = useState("");

  const [message, setMessage] =
    useState("");

  useEffect(() => {
    const username =
      form.username.trim().toLowerCase();

    setUsernameStatus("");

    if (username.length < 3) {
      setCheckingUsername(false);
      return;
    }

    if (!/^[a-z0-9_]+$/.test(username)) {
      setUsernameStatus(
        "Only lowercase letters, numbers and underscores are allowed"
      );
      setCheckingUsername(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setCheckingUsername(true);

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/auth/check-username?username=${encodeURIComponent(username)}`
        );

        const data = await response.json();

        if (data.available) {
          setUsernameStatus("available");
        } else {
          setUsernameStatus(data.message);
        }
      } catch {
        setUsernameStatus(
          "Unable to check username"
        );
      } finally {
        setCheckingUsername(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [form.username]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "username"
          ? value.toLowerCase()
          : value,
    }));

    setError("");
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (
      form.password !==
      form.confirmPassword
    ) {
      setError("Passwords do not match");
      return;
    }

    if (
      usernameStatus !== "available"
    ) {
      setError(
        "Please choose an available username"
      );
      return;
    }

    setLoading(true);

    try {
      await sendRegistrationOTP(
        form.name,
        form.username,
        form.email,
        form.password,
        form.confirmPassword
      );

      setStep(2);

      setMessage(
        `OTP sent to ${ form.email } `
      );
    } catch (error) {
      setError(
        error.message ||
          "Failed to send OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!/^\d{6}$/.test(otp)) {
      setError(
        "Please enter a valid 6-digit OTP"
      );
      return;
    }

    setLoading(true);

    try {
      const data =
        await verifyRegistrationOTP(
          form.name,
          form.username,
          form.email,
          form.password,
          otp
        );

      localStorage.setItem(
        "token",
        data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      navigate("/blogs");
    } catch (error) {
      setError(
        error.message ||
          "OTP verification failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError("");
    setMessage("");
    setOtp("");

    setResending(true);

    try {
      await sendRegistrationOTP(
        form.name,
        form.username,
        form.email,
        form.password,
        form.confirmPassword
      );

      setMessage(
        `New OTP sent to ${ form.email } `
      );
    } catch (error) {
      setError(
        error.message ||
          "Failed to resend OTP"
      );
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4 py-8">

      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl p-6 sm:p-8">

        <div className="mb-8">

          <h1 className="text-4 sm:text-3xl font-bold text-white border-b border-gray-800 pb-2">
            {step === 1
              ? "Create Account"
              : "Verify Email"}
          </h1>

          <p className="text-gray-400 text-7 mt-0">
            {step === 1
              ? "Create your account to continue"
              : `Enter the OTP sent to ${ form.email } `}
          </p>

        </div>

        {error && (
          <div className="mb-5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-3 text-sm">
            {message}
          </div>
        )}

        {step === 1 ? (
          <form
            onSubmit={handleSendOTP}
            className="space-y-4"
          >

            <div>
              <label className="block text-6 text-gray-300 mb-1">
                Name
              </label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full bg-gray-800 text-6 border border-gray-700 rounded-lg px-4 py-1 text-white outline-none focus:border-blue-500"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className="block text-6 text-gray-300 mb-2">
                Username
              </label>

              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                required
                minLength={3}
                maxLength={30}
                className="w-full bg-gray-800 text-6 border border-gray-700 rounded-lg px-4 py-1 text-white outline-none focus:border-blue-500"
                placeholder="Choose a username"
              />

              <div className="mt-2 text-sm">

                {checkingUsername && (
                  <div className="custom-loader-username"></div>
                )}

                {!checkingUsername &&
                  usernameStatus ===
                    "available" && (
                    <span className="text-suppGreen-500">
                      ✓ Username is available
                    </span>
                  )}

                {!checkingUsername &&
                  usernameStatus &&
                  usernameStatus !==
                    "available" && (
                    <span className="text-suppRed-500">
                      {usernameStatus}
                    </span>
                  )}

              </div>
            </div>

            <div>
              <label className="block text-6 text-gray-300 mb-2">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full bg-gray-800 text-6 border border-gray-700 rounded-lg px-4 py-1 text-white outline-none focus:border-blue-500"
                placeholder="Enter email"
              />
            </div>

            <div>
              <label className="block text-6 text-gray-300 mb-2">
                Password
              </label>

              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full bg-gray-800 text-6 border border-gray-700 rounded-lg px-4 py-1 text-white outline-none focus:border-blue-500"
                placeholder="Enter password"
              />
            </div>

            <div>
              <label className="block text-6 text-gray-300 mb-2">
                Confirm Password
              </label>

              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                className="w-full bg-gray-800 text-6 border border-gray-700 rounded-lg px-4 py-1 text-white outline-none focus:border-blue-500"
                placeholder="Confirm password"
              />
            </div>

            <button
              type="submit"
              disabled={
                loading ||
                checkingUsername ||
                usernameStatus !==
                  "available"
              }
              className="glassy-icon px-3 border rounded-lg w-full py-3 text-white font-semibold disabled:opacity-50"
            >
              {loading
                ? "Sending OTP..."
                : "Continue"}
            </button>

          </form>
        ) : (
          <form
            onSubmit={handleVerifyOTP}
            className="space-y-5"
          >

            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Verification OTP
              </label>

              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(e) =>
                  setOtp(
                    e.target.value.replace(
                      /\D/g,
                      ""
                    )
                  )
                }
                required
                autoFocus
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-4 text-white text-center text-2xl tracking-[0.5em] outline-none focus:border-blue-500"
                placeholder="000000"
              />
            </div>

            <button
              type="submit"
              disabled={
                loading ||
                otp.length !== 6
              }
              className="glassy-icon px-3 border rounded-lg w-full py-3 text-white font-semibold disabled:opacity-50"
            >
              {loading
                ? "Verifying..."
                : "Verify & Create Account"}
            </button>

            <button
              type="button"
              onClick={handleResendOTP}
              disabled={resending}
              className="w-full text-blue-400 hover:text-blue-300 text-sm disabled:opacity-50"
            >
              {resending
                ? "Sending..."
                : "Resend OTP"}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep(1);
                setOtp("");
                setError("");
                setMessage("");
              }}
              className="w-full text-gray-400 hover:text-gray-300 text-sm"
            >
              ← Change details
            </button>

          </form>
        )}

        <p className="text-center text-gray-400 text-sm mt-6">

          Already have an account?{" "}

          <button
            type="button"
            onClick={() =>
              navigate("/login")
            }
            className="text-blue-400 underline hover:text-neutGray-800"
          >
            Login
          </button>

        </p>

      </div>
    </div>
  );
};

export default Register;

