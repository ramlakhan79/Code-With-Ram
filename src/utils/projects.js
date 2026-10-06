const API_URL = import.meta.env.VITE_API_URL;

const getToken = () => {
  return localStorage.getItem("token");
};

export const getProjects = async (params = "") => {
  const response = await fetch(
    `${API_URL}/api/projects${params ? `?${params}` : ""}`,
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch projects");
  }

  return data;
};

export const getProject = async (id) => {
  const response = await fetch(`${API_URL}/api/projects/${id}`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch project");
  }

  return data;
};

export const getAdminProjects = async () => {
  const token = getToken();

  const response = await fetch(`${API_URL}/api/projects/admin/all`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch projects");
  }

  return data;
};

export const getAdminProject = async (id) => {
  const token = getToken();

  const response = await fetch(`${API_URL}/api/projects/admin/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch project");
  }

  return data;
};

export const createProject = async (projectData) => {
  const token = getToken();

  const response = await fetch(`${API_URL}/api/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(projectData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create project");
  }

  return data;
};

export const updateProject = async (id, projectData) => {
  const token = getToken();

  const response = await fetch(`${API_URL}/api/projects/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(projectData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update project");
  }

  return data;
};

export const toggleProjectPublish = async (id) => {
  const token = getToken();

  const response = await fetch(`${API_URL}/api/projects/${id}/publish`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update project status");
  }

  return data;
};

export const deleteProject = async (id) => {
  const token = getToken();

  const response = await fetch(`${API_URL}/api/projects/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete project");
  }

  return data;
};
