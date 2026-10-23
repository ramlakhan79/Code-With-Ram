
import { useState } from "react";
import { Link } from "react-router-dom";
import {
    Eye,
    EyeOff,
    LockKeyhole,
    CheckCircle,
    AlertCircle,
} from "lucide-react";

export default function ChangePassword() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");
        setSuccess(false);

        if (!currentPassword || !newPassword || !confirmPassword) {
            setError("Please fill in all password fields.");
            return;
        }

        if (newPassword.length < 6) {
            setError("Password must contain at least 6 characters.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("New passwords do not match.");
            return;
        }

        if (currentPassword === newPassword) {
            setError("New password must be different from the current password.");
            return;
        }

        // Replace "token" with your actual authentication storage key.
        const token = localStorage.getItem("token");

        if (!token) {
            setError("Your session has expired. Please log in again.");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/auth/change-password`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        currentPassword,
                        newPassword,
                        confirmPassword,
                    }),
                },
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to change password.");
            }

            setSuccess(true);
            setMessage(data.message || "Password changed successfully.");

            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err) {
            setError(err.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    const passwordField = (
        label,
        value,
        setValue,
        visible,
        setVisible,
        placeholder,
    ) => (
        <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                {label}
            </label>

            <div className="relative">
                <input
                    type={visible ? "text" : "password"}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder={placeholder}
                    disabled={loading}
                    autoComplete="new-password"
                    className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-white px-4 py-3 pr-12 outline-none focus:border-gray-500 transition"
                />

                <button
                    type="button"
                    onClick={() => setVisible(!visible)}
                    aria-label={visible ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                    {visible ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
            </div>
        </div>
    );

    return (
        <div className="flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-md rounded-xl border border-gray-200 dark:border-gray-800 p-8 shadow-xl">
                <div className="flex justify-center mb-5">
                    <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-3">
                        <LockKeyhole
                            size={15}
                            className="text-gray-800 dark:text-gray-200"
                        />
                    </div>
                </div>

                <h1 className="text-6 font-bold text-center text-gray-900 dark:text-white">
                    Change Password
                </h1>

                <p className="mt-2 mb-6 text-8 text-center text-gray-500 dark:text-gray-400">
                    Update your account password securely.
                </p>

                {error && (
                    <div
                        role="alert"
                        className="mb-5 flex gap-3 rounded-lg border border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-950/30 p-3"
                    >
                        <AlertCircle size={18} className="text-red-500 shrink-0" />
                        <p className="text-sm text-red-600 dark:text-red-400">
                            {error}
                        </p>
                    </div>
                )}

                {success && (
                    <div
                        role="status"
                        className="mb-5 flex gap-3 rounded-lg border border-green-200 bg-green-50 dark:border-green-900/50 dark:bg-green-950/30 p-3"
                    >
                        <CheckCircle size={18} className="text-green-600 shrink-0" />
                        <p className="text-sm text-green-700 dark:text-green-400">
                            {message}
                        </p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block mb-2 text-6 font-medium text-gray-700 dark:text-gray-300">
                            Current Password
                        </label>

                        <div className="relative">
                            <input
                                type={showCurrent ? "text" : "password"}
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                placeholder="Enter current password"
                                disabled={loading}
                                className="text-7 w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-black dark:bg-gray-950 text-gray-900 dark:text-white px-4 pr-4 outline-none focus:border-gray-500 dark:focus:border-gray-400 transition"
                            />

                            <button
                                type="button"
                                onClick={() => setShowCurrent(!showCurrent)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                            >
                                {showCurrent ? <EyeOff size={19} /> : <Eye size={19} />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block mb-2 text-6 font-medium text-gray-700 dark:text-gray-300">
                            New Password
                        </label>

                        <div className="relative">
                            <input
                                type={showNew ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Enter new password"
                                disabled={loading}
                                className="text-7 w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-black dark:bg-gray-950 text-gray-900 dark:text-white px-4 pr-4 outline-none focus:border-gray-500 dark:focus:border-gray-400 transition"
                            />

                            <button
                                type="button"
                                onClick={() => setShowNew(!showNew)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                            >
                                {showNew ? <EyeOff size={19} /> : <Eye size={19} />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block mb-2 text-6 font-medium text-gray-700 dark:text-gray-300">
                            Confirm New Password
                        </label>

                        <div className="relative">
                            <input
                                type={showConfirm ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm new password"
                                disabled={loading}
                                className="text-7 w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-black dark:bg-gray-950 text-gray-900 dark:text-white px-4 pr-4 outline-none focus:border-gray-500 dark:focus:border-gray-400 transition"
                            />

                            <button
                                type="button"
                                onClick={() => setShowConfirm(!showConfirm)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                            >
                                {showConfirm ? <EyeOff size={19} /> : <Eye size={19} />}
                            </button>
                        </div>
                    </div>


                    <button
                        type="submit"
                        disabled={loading}
                        className="glassy-icon w-full px-5 py-3 border border-gray-700 rounded-lg text-sm sm:text-base transition disabled:opacity-60"
                    >
                        {loading ? "Updating Password..." : "Change Password"}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <Link
                        to="/profile"
                        className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:underline"
                    >
                        Back to Profile
                    </Link>
                </div>
            </div>
        </div>
    );
}
