import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  getArticles,
  getUsers,
  archiveArticle,
  restoreArticle,
  deleteArticle,
  logoutAdmin,
} from "../utils/admin";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [articles, setArticles] = useState([]);
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(true);

  const [error, setError] = useState("");
  const [usersError, setUsersError] = useState("");

  const loadArticles = async () => {
    try {
      setLoading(true);

      const data = await getArticles();

      setArticles(data.articles || []);
      setError("");
    } catch (error) {
      setError(error.message);

      if (error.message.toLowerCase().includes("token")) {
        logoutAdmin();
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      setUsersLoading(true);

      const data = await getUsers();
      setUsers(data.users || []);
      setUsersError("");
    } catch (error) {
      setUsersError(error.message);

      if (error.message.toLowerCase().includes("token")) {
        logoutAdmin();
        navigate("/login");
      }
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    loadArticles();
    loadUsers();
  }, []);
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const myUsers = users.filter((user) => user.role !== currentUser?.role);
  const handleArchive = async (id) => {
    if (!window.confirm("Archive this article?")) return;

    try {
      await archiveArticle(id);
      await loadArticles();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleRestore = async (id) => {
    try {
      await restoreArticle(id);
      await loadArticles();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this article permanently?")) return;

    try {
      await deleteArticle(id);
      await loadArticles();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    navigate("/login");
  };

  const getRoleClass = (role) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "text-red-400 border-red-500/20 bg-red-500/10";

      case "contributor":
        return "text-blue-400 border-blue-500/20 bg-blue-500/10";

      case "viewer":
        return "text-gray-400 border-gray-500/20 bg-gray-500/10";

      default:
        return "text-gray-400 border-gray-500/20 bg-gray-500/10";
    }
  };

  const getArticlesByUser = (user) => {
    const userId = user._id;

    const userName = user.username || user.name || user.email;

    return articles.filter((article) => {
      const createdBy =
        typeof article.createdBy === "object"
          ? article.createdBy?._id
          : article.createdBy;

      return createdBy === userId || article.createdBy === userName;
    });
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-3 font-bold text-white truncate">
                Admin Dashboard
              </h1>

              <p className="text-gray-400 text-sm mt-1">
                Manage users and blog articles
              </p>
              
            </div>

            <div className="flex flex-col xs:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
              <button
                onClick={() => navigate("/dashboard/articles/create")}
                className="glassy-icon px-4 py-2.5 border rounded-lg"
              >
                + Create Article
              </button>

              <button
                onClick={handleLogout}
                className="glassy-icon px-4 py-2.5 border rounded-lg"
              >
                Logout
              </button>
              <button
                onClick={() => navigate("/profile")}
                className="glassy-icon px-4 py-2.5 border rounded-lg"
              >
                My Profile
              </button>              
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-3 font-bold text-white truncate">Users</h1>

              <p className="text-gray-400 text-sm mt-1">
                Manage registered users and their contributions
              </p>
            </div>
            <div className="flex flex-col xs:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
              <button
                onClick={() => navigate("/admin/users")}
                className="glassy-icon px-4 py-2.5 border rounded-lg"
              >
                Manage Users
              </button>

              <span className="text-sm text-gray-500">
                Total Users: {users.length} users
              </span>

              <Link to="/admin/projects">
                Projects
              </Link>

              <Link to="/admin/testimonials">
                Testimonials
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* ================= USERS ================= */}

        <section className="mb-10">
          <div className="flex items-center justify-between mb-5">
            {/* <div>
              <h2 className="text-xl font-semibold text-white">
                Users
              </h2>
              <button
                onClick={() => navigate("/admin/users")}
                className="glassy-icon px-4 py-2.5 border rounded-lg"
              >
                Manage Users
              </button>

              <p className="text-sm text-gray-500 mt-1">
                Manage registered users and their contributions
              </p>
            </div> */}

            {/* <span className="text-sm text-gray-500">
              {users.length} users
            </span> */}
          </div>

          {usersError && (
            <div className="mb-5 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
              {usersError}
            </div>
          )}

          {usersLoading ? (
            <div className="loader-container">
              <div className="custom-loader"></div>
            </div>
          ) : myUsers.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              No users found.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {myUsers.map((user) => {
                const userArticles = getArticlesByUser(user);

                return (
                  <div
                    key={user._id}
                    className="
                      bg-gray-900
                      border border-gray-800
                      rounded-2xl
                      p-5
                      hover:border-gray-700
                      transition
                    "
                  >
                    {/* User header */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-white truncate">
                          {user.name || user.username || "Unknown User"}
                        </h3>

                        <p className="text-sm text-gray-500 truncate mt-1">
                          {user.email}
                        </p>
                      </div>

                      <span
                        className={`shrink - 0 text - xs px - 2.5 py - 1 rounded - md border ${getRoleClass(
                          user.role,
                        )} `}
                      >
                        {user.role || "Viewer"}
                      </span>
                    </div>

                    {/* User details */}
                    <div className="mt-5 pt-4 border-t border-gray-800 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Articles</span>

                        <span className="text-gray-300">
                          {userArticles.length}
                        </span>
                      </div>

                      {user.createdAt && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Joined</span>

                          <span className="text-gray-400">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* User articles */}
                    {userArticles.length > 0 && (
                      <div className="mt-5 pt-4 border-t border-gray-800">
                        <p className="text-xs text-gray-500 mb-3">
                          Created Articles
                        </p>

                        <div className="space-y-2">
                          {userArticles.slice(0, 3).map((article) => (
                            <button
                              key={article._id}
                              onClick={() =>
                                navigate(
                                  `/dashboard/articles/edit/${article._id}`,
                                )
                              }
                              className="
                                block
                                w-full
                                text-left
                                text-sm
                                text-gray-300
                                hover:text-white
                                truncate
                                transition
                              "
                              title={article.title}
                            >
                              • {article.title}
                            </button>
                          ))}

                          {userArticles.length > 3 && (
                            <p className="text-xs text-gray-600">
                              + {userArticles.length - 3} more articles
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ================= ARTICLES ================= */}

        <section>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-semibold text-white">All Articles</h2>

              <p className="text-sm text-gray-500 mt-1">
                Manage articles created by admin and contributors
              </p>
            </div>

            <span className="text-sm text-gray-500">
              {articles.length} articles
            </span>
          </div>

          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {loading ? (
            <div className="loader-container">
              <div className="custom-loader"></div>
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              No articles found.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {articles.map((article) => (
                <article
                  key={article._id}
                  className="
                    group
                    bg-gray-900
                    border border-gray-800
                    rounded-2xl
                    overflow-hidden
                    hover:border-gray-700
                    transition-all
                    duration-200
                  "
                >
                  {/* Image */}
                  {article.image ? (
                    <div className="h-40 overflow-hidden bg-gray-800">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="
                          w-full
                          h-full
                          object-cover
                          group-hover:scale-105
                          transition-transform
                          duration-300
                        "
                      />
                    </div>
                  ) : (
                    <div className="h-24 bg-gray-800/50 flex items-center justify-center">
                      <span className="text-gray-600 text-sm">No image</span>
                    </div>
                  )}

                  <div className="p-5">
                    {/* Category + Status */}
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <span className="text-xs font-medium text-gray-400 bg-gray-800 px-2.5 py-1 rounded-md">
                        {article.category}
                      </span>

                      {article.archived ? (
                        <span className="text-orange-400 text-xs px-2.5 py-1 rounded-md border border-orange-500/20">
                          Archived
                        </span>
                      ) : article.published ? (
                        <span className="text-emerald-400 text-xs px-2.5 py-1 rounded-md border border-emerald-500/20">
                          Published
                        </span>
                      ) : (
                        <span className="text-amber-400 text-xs px-2.5 py-1 rounded-md border border-amber-500/20">
                          Draft
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3
                      className="text-lg font-semibold text-white"
                      title={article.title}
                    >
                      {article.title}
                    </h3>

                    {/* Description */}
                    {article.desc && (
                      <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                        {article.desc}
                      </p>
                    )}

                    {/* Metadata */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mt-4 text-xs text-gray-500">
                      <span>{article.read || "5 min read"}</span>

                      <span className="text-gray-700">•</span>

                      <span>
                        Updated{" "}
                        {article.updatedAt
                          ? new Date(article.updatedAt).toLocaleDateString()
                          : "-"}
                      </span>
                    </div>

                    {/* Author Information */}
                    {(article.createdBy || article.updatedBy) && (
                      <div className="mt-4 pt-4 border-t border-gray-800 space-y-1">
                        {article.createdBy && (
                          <p className="text-xs text-gray-500">
                            Created by{" "}
                            <span className="text-gray-300">
                              {typeof article.createdBy === "object"
                                ? article.createdBy.name ||
                                  article.createdBy.username ||
                                  article.createdBy.email
                                : article.createdBy}
                            </span>
                          </p>
                        )}

                        {article.updatedBy && (
                          <p className="text-xs text-gray-500">
                            Updated by{" "}
                            <span className="text-gray-300">
                              {typeof article.updatedBy === "object"
                                ? article.updatedBy.name ||
                                  article.updatedBy.username ||
                                  article.updatedBy.email
                                : article.updatedBy}
                            </span>
                          </p>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-5 pt-4 border-t border-gray-800">
                      <button
                        onClick={() =>
                          navigate(`/dashboard/articles/edit/${article._id}`)
                        }
                        className="
                          flex-1
                          text-sm
                          glassy-icon
                          px-3
                          py-2
                          border
                          rounded-lg
                          transition
                        "
                      >
                        Edit
                      </button>

                      {article.archived ? (
                        <button
                          onClick={() => handleRestore(article._id)}
                          className="
                            flex-1
                            text-sm
                            glassy-icon
                            px-3
                            py-2
                            border
                            rounded-lg
                          "
                        >
                          Restore
                        </button>
                      ) : (
                        <button
                          onClick={() => handleArchive(article._id)}
                          className="
                            flex-1
                            text-sm
                            glassy-icon
                            px-3
                            py-2
                            border
                            rounded-lg
                          "
                        >
                          Archive
                        </button>
                      )}

                      <button
                        onClick={() => handleDelete(article._id)}
                        className="
                          flex-1
                          text-sm
                          text-suppRed-200
                          glassy-icon
                          px-3
                          py-2
                          border
                          rounded-lg
                        "
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
