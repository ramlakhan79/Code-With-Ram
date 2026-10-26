// const API_URL = import.meta.env.VITE_API_URL;

// let blogsCache = null;

// export const getArticles = async () => {
//   if (blogsCache) {
//     // console.log("Using cached blogs");
//     return blogsCache;
//   }

// //   console.log("Fetching blogs from API");

//   const response = await fetch(`${API_URL}/api/articles`);

//   if (!response.ok) {
//     throw new Error("Failed to fetch articles");
//   }

//   const data = await response.json();

//   blogsCache = data.articles;

//   return blogsCache;
// };

// export const getArticle = async (id) => {
//  const token = localStorage.getItem("token");

//  const response = await fetch(`${API_URL}/api/articles/${id}`, {
//    headers: token
//      ? {
//          Authorization: `Bearer ${token}`,
//        }
//      : {},
//  });

//   return response.json();
// };

// export const getNextArticle = async (id) => {
//   const response = await fetch(`${API_URL}/api/articles/${id}/next`);

//   if (!response.ok) {
//     throw new Error("Failed to fetch next article");
//   }

//   return response.json();
// };

// export const getPreviousArticle = async (id) => {
//   const response = await fetch(`${API_URL}/api/articles/${id}/previous`);

//   if (!response.ok) {
//     throw new Error("Failed to fetch previous article");
//   }

//   return response.json();
// };

// export const likeArticle = async (articleId) => {
//   const token = localStorage.getItem("token");

//   const response = await fetch(`${API_URL}/api/articles/${articleId}/like`, {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });

//   if (!response.ok) {
//     throw new Error("Unable to like article");
//   }

//   return response.json();
// };

// export const getArticleComments = async (articleId) => {
//   const response = await fetch(`${API_URL}/api/articles/${articleId}/comments`);

//   if (!response.ok) {
//     throw new Error("Unable to fetch comments");
//   }

//   return response.json();
// };

// export const addArticleComment = async (articleId, comment) => {
//   const token = localStorage.getItem("token");

//   const response = await fetch(
//     `${API_URL}/api/articles/${articleId}/comments`,
//     {
//       method: "POST",

//       headers: {
//         "Content-Type": "application/json",

//         Authorization: `Bearer ${token}`,
//       },

//       body: JSON.stringify(comment),
//     },
//   );

//   if (!response.ok) {
//     throw new Error("Unable to add comment");
//   }

//   return response.json();
// };

const API_URL = import.meta.env.VITE_API_URL;

const ARTICLE_CACHE_TTL = 5 * 60 * 1000;

let blogsCache = null;
let blogsCacheTime = 0;

const articleDetailsCache = new Map();

const getToken = () => localStorage.getItem("token");

const isCacheValid = () =>
  blogsCache && Date.now() - blogsCacheTime < ARTICLE_CACHE_TTL;

const findCachedArticle = (identifier) => {
  if (!isCacheValid() || !identifier) return null;

  return (
    blogsCache.find(
      (article) => article._id === identifier || article.slug === identifier,
    ) || null
  );
};

export const invalidateArticlesCache = () => {
  blogsCache = null;
  blogsCacheTime = 0;
  articleDetailsCache.clear();
};

export const getArticles = async (forceRefresh = false) => {
  if (!forceRefresh && isCacheValid()) {
    return blogsCache;
  }

  const response = await fetch(`${API_URL}/api/articles`);

  if (!response.ok) {
    throw new Error("Failed to fetch articles");
  }

  const data = await response.json();

  blogsCache = data.articles || [];
  blogsCacheTime = Date.now();

  return blogsCache;
};

export const getArticle = async (identifier, options = {}) => {
  const { forceRefresh = false } = options;

  const token = getToken();

  // Reuse the cached article detail when available.
  const cachedDetail = articleDetailsCache.get(identifier);

  if (
    !forceRefresh &&
    cachedDetail &&
    cachedDetail.expiresAt > Date.now() &&
    cachedDetail.token === token
  ) {
    return cachedDetail.data;
  }

  // Reuse the complete article list if it contains full content.
  if (!forceRefresh) {
    const cachedArticle = findCachedArticle(identifier);

    if (cachedArticle && typeof cachedArticle.content === "string") {
      // User-specific like status should not be inferred
      // from the public article list.
      const result = {
        article: cachedArticle,
        isLiked: cachedArticle.isLiked ?? false,
        likesCount:
          cachedArticle.likesCount ?? cachedArticle.likes?.length ?? 0,
      };

      // If personalized like status is needed, fetch details
      // instead of using this public-list shortcut.
      if (token) {
        // Continue to the detail request below.
      } else {
        articleDetailsCache.set(identifier, {
          data: result,
          token: null,
          expiresAt: Date.now() + ARTICLE_CACHE_TTL,
        });

        return result;
      }
    }
  }

  const response = await fetch(
    `${API_URL}/api/articles/${encodeURIComponent(identifier)}`,
    {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch article");
  }

  const data = await response.json();

  const article = data.article || data;

  const result = {
    ...data,
    article,
  };

  if (article?._id) {
    articleDetailsCache.set(identifier, {
      data: result,
      token,
      expiresAt: Date.now() + ARTICLE_CACHE_TTL,
    });

    articleDetailsCache.set(article._id, {
      data: result,
      token,
      expiresAt: Date.now() + ARTICLE_CACHE_TTL,
    });

    if (article.slug) {
      articleDetailsCache.set(article.slug, {
        data: result,
        token,
        expiresAt: Date.now() + ARTICLE_CACHE_TTL,
      });
    }
  }

  return result;
};

const getAdjacentArticle = async (identifier, direction) => {
  const articles = await getArticles();

  const currentIndex = articles.findIndex(
    (article) => article._id === identifier || article.slug === identifier,
  );

  if (currentIndex !== -1) {
    const adjacentIndex = currentIndex + direction;
    const adjacentArticle = articles[adjacentIndex];

    if (adjacentArticle) {
      return { article: adjacentArticle };
    }

    return { article: null };
  }

  // Fallback if the current article is not in the list.
  const endpoint = direction === 1 ? "next" : "previous";

  const response = await fetch(
    `${API_URL}/api/articles/${encodeURIComponent(identifier)}/${endpoint}`,
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch ${endpoint} article`);
  }

  return response.json();
};

export const getNextArticle = (identifier) => getAdjacentArticle(identifier, 1);

export const getPreviousArticle = (identifier) =>
  getAdjacentArticle(identifier, -1);

export const likeArticle = async (articleId) => {
  const token = getToken();

  if (!token) {
    throw new Error("Please log in to like this article");
  }

  const response = await fetch(`${API_URL}/api/articles/${articleId}/like`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Unable to like article");
  }

  const data = await response.json();

  // The detail cache may contain an outdated like count.
  articleDetailsCache.clear();

  return data;
};

export const getArticleComments = async (articleId) => {
  const response = await fetch(`${API_URL}/api/articles/${articleId}/comments`);

  if (!response.ok) {
    throw new Error("Unable to fetch comments");
  }

  return response.json();
};

export const addArticleComment = async (articleId, comment) => {
  const token = getToken();

  if (!token) {
    throw new Error("Please log in to comment");
  }

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