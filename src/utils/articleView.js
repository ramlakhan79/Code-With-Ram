const API_URL = import.meta.env.VITE_API_URL;

export const incrementArticleView = async (id) => {
  if (!id) {
    throw new Error("Article ID is required");
  }

  const response = await fetch(`${API_URL}/api/articles/${id}/view`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Failed to count article view");
  }

  return data.pendingViews; // Return the updated pending views count
};
