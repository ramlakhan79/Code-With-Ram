const API_URL = import.meta.env.VITE_API_URL;

const getToken = () => {
  return localStorage.getItem("token");
};
const request = async (url, options = {}) => {
  const token = getToken();

  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

export const sendRegistrationOTP = async (
  name,
  username,
  email,
  password,
  confirmPassword,
) => {
  const response = await fetch(`${API_URL}/api/auth/send-registration-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, username, email, password, confirmPassword }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to send OTP");
  }
  return data;
};
export const verifyRegistrationOTP = async (
  name,
  username,
  email,
  password,
  otp,
) => {
  const response = await fetch(`${API_URL}/api/auth/verify-registration-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, username, email, password, otp }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "OTP verification failed");
  }
  return data;
};

export const registerUser = async (name, username, email, password) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/auth/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        username,
        email,
        password,
      }),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Registration failed");
  }

  return data;
};

export const googleLogin = async (credential) => {
  const response = await fetch(`${API_URL}/api/auth/google-login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ credential }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Google login failed");
  }
  return data;
};

export const loginUser = async (identifier, password) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        identifier,
        password,
      }),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data;
};

export const getArticles = async () => {
  return request("/api/articles");
};

export const getArticle = async (id) => {
  return request(`/api/articles/${id}`);
};

export const createArticle = async (article) => {
  return request("/api/articles", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(article),
  });
};

export const uploadArticleCoverImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  const token = getToken();

  const response = await fetch(`${API_URL}/api/articles/upload-cover`, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to upload cover image.");
  }

  return data.image;
};

export const updateArticle = async (id, article) => {
  return request(`/api/articles/${id}`, {
    method: "PUT",
    body: JSON.stringify(article),
  });
};

export const archiveArticle = async (id) => {
  return request(`/api/articles/${id}/archive`, {
    method: "PATCH",
  });
};

export const restoreArticle = async (id) => {
  return request(`/api/articles/${id}/restore`, {
    method: "PATCH",
  });
};

export const deleteArticle = async (id) => {
  return request(`/api/articles/${id}`, {
    method: "DELETE",
  });
};

export const getUsers = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/api/users`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to load users");
  }

  return data;
};

export const logoutAdmin = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
