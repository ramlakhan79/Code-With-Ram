const API_URL = import.meta.env.VITE_API_URL;

let blogsCache = null;

export const getArticles = async () => {
  if (blogsCache) {
    // console.log("Using cached blogs");
    return blogsCache;
  }

//   console.log("Fetching blogs from API");

  const response = await fetch(`${API_URL}/api/articles`);

  if (!response.ok) {
    throw new Error("Failed to fetch articles");
  }

  const data = await response.json();

  blogsCache = data.articles;

  return blogsCache;
};

export const getArticle = async (id) => {
 const token = localStorage.getItem("token");

 const response = await fetch(`${API_URL}/api/articles/${id}`, {
   headers: token
     ? {
         Authorization: `Bearer ${token}`,
       }
     : {},
 });

  return response.json();
};

export const getNextArticle = async (id) => {
  const response = await fetch(`${API_URL}/api/articles/${id}/next`);

  if (!response.ok) {
    throw new Error("Failed to fetch next article");
  }

  return response.json();
};

export const getPreviousArticle = async (id) => {
  const response = await fetch(`${API_URL}/api/articles/${id}/previous`);

  if (!response.ok) {
    throw new Error("Failed to fetch previous article");
  }

  return response.json();
};

export const likeArticle = async (articleId) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/api/articles/${articleId}/like`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Unable to like article");
  }

  return response.json();
};

export const getArticleComments = async (articleId) => {
  const response = await fetch(`${API_URL}/api/articles/${articleId}/comments`);

  if (!response.ok) {
    throw new Error("Unable to fetch comments");
  }

  return response.json();
};

export const addArticleComment = async (articleId, comment) => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/api/articles/${articleId}/comments`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",

        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify(comment),
    },
  );

  if (!response.ok) {
    throw new Error("Unable to add comment");
  }

  return response.json();
};
