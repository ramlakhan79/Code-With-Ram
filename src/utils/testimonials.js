const API_URL = import.meta.env.VITE_API_URL;

const getToken = () => {
  return localStorage.getItem("token");
};

export const getTestimonials = async (params = "") => {
  const response = await fetch(
    `${API_URL}/api/testimonials${params ? `?${params}` : ""}`,
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch testimonials");
  }

  return data;
};

export const getTestimonial = async (id) => {
  const response = await fetch(`${API_URL}/api/testimonials/${id}`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch testimonial");
  }

  return data;
};

export const getAdminTestimonials = async () => {
  const token = getToken();

  const response = await fetch(`${API_URL}/api/testimonials/admin/all`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch testimonials");
  }

  return data;
};

export const createTestimonial = async (testimonialData) => {
  const token = getToken();

  const response = await fetch(`${API_URL}/api/testimonials`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(testimonialData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create testimonial");
  }

  return data;
};

export const updateTestimonial = async (id, testimonialData) => {
  const token = getToken();

  const response = await fetch(`${API_URL}/api/testimonials/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(testimonialData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update testimonial");
  }

  return data;
};

export const toggleTestimonialPublish = async (id) => {
  const token = getToken();

  const response = await fetch(`${API_URL}/api/testimonials/${id}/publish`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update testimonial status");
  }

  return data;
};

export const deleteTestimonial = async (id) => {
  const token = getToken();

  const response = await fetch(`${API_URL}/api/testimonials/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete testimonial");
  }

  return data;
};
