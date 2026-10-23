import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

const Profile = () => {
  const { id } = useParams();
   const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
  });

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);

      setUser(parsedUser);

      setFormData({
        name: parsedUser.name || "",
        username: parsedUser.username || "",
        email: parsedUser.email || "",
      });
    }
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    setSaving(true);
    setMessage("");
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userD = JSON.parse(storedUser);

      const userID = userD._id;
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/users/${userID}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              name: formData.name,
              username: formData.username,
              email: formData.email,
            }),
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to update user");
        }
        navigate("/profile");
        const updatedUser = {
          ...user,
          ...formData,
        };

        localStorage.setItem("user", JSON.stringify(updatedUser));

        setUser(updatedUser);
        setEditing(false);
        setMessage("Profile updated successfully.");

        setTimeout(() => {
          setMessage("");
        }, 3000);
      } catch (error) {
        console.error(error);
        setMessage("Failed to update profile.");
      } finally {
        setSaving(false);
      }
    }
  };

  const getInitial = () => {
    if (user?.name) {
      return user.name.charAt(0).toUpperCase();
    }

    if (user?.username) {
      return user.username.charAt(0).toUpperCase();
    }

    return "U";
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      username: user?.username || "",
      email: user?.email || "",
    });

    setEditing(false);
    setMessage("");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-10 h-10 mx-auto mb-4 border-4 border-gray-700 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-950/90 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">
                Account settings
              </h1>

              <p className="mt-1 text-sm text-gray-400">
                Manage your profile and account preferences.
              </p>
            </div>

            <Link
              to="/dashboard"
              className="
                inline-flex items-center gap-2
                px-4 py-2
                text-sm font-medium
                text-gray-300
                bg-gray-900
                border border-gray-700
                rounded-lg
                hover:bg-gray-800
                hover:text-white
                transition
              "
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>

              <span className="hidden sm:inline">Back to dashboard</span>
              <span className="sm:hidden">Back</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-3">
              <nav className="space-y-1">
                <a
                  href="#profile"
                  className="
                    flex items-center gap-3
                    px-3 py-2.5
                    rounded-lg
                    text-sm font-medium
                    text-white
                    bg-gray-800
                  "
                >
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeWidth="2"
                      d="M5.121 17.804A13.937 13.937 0 0112 16c2.574 0 4.966.69 7.029 1.893M15 10a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Profile
                </a>

                <a
                  href="#security"
                  className="
                    flex items-center gap-3
                    px-3 py-2.5
                    rounded-lg
                    text-sm font-medium
                    text-gray-400
                    hover:text-white
                    hover:bg-gray-800
                    transition
                  "
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeWidth="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  Security
                </a>

                <a
                  href="#account"
                  className="
                    flex items-center gap-3
                    px-3 py-2.5
                    rounded-lg
                    text-sm font-medium
                    text-gray-400
                    hover:text-white
                    hover:bg-gray-800
                    transition
                  "
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Account
                </a>
              </nav>
            </div>
          </aside>

          {/* Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Profile Header */}
            <section
              id="profile"
              className="
                bg-gray-900
                border border-gray-800
                rounded-xl
                overflow-hidden
              "
            >
              {/* Cover */}
              <div className="h-28 sm:h-36 bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-purple-900/40" />

              <div className="px-5 sm:px-8 pb-6">
                <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-10">
                  {/* Avatar */}
                  <div className="relative">
                    <div
                      className="
                        w-20 h-20
                        sm:w-24 sm:h-24
                        rounded-full
                        border-4
                        border-gray-900
                        bg-blue-600
                        flex items-center justify-center
                        text-2xl sm:text-3xl
                        font-bold
                        shadow-xl
                      "
                    >
                      {getInitial()}
                    </div>

                    <button
                      type="button"
                      className="
                        absolute
                        bottom-0
                        right-0
                        w-8 h-8
                        rounded-full
                        bg-gray-800
                        border border-gray-700
                        flex items-center justify-center
                        text-gray-300
                        hover:text-white
                        hover:bg-gray-700
                        transition
                      "
                      title="Change profile photo"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 7h2l2-3h10l2 3h2a2 2 0 012 2v10a2 2 0 01-2 2H3a2 2 0 01-2-2V9a2 2 0 012-2z"
                        />
                        <circle cx="12" cy="13" r="3" strokeWidth="2" />
                      </svg>
                    </button>
                  </div>

                  {/* User info */}
                  <div className="flex-1 pb-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl sm:text-2xl font-bold">
                        {user.name || user.username}
                      </h2>

                      <span
                        className="
                          px-2.5 py-1
                          text-xs
                          font-medium
                          capitalize
                          rounded-full
                          bg-blue-900/40
                          text-blue-400
                          border border-blue-800
                        "
                      >
                        {user.role || "user"}
                      </span>
                    </div>

                    <p className="text-sm text-gray-400 mt-1">
                      @{user.username}
                    </p>

                    <p className="text-sm text-gray-500 mt-1">{user.email}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Success message */}
            {message && (
              <div
                className="
                  flex items-center gap-3
                  p-4
                  rounded-lg
                  border border-green-800
                  bg-green-900/20
                  text-green-400
                  text-sm
                "
              >
                <svg
                  className="w-5 h-5 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>

                {message}
              </div>
            )}

            {/* Profile Information */}
            <section className="bg-gray-900 border border-gray-800 rounded-xl">
              <div className="px-5 sm:px-8 py-5 border-b border-gray-800">
                <h2 className="text-lg font-semibold">Profile information</h2>

                <p className="text-sm text-gray-400 mt-1">
                  Update your personal information and account details.
                </p>
              </div>

              <form onSubmit={handleSave}>
                <div className="p-5 sm:p-8 space-y-6">
                  {/* Name */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block mb-2 text-sm font-medium text-gray-300"
                    >
                      Full name
                    </label>

                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={!editing}
                      className="
                        w-full
                        px-4 py-3
                        rounded-lg
                        bg-gray-800
                        border border-gray-700
                        text-white
                        placeholder-gray-500
                        outline-none
                        focus:border-blue-500
                        focus:ring-1
                        focus:ring-blue-500
                        disabled:opacity-70
                        disabled:cursor-not-allowed
                        transition
                      "
                    />
                  </div>

                  {/* Username */}
                  <div>
                    <label
                      htmlFor="username"
                      className="block mb-2 text-sm font-medium text-gray-300"
                    >
                      Username
                    </label>

                    <div className="flex">
                      <span
                        className="
                          inline-flex items-center
                          px-4
                          rounded-s-lg
                          border border-e-0
                          border-gray-700
                          bg-gray-800
                          text-gray-500
                        "
                      >
                        @
                      </span>

                      <input
                        id="username"
                        name="username"
                        type="text"
                        value={formData.username}
                        onChange={handleChange}
                        disabled={!editing}
                        className="
                          w-full
                          px-4 py-3
                          rounded-e-lg
                          bg-gray-800
                          border border-gray-700
                          text-white
                          outline-none
                          focus:border-blue-500
                          focus:ring-1
                          focus:ring-blue-500
                          disabled:opacity-70
                          disabled:cursor-not-allowed
                        "
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block mb-2 text-sm font-medium text-gray-300"
                    >
                      Email address
                    </label>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!editing}
                      className="
                        w-full
                        px-4 py-3
                        rounded-lg
                        bg-gray-800
                        border border-gray-700
                        text-white
                        outline-none
                        focus:border-blue-500
                        focus:ring-1
                        focus:ring-blue-500
                        disabled:opacity-70
                        disabled:cursor-not-allowed
                      "
                    />

                    {!user.emailVerified && (
                      <p className="mt-2 text-sm text-yellow-500">
                        Your email address is not verified.
                      </p>
                    )}
                  </div>

                  {/* Buttons */}
                  <div className="flex  sm:flex-row sm:justify-end gap-3 pt-2">
                    {!editing ? (
                      <button
                        type="button"
                        onClick={() => setEditing(true)}
                        className="
                         glassy-icon px-6 shrink-0 border rounded-lg
                        "
                      >
                        Edit profile
                      </button>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={handleCancel}
                          className="
                           glassy-icon px-6 shrink-0 border rounded-lg
                          "
                        >
                          Cancel
                        </button>

                        <button
                          type="submit"
                          disabled={saving}
                          className="                           
                           glassy-icon px-6 shrink-0 border rounded-lg
                          "
                        >
                          {saving ? "Saving..." : "Save changes"}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </form>
            </section>

            {/* Security */}
            <section
              id="security"
              className="bg-gray-900 border border-gray-800 rounded-xl"
            >
              <div className="px-5 sm:px-8 py-5 border-b border-gray-800">
                <h2 className="text-lg font-semibold">Security</h2>

                <p className="text-sm text-gray-400 mt-1">
                  Manage your password and authentication settings.
                </p>
              </div>

              <div className="p-5 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-medium">Password</h3>

                    <p className="text-sm text-gray-500 mt-1">
                      Change your account password.
                    </p>
                  </div>

                  <Link
                    to="/profile/change-password"
                    className="
                      inline-flex
                      justify-center
                      px-4 py-2.5
                      rounded-lg
                      border border-gray-700
                      bg-gray-800
                      hover:bg-gray-700
                      text-sm
                      font-medium
                      text-gray-300
                      transition
                    "
                  >
                    Change password
                  </Link>
                </div>

                <div className="border-t border-gray-800 my-6" />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-medium">Email verification</h3>

                    <p className="text-sm text-gray-500 mt-1">
                      Keep your email address verified to secure your account.
                    </p>
                  </div>

                  {user.emailVerified ? (
                    <span
                      className="
                        inline-flex items-center
                        gap-2
                        w-fit
                        px-3 py-2
                        rounded-lg
                        bg-green-900/30
                        border border-green-800
                        text-green-400
                        text-sm
                      "
                    >
                      <span className="w-2 h-2 rounded-full bg-green-400" />
                      Verified
                    </span>
                  ) : (
                    <button
                      type="button"
                      className="
                        px-4 py-2.5
                        rounded-lg
                        bg-yellow-600
                        hover:bg-yellow-700
                        text-white
                        text-sm
                        font-medium
                      "
                    >
                      Verify email
                    </button>
                  )}
                </div>
              </div>
            </section>

            {/* Account */}
            <section
              id="account"
              className="bg-gray-900 border border-gray-800 rounded-xl"
            >
              <div className="px-5 sm:px-8 py-5 border-b border-gray-800">
                <h2 className="text-lg font-semibold">Account information</h2>

                <p className="text-sm text-gray-400 mt-1">
                  Information about your account and access.
                </p>
              </div>

              <div className="p-5 sm:p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="p-4 rounded-lg bg-gray-800/60 border border-gray-700">
                    <p className="text-xs uppercase tracking-wide text-gray-500">
                      Account role
                    </p>

                    <p className="mt-2 text-sm font-medium capitalize">
                      {user.role || "Viewer"}
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-gray-800/60 border border-gray-700">
                    <p className="text-xs uppercase tracking-wide text-gray-500">
                      Authentication
                    </p>

                    <p className="mt-2 text-sm font-medium capitalize">
                      {user.authProvider || "Email"}
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-gray-800/60 border border-gray-700">
                    <p className="text-xs uppercase tracking-wide text-gray-500">
                      Account status
                    </p>

                    <p className="mt-2 flex items-center gap-2 text-sm font-medium text-green-400">
                      <span className="w-2 h-2 rounded-full bg-green-400" />
                      Active
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-gray-800/60 border border-gray-700">
                    <p className="text-xs uppercase tracking-wide text-gray-500">
                      Email status
                    </p>

                    <p
                      className={`mt - 2 text - sm font - medium ${
                        user.emailVerified
                          ? "text-green-400"
                          : "text-yellow-400"
                      } `}
                    >
                      {user.emailVerified ? "Verified" : "Not verified"}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Danger Zone */}
            <section className="bg-gray-900 border border-red-900/50 rounded-xl">
              <div className="px-5 sm:px-8 py-5 border-b border-red-900/50">
                <h2 className="text-lg font-semibold text-red-400">
                  Danger zone
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Actions in this section may affect your account permanently.
                </p>
              </div>

              <div className="p-5 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-medium">Delete account</h3>

                    <p className="text-sm text-gray-500 mt-1">
                      Permanently delete your account and associated data.
                    </p>
                  </div>

                  <button
                    type="button"
                    className="
                      w-full sm:w-auto
                      px-4 py-2.5
                      rounded-lg
                      border border-red-800
                      text-red-400
                      hover:bg-red-900/20
                      text-sm
                      font-medium
                      transition
                    "
                  >
                    Delete account
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
