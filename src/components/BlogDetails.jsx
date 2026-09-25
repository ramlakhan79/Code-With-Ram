// import { useParams, useNavigate } from "react-router-dom";

// import {
//     ArrowLeft,
//     ArrowRight,
//     Clock,
//     CalendarDays,
//     User,
//     Tag
// } from "lucide-react";

// import { useEffect, useMemo, useState } from "react";

// import DOMPurify from "dompurify";

// import {
//     getArticle,
//     getNextArticle,
//     getPreviousArticle
// } from "../utils/api.js";

// import ArticlePDF from "../components/article/ArticlePDF";

// const createSlugId = text => {
//     return text
//         .toLowerCase()
//         .trim()
//         .replace(/[^a-z0-9\s-]/g, "")
//         .replace(/\s+/g, "-");
// };


// const BlogDetails = () => {

//     const { id } = useParams();

//     const navigate = useNavigate();

//     const [blog, setBlog] = useState(null);

//     const [loading, setLoading] = useState(true);


//     useEffect(() => {

//         const fetchArticle = async () => {

//             try {

//                 setLoading(true);

//                 const data = await getArticle(id);

//                 setBlog(
//                     data.article || data
//                 );

//             } catch (error) {

//                 console.error(
//                     "Error fetching article:",
//                     error
//                 );

//                 setBlog(null);

//             } finally {

//                 setLoading(false);

//             }
//         };

//         fetchArticle();

//     }, [id]);


//     const handleNext = async () => {

//         try {

//             const data =
//                 await getNextArticle(id);

//             const nextArticle =
//                 data.article || data;

//             if (nextArticle?._id) {

//                 navigate(
//                     `/blogs/${nextArticle._id}`
//                 );

//             }

//         } catch (error) {

//             console.error(
//                 "Error fetching next article:",
//                 error
//             );

//         }
//     };


//     const handlePrevious = async () => {

//         try {

//             const data =
//                 await getPreviousArticle(id);

//             const previousArticle =
//                 data.article || data;

//             if (previousArticle?._id) {

//                 navigate(
//                     `/blogs/${previousArticle._id}`
//                 );

//             }

//         } catch (error) {

//             console.error(
//                 "Error fetching previous article:",
//                 error
//             );

//         }
//     };


//     const headings = useMemo(() => {

//         if (!blog?.content) {
//             return [];
//         }

//         const parser =
//             new DOMParser();

//         const doc =
//             parser.parseFromString(
//                 blog.content,
//                 "text/html"
//             );

//         return [
//             ...doc.querySelectorAll(
//                 "h2, h3"
//             )
//         ].map((heading, index) => {

//             const id =
//                 `section-${index}-${createSlugId(
//                     heading.textContent
//                 )}`;

//             return {
//                 id,
//                 text: heading.textContent,
//                 level:
//                     heading.tagName === "H2"
//                         ? 2
//                         : 3
//             };
//         });

//     }, [blog?.content]);


//     const articleContent = useMemo(() => {
//         if (!blog?.content) return "";

//         const parser = new DOMParser();

//         const doc = parser.parseFromString(
//             blog.content,
//             "text/html"
//         );

//         doc.querySelectorAll("h2, h3").forEach(
//             (heading, index) => {
//                 heading.id =
//                     `section-${index}-${createSlugId(
//                         heading.textContent
//                     )}`;
//             }
//         );

//         return DOMPurify.sanitize(
//             doc.body.innerHTML,
//             {
//                 ADD_ATTR: ["id"]
//             }
//         );
//     }, [blog?.content]);


//     const scrollToHeading = id => {

//         const element =
//             document.getElementById(id);

//         if (!element) return;

//         element.scrollIntoView({
//             behavior: "smooth",
//             block: "start"
//         });

//     };


//     if (loading) {

//         return (
//             <div className="loader-container">
//                 <div className="custom-loader"></div>
//             </div>
//         );
//     }
//     // console.log(blog);

//     if (!blog) {

//         return (
//             <div className="min-h-[60vh] flex items-center justify-center">

//                 <div className="text-center">

//                     <h2 className="text-2xl font-semibold text-white">
//                         Blog not found
//                     </h2>

//                     <button
//                         onClick={() => navigate("/blogs")}
//                         className="mt-5 glassy-icon px-5 py-2 border rounded-lg"
//                     >
//                         Back to Blogs
//                     </button>

//                 </div>

//             </div>
//         );
//     }


//     return (

//         <div className="min-h-screen bg-gray-950">

//             <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">


//                 {/* Back */}

//                 <button
//                     onClick={() => navigate("/blogs")}
//                     className="
//                         flex
//                         items-center
//                         gap-2
//                         text-sm
//                         text-gray-500
//                         hover:text-white
//                         transition
//                         mb-8
//                     "
//                 >
//                     <ArrowLeft size={16} />

//                     Back to Blogs
//                 </button>


//                 {/* Header */}

//                 <header className="max-w-4xl mx-auto text-center">


//                     {blog.category && (

//                         <span
//                             className="
//                                 inline-flex
//                                 items-center
//                                 px-3
//                                 py-1
//                                 rounded-full
//                                 bg-blue-500/10
//                                 border
//                                 border-blue-500/20
//                                 text-blue-400
//                                 text-xs
//                                 font-medium
//                                 mb-5
//                             "
//                         >
//                             {blog.category}
//                         </span>

//                     )}


//                     <h1
//                         className="
//                             text-3xl
//                             sm:text-4xl
//                             lg:text-5xl
//                             font-bold
//                             text-white
//                             leading-tight
//                         "
//                     >
//                         {blog.title}
//                     </h1>            

//                     {(blog.excerpt || blog.desc) && (

//                         <p
//                             className="
//                                 mt-5
//                                 text-base
//                                 sm:text-lg
//                                 text-gray-400
//                                 leading-7
//                                 max-w-3xl
//                                 mx-auto
//                             "
//                         >
//                             {blog.excerpt || blog.desc}
//                         </p>

//                     )}


//                     <div
//                         className="
//                             flex
//                             flex-wrap
//                             justify-center
//                             items-center
//                             gap-x-4
//                             gap-y-3
//                             mt-6
//                             text-sm
//                             text-gray-500
//                         "
//                     >

//                         {(blog.createdBy ||
//                             blog.author) && (

//                                 <span className="flex items-center gap-1.5">

//                                     <User size={14} />

//                                     {blog.createdBy ||
//                                         blog.author}

//                                 </span>

//                             )}


//                         {blog.publishedAt && (

//                             <>
//                                 <span>•</span>

//                                 <span className="flex items-center gap-1.5">

//                                     <CalendarDays size={14} />

//                                     {new Date(
//                                         blog.publishedAt
//                                     ).toLocaleDateString(
//                                         "en-US",
//                                         {
//                                             month: "short",
//                                             day: "numeric",
//                                             year: "numeric"
//                                         }
//                                     )}

//                                 </span>
//                             </>

//                         )}


//                         <span>•</span>


//                         <span className="flex items-center gap-1.5">

//                             <Clock size={14} />

//                             {blog.readingTime
//                                 ? `${blog.readingTime} min read`
//                                 : blog.read ||
//                                 "5 min read"}

//                         </span>

//                     </div>

//                 </header>


//                 {/* Cover */}

//                 {(blog.coverImage ||
//                     blog.image) && (

//                         <div className="max-w-5xl mx-auto mt-10">

//                             <img
//                                 src={
//                                     blog.coverImage ||
//                                     blog.image
//                                 }
//                                 alt={blog.title}
//                                 className="
//                                 w-full
//                                 max-h-[520px]
//                                 object-cover
//                                 rounded-2xl
//                                 border
//                                 border-gray-800
//                                 shadow-2xl
//                             "
//                             />

//                         </div>

//                     )}


//                 {/* Article */}

//                 <div className="max-w-5xl mx-auto mt-10">


//                     {/* TOC */}

//                     {headings.length > 0 && (

//                         <aside className="max-w-3xl mx-auto mb-10">

//                             <div
//                                 className="
//                                     bg-gray-900/70
//                                     border
//                                     border-gray-800
//                                     rounded-2xl
//                                     p-5
//                                 "
//                             >

//                                 <h2 className="text-sm font-semibold text-white mb-4">
//                                     Table of Contents
//                                 </h2>


//                                 <div className="space-y-2">

//                                     {headings.map(
//                                         heading => (

//                                             <button
//                                                 key={heading.id}
//                                                 onClick={() =>
//                                                     scrollToHeading(
//                                                         heading.id
//                                                     )
//                                                 }
//                                                 className={`
//                                                     block
//                                                     text-left
//                                                     text-sm
//                                                     text-gray-400
//                                                     hover:text-white
//                                                     transition
//                                                     ${heading.level === 3
//                                                         ? "pl-4"
//                                                         : ""
//                                                     }
//                                                 `}
//                                             >
//                                                 {heading.text}
//                                             </button>

//                                         )
//                                     )}

//                                 </div>

//                             </div>

//                         </aside>

//                     )}


//                     {/* Content */}

//                     <article
//                         className="
//                             article-content
//                             max-w-3xl
//                             mx-auto

//                             prose
//                             prose-invert
//                             prose-lg
//                             max-w-none

//                             text-gray-300

//                             prose-headings:text-white
//                             prose-headings:font-bold
//                             prose-headings:scroll-mt-24

//                             prose-h2:text-2xl
//                             prose-h2:mt-14
//                             prose-h2:mb-5

//                             prose-h3:text-xl
//                             prose-h3:mt-10
//                             prose-h3:mb-4

//                             prose-p:text-gray-300
//                             prose-p:leading-8
//                             prose-p:my-5

//                             prose-strong:text-white

//                             prose-a:text-blue-400
//                             prose-a:no-underline
//                             hover:prose-a:underline

//                             prose-li:text-gray-300
//                             prose-li:leading-7

//                             prose-blockquote:border-blue-500
//                             prose-blockquote:text-gray-400

//                             prose-code:text-pink-400

//                             prose-pre:bg-gray-900
//                             prose-pre:border
//                             prose-pre:border-gray-800
//                             prose-pre:rounded-xl
//                         "
//                         dangerouslySetInnerHTML={{
//                             __html: articleContent
//                         }}
//                     />


//                     <ArticlePDF
//                         articleId={blog._id}
//                         isLoggedIn={!!User}
//                     />
                    
//                     {/* Tags */}

//                     {blog.tags?.length > 0 && (

//                         <div
//                             className="
//                                 max-w-3xl
//                                 mx-auto
//                                 mt-12
//                                 pt-6
//                                 border-t
//                                 border-gray-800
//                             "
//                         >

//                             <div className="flex items-center gap-2 mb-4">

//                                 <Tag
//                                     size={15}
//                                     className="text-gray-500"
//                                 />

//                                 <span className="text-sm text-gray-400">
//                                     Tags
//                                 </span>

//                             </div>


//                             <div className="flex flex-wrap gap-2">

//                                 {blog.tags.map(
//                                     (tag, index) => (

//                                         <span
//                                             key={index}
//                                             className="
//                                                 px-3
//                                                 py-1.5
//                                                 text-xs
//                                                 rounded-full
//                                                 bg-gray-900
//                                                 border
//                                                 border-gray-800
//                                                 text-gray-400
//                                             "
//                                         >
//                                             #{tag}
//                                         </span>

//                                     )
//                                 )}

//                             </div>

//                         </div>

//                     )}


//                     {/* Navigation */}

//                     <div
//                         className="
//                             max-w-3xl
//                             mx-auto
//                             mt-12
//                             pt-6
//                             border-t
//                             border-gray-800
//                         "
//                     >

//                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">


//                             <button
//                                 onClick={handlePrevious}
//                                 className="
//                                     group
//                                     text-left
//                                     p-5
//                                     rounded-xl
//                                     border
//                                     border-gray-800
//                                     bg-gray-900/50
//                                     hover:bg-gray-900
//                                     hover:border-gray-700
//                                     transition
//                                 "
//                             >

//                                 <span className="text-xs text-gray-500">
//                                     Previous Article
//                                 </span>

//                                 <div className="flex items-center gap-2 mt-2 text-sm font-medium text-white">

//                                     <ArrowLeft
//                                         size={15}
//                                         className="group-hover:-translate-x-1 transition"
//                                     />

//                                     Previous

//                                 </div>

//                             </button>


//                             <button
//                                 onClick={handleNext}
//                                 className="
//                                     group
//                                     text-right
//                                     p-5
//                                     rounded-xl
//                                     border
//                                     border-gray-800
//                                     bg-gray-900/50
//                                     hover:bg-gray-900
//                                     hover:border-gray-700
//                                     transition
//                                 "
//                             >

//                                 <span className="text-xs text-gray-500">
//                                     Next Article
//                                 </span>

//                                 <div className="flex items-center justify-end gap-2 mt-2 text-sm font-medium text-white">

//                                     Next

//                                     <ArrowRight
//                                         size={15}
//                                         className="group-hover:translate-x-1 transition"
//                                     />

//                                 </div>

//                             </button>

//                         </div>

//                     </div>

//                 </div>

//             </div>

//         </div>
//     );
// };


// export default BlogDetails;




import { useParams, useNavigate } from "react-router-dom";

import {
    ArrowLeft,
    ArrowRight,
    Clock,
    CalendarDays,
    User,
    Tag,
    Heart,
    MessageCircle,
    Share2,
    Eye,
    Copy,
    Check,
    Send,
    Github,
    Linkedin,
    Twitter
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";

import DOMPurify from "dompurify";

import {
    getArticle,
    getNextArticle,
    getPreviousArticle,
    likeArticle,
    getArticleComments,
    addArticleComment
} from "../utils/api";

import ArticlePDF from "../components/article/ArticlePDF";

const API_URL = import.meta.env.VITE_API_URL;

const createSlugId = text => {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");
};


const BlogDetails = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);

    const [user, setUser] = useState(null);

    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);

    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState("");

    const [commentLoading, setCommentLoading] = useState(false);
    const [likeLoading, setLikeLoading] = useState(false);

    const [copied, setCopied] = useState(false);
    const [shareOpen, setShareOpen] = useState(false);


    /*
    |--------------------------------------------------------------------------
    | Load logged-in user
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        try {

            const storedUser =
                localStorage.getItem("user");

            if (storedUser) {

                const parsedUser =
                    JSON.parse(storedUser);

                setUser(parsedUser);

            }

        } catch (error) {

            console.error(
                "Unable to read logged-in user:",
                error
            );

        }

    }, []);

    /*
    |--------------------------------------------------------------------------
    | Fetch Article
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        const fetchArticle = async () => {

            try {

                setLoading(true);

                const data =
                    await getArticle(id);
                
                const article =
                    data.article || data;

                setBlog(article);

                setLiked(data.article.isLiked);
                setLikeCount(data.article.likesCount);

            } catch (error) {

                console.error(
                    "Error fetching article:",
                    error
                );

                setBlog(null);

            } finally {

                setLoading(false);

            }

        };

        fetchArticle();

    }, [id]);


    /*
    |--------------------------------------------------------------------------
    | Fetch Comments
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        const fetchComments = async () => {

            try {

                const data =
                    await getArticleComments(id);

                setComments(
                    data.comments ||
                    data ||
                    []
                );

            } catch (error) {

                console.error(
                    "Error fetching comments:",
                    error
                );

            }

        };

        fetchComments();

    }, [id]);

    /*
    |--------------------------------------------------------------------------
    | Like Article
    |--------------------------------------------------------------------------
    */

    const handleLike = async () => {

        if (!user) {

            navigate(
                `/login?redirect=/blogs/${id}`
            );

            return;

        }

        if (likeLoading) return;

        try {

            setLikeLoading(true);

            const data =
                await likeArticle(id);

            setLiked(
                data.liked ??
                !liked
            );

            setLikeCount(
                data.likesCount ??
                likeCount +
                (data.liked ? 1 : -1)
            );

        } catch (error) {

            console.error(
                "Like error:",
                error
            );

        } finally {

            setLikeLoading(false);

        }

    };


    /*
    |--------------------------------------------------------------------------
    | Add Comment
    |--------------------------------------------------------------------------
    */

    const handleComment = async e => {

        e.preventDefault();

        if (!user) {

            navigate(
                `/login?redirect=/blogs/${id}`
            );

            return;

        }

        if (!commentText.trim()) return;

        try {

            setCommentLoading(true);

            const data =
                await addArticleComment(
                    id,
                    {
                        content:
                            commentText.trim()
                    }
                );

            const newComment =
                data.comment ||
                data;

            setComments(prev => [
                newComment,
                ...prev
            ]);

            setCommentText("");

        } catch (error) {

            console.error(
                "Comment error:",
                error
            );

        } finally {

            setCommentLoading(false);

        }

    };

    const handleDeleteComment = async (commentId) => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `${API_URL}/api/articles/comments/${commentId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            setComments((prev) =>
                prev.filter(
                    (comment) => comment._id !== commentId
                )
            );
        } catch (error) {
            console.error("Delete comment error:", error);
        }
    };

    const handleHideComment = async (commentId) => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `${API_URL}/api/articles/comments/${commentId}/hide`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            setComments((prev) =>
                prev.filter(
                    (comment) => comment._id !== commentId
                )
            );
        } catch (error) {
            console.error("Hide comment error:", error);
        }
    };

    const handleUnhideComment = async (commentId) => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `${API_URL}/api/articles/comments/${commentId}/unhide`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            setComments((prev) =>
                prev.map((comment) =>
                    comment._id === commentId
                        ? {
                            ...comment,
                            hidden: false,
                        }
                        : comment
                )
            );
        } catch (error) {
            console.error("Unhide comment error:", error);
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Share Article
    |--------------------------------------------------------------------------
    */

    const handleCopyLink = async () => {

        try {

            await navigator.clipboard.writeText(
                window.location.href
            );

            setCopied(true);

            setTimeout(() => {
                setCopied(false);
            }, 2000);

        } catch (error) {

            console.error(
                "Copy link error:",
                error
            );

        }

    };


    /*
    |--------------------------------------------------------------------------
    | Navigation
    |--------------------------------------------------------------------------
    */

    const handleNext = async () => {

        try {

            const data =
                await getNextArticle(id);

            const nextArticle =
                data.article || data;

            if (nextArticle?._id) {

                navigate(
                    `/blogs/${nextArticle._id}`
                );

            }

        } catch (error) {

            console.error(
                "Error fetching next article:",
                error
            );

        }

    };


    const handlePrevious = async () => {

        try {

            const data =
                await getPreviousArticle(id);

            const previousArticle =
                data.article || data;

            if (previousArticle?._id) {

                navigate(
                    `/blogs/${previousArticle._id}`
                );

            }

        } catch (error) {

            console.error(
                "Error fetching previous article:",
                error
            );

        }

    };


    /*
    |--------------------------------------------------------------------------
    | Table of Contents
    |--------------------------------------------------------------------------
    */

    const headings = useMemo(() => {

        if (!blog?.content) {
            return [];
        }

        const parser =
            new DOMParser();

        const doc =
            parser.parseFromString(
                blog.content,
                "text/html"
            );

        return [
            ...doc.querySelectorAll(
                "h2, h3"
            )
        ].map((heading, index) => {

            const headingId =
                `section-${index}-${createSlugId(
                    heading.textContent
                )}`;

            return {
                id: headingId,
                text: heading.textContent,
                level:
                    heading.tagName === "H2"
                        ? 2
                        : 3
            };

        });

    }, [blog?.content]);


    /*
    |--------------------------------------------------------------------------
    | Article HTML
    |--------------------------------------------------------------------------
    */

    const articleContent = useMemo(() => {

        if (!blog?.content) {
            return "";
        }

        const parser =
            new DOMParser();

        const doc =
            parser.parseFromString(
                blog.content,
                "text/html"
            );


        doc.querySelectorAll(
            "h2, h3"
        ).forEach(
            (heading, index) => {

                heading.id =
                    `section-${index}-${createSlugId(
                        heading.textContent
                    )}`;

            }
        );


        /*
         * Add language class to code blocks
         */

        doc.querySelectorAll(
            "pre code"
        ).forEach(code => {

            if (
                !code.classList.contains(
                    "language-javascript"
                ) &&
                !code.classList.contains(
                    "language-js"
                ) &&
                !code.classList.contains(
                    "language-java"
                ) &&
                !code.classList.contains(
                    "language-cpp"
                ) &&
                !code.classList.contains(
                    "language-python"
                )
            ) {

                code.classList.add(
                    "language-javascript"
                );

            }

        });


        return DOMPurify.sanitize(
            doc.body.innerHTML,
            {
                ADD_ATTR: [
                    "id",
                    "class",
                    "target",
                    "rel"
                ]
            }
        );

    }, [blog?.content]);


    /*
    |--------------------------------------------------------------------------
    | Scroll to Heading
    |--------------------------------------------------------------------------
    */

    const scrollToHeading = headingId => {

        const element =
            document.getElementById(
                headingId
            );

        if (!element) return;

        element.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    };


    /*
    |--------------------------------------------------------------------------
    | Author
    |--------------------------------------------------------------------------
    */

    const author =
        blog?.authorDetails ||
        blog?.createdByUser ||
        blog?.authorData ||
        null;

    const authorName =
        author?.name ||
        blog?.createdBy ||
        blog?.author ||
        "Anonymous";

    const authorUsername =
        author?.username ||
        "";

    const authorImage =
        author?.profileImage ||
        author?.avatar ||
        author?.image ||
        author?.photo ||
        null;


    /*
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */

    if (loading) {

        return (
            <div className="loader-container">
                <div className="custom-loader"></div>
            </div>
        );

    }


    /*
    |--------------------------------------------------------------------------
    | Not Found
    |--------------------------------------------------------------------------
    */

    if (!blog) {

        return (
            <div className="min-h-[60vh] flex items-center justify-center">

                <div className="text-center">

                    <h2 className="text-2xl font-semibold text-white">
                        Blog not found
                    </h2>

                    <button
                        onClick={() =>
                            navigate("/blogs")
                        }
                        className="
                            mt-5
                            px-5
                            py-2
                            border
                            border-gray-700
                            rounded-lg
                            text-gray-300
                            hover:text-white
                            hover:border-gray-500
                            transition
                        "
                    >
                        Back to Blogs
                    </button>

                </div>

            </div>
        );

    }


    return (

        <div className="min-h-screen bg-gray-950">

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">


                {/* =========================================================
                    BACK
                ========================================================= */}

                <button
                    onClick={() =>
                        navigate("/blogs")
                    }
                    className="
                        flex
                        items-center
                        gap-2
                        text-sm
                        text-gray-500
                        hover:text-white
                        transition
                        mb-8
                    "
                >

                    <ArrowLeft size={16} />

                    Back to Blogs

                </button>


                {/* =========================================================
                    ARTICLE HEADER
                ========================================================= */}

                <header className="max-w-4xl mx-auto text-center">

                    {blog.category && (

                        <span
                            className="
                                inline-flex
                                items-center
                                px-3
                                py-1
                                rounded-full
                                bg-blue-500/10
                                border
                                border-blue-500/20
                                text-blue-400
                                text-xs
                                font-medium
                                mb-5
                            "
                        >
                            {blog.category}
                        </span>

                    )}


                    <h1
                        className="
                            text-5
                            sm:text-4xl
                            lg:text-5xl
                            font-bold
                            text-white
                            leading-tight
                        "
                    >
                        {blog.title}
                    </h1>


                    {(blog.excerpt || blog.desc) && (

                        <p
                            className="
                                mt-5
                                text-base
                                sm:text-lg
                                text-gray-400
                                leading-7
                                max-w-3xl
                                mx-auto
                            "
                        >
                            {blog.excerpt ||
                                blog.desc}
                        </p>

                    )}


                    {/* Metadata */}

                    <div
                        className="
                            flex
                            flex-wrap
                            justify-center
                            items-center
                            gap-x-4
                            gap-y-3
                            mt-6
                            text-sm
                            text-gray-500
                        "
                    >

                        <span className="flex items-center gap-1.5">

                            <User size={14} />

                            {authorName}

                        </span>


                        {blog.publishedAt && (

                            <>
                                <span>•</span>

                                <span className="flex items-center gap-1.5">

                                    <CalendarDays
                                        size={14}
                                    />

                                    {new Date(
                                        blog.publishedAt
                                    ).toLocaleDateString(
                                        "en-US",
                                        {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric"
                                        }
                                    )}

                                </span>
                            </>

                        )}


                        <span>•</span>

                        <span className="flex items-center gap-1.5">

                            <Clock size={14} />

                            {blog.readingTime
                                ? `${blog.readingTime} min read`
                                : blog.read ||
                                "5 min read"}

                        </span>


                        <span>•</span>

                        <span className="flex items-center gap-1.5">

                            <Eye size={14} />

                            {blog.views ??
                                blog.viewCount ??
                                0} views

                        </span>

                    </div>

                </header>


                {/* =========================================================
                    COVER IMAGE
                ========================================================= */}

                {(blog.coverImage ||
                    blog.image) && (

                        <div className="max-w-5xl mx-auto mt-10">

                            <img
                                src={
                                    blog.coverImage ||
                                    blog.image
                                }
                                alt={blog.title}
                                className="
                                w-full
                                max-h-[560px]
                                object-cover
                                rounded-2xl
                                border
                                border-gray-800
                                shadow-2xl
                            "
                            />

                        </div>

                    )}


                {/* =========================================================
                    ACTION BAR
                ========================================================= */}

                <div
                    className="
                        max-w-3xl
                        mx-auto
                        mt-8
                        flex
                        flex-wrap
                        items-center
                        justify-between
                        gap-4
                        p-4
                        rounded-2xl
                        bg-gray-900/70
                        border
                        border-gray-800
                        backdrop-blur
                    "
                >

                    <div className="flex items-center gap-3">

                        {/* LIKE */}

                        <button
                            onClick={handleLike}
                            disabled={likeLoading}
                            className={`
                                flex
                                items-center
                                gap-2
                                px-4
                                py-2.5
                                rounded-xl
                                border
                                transition
                                ${liked
                                    ? "bg-red-500/10 border-red-500/30 text-red-400"
                                    : "bg-gray-800/70 border-gray-700 text-gray-300 hover:text-red-400 hover:border-red-500/30"
                                }
                            `}
                        >

                            <Heart
                                size={18}
                                fill={
                                    liked
                                        ? "currentColor"
                                        : "none"
                                }
                            />

                            <span>
                                {likeCount}
                            </span>

                        </button>
                       

                        {/* COMMENTS */}

                        <button
                            onClick={() => {

                                document
                                    .getElementById(
                                        "comments"
                                    )
                                    ?.scrollIntoView({
                                        behavior:
                                            "smooth"
                                    });

                            }}
                            className="
                                flex
                                items-center
                                gap-2
                                px-4
                                py-2.5
                                rounded-xl
                                border
                                border-gray-700
                                bg-gray-800/70
                                text-gray-300
                                hover:text-blue-400
                                hover:border-blue-500/30
                                transition
                            "
                        >

                            <MessageCircle
                                size={18}
                            />

                            <span>
                                {comments.length}
                            </span>

                        </button>

                    </div>


                    {/* SHARE */}

                    <div className="relative">

                        <button
                            onClick={() =>
                                setShareOpen(
                                    prev => !prev
                                )
                            }
                            className="
                                flex
                                items-center
                                gap-2
                                px-4
                                py-2.5
                                rounded-xl
                                border
                                border-gray-700
                                bg-gray-800/70
                                text-gray-300
                                hover:text-white
                                transition
                            "
                        >

                            <Share2 size={17} />

                            Share

                        </button>


                        {shareOpen && (

                            <div
                                className="
                                    absolute
                                    right-0
                                    top-14
                                    z-30
                                    w-52
                                    p-2
                                    rounded-xl
                                    bg-gray-900
                                    border
                                    border-gray-700
                                    shadow-2xl
                                "
                            >

                                <button
                                    onClick={
                                        handleCopyLink
                                    }
                                    className="
                                        w-full
                                        flex
                                        items-center
                                        gap-3
                                        px-3
                                        py-2.5
                                        rounded-lg
                                        text-sm
                                        text-gray-300
                                        hover:bg-gray-800
                                        hover:text-white
                                    "
                                >

                                    {copied
                                        ? <Check size={16} />
                                        : <Copy size={16} />
                                    }

                                    {copied
                                        ? "Copied"
                                        : "Copy link"}

                                </button>

                            </div>

                        )}

                    </div>

                </div>


                {/* =========================================================
                    AUTHOR CARD
                ========================================================= */}

                {/* <div
                    className="
                        max-w-3xl
                        mx-auto
                        mt-8
                        p-5
                        sm:p-6
                        rounded-2xl
                        bg-gray-900/70
                        border
                        border-gray-800
                    "
                >

                    <div className="flex items-center gap-4">

                        {authorImage ? (

                            <img
                                src={authorImage}
                                alt={authorName}
                                className="
                                    w-16
                                    h-16
                                    rounded-full
                                    object-cover
                                    border
                                    border-gray-700
                                "
                            />

                        ) : (

                            <div
                                className="
                                    w-16
                                    h-16
                                    rounded-full
                                    bg-gradient-to-br
                                    from-blue-500
                                    to-purple-600
                                    flex
                                    items-center
                                    justify-center
                                    text-white
                                    text-xl
                                    font-bold
                                "
                            >
                                {authorName
                                    .charAt(0)
                                    .toUpperCase()}
                            </div>

                        )}


                        <div>

                            <p className="text-xs text-gray-500">
                                Written by
                            </p>

                            <h3 className="text-lg font-semibold text-white">
                                {authorName}
                            </h3>

                            {authorUsername && (

                                <p className="text-sm text-gray-500">
                                    @{authorUsername}
                                </p>

                            )}

                        </div>

                    </div>

                </div> */}


                {/* =========================================================
                    ARTICLE
                ========================================================= */}

                <div className="max-w-5xl mx-auto mt-10">


                    {/* TABLE OF CONTENTS */}

                    {headings.length > 0 && (

                        <aside className="max-w-3xl mx-auto mb-10">

                            <div
                                className="
                                    bg-gray-900/70
                                    border
                                    border-gray-800
                                    rounded-2xl
                                    p-5
                                "
                            >

                                <h2 className="text-sm font-semibold text-white mb-4">
                                    Table of Contents
                                </h2>

                                <div className="space-y-2">

                                    {headings.map(
                                        heading => (

                                            <button
                                                key={
                                                    heading.id
                                                }
                                                onClick={() =>
                                                    scrollToHeading(
                                                        heading.id
                                                    )
                                                }
                                                className={`
                                                    block
                                                    text-left
                                                    text-sm
                                                    text-gray-400
                                                    hover:text-white
                                                    transition
                                                    ${heading.level === 3
                                                        ? "pl-4"
                                                        : ""
                                                    }
                                                `}
                                            >
                                                {
                                                    heading.text
                                                }
                                            </button>

                                        )
                                    )}

                                </div>

                            </div>

                        </aside>

                    )}


                    {/* =====================================================
                        CONTENT
                    ===================================================== */}

                    <article
                        className="
                            article-content
                            max-w-3xl
                            mx-auto
                            prose
                            prose-invert
                            prose-lg
                            max-w-none
                            text-gray-300

                            prose-headings:text-white
                            prose-headings:font-bold
                            prose-headings:scroll-mt-24

                            prose-h2:text-2xl
                            prose-h2:mt-14
                            prose-h2:mb-5

                            prose-h3:text-xl
                            prose-h3:mt-10
                            prose-h3:mb-4

                            prose-p:text-gray-300
                            prose-p:leading-8
                            prose-p:my-5

                            prose-strong:text-white

                            prose-a:text-blue-400
                            prose-a:no-underline
                            hover:prose-a:underline

                            prose-li:text-gray-300
                            prose-li:leading-7

                            prose-blockquote:border-blue-500
                            prose-blockquote:text-gray-400
                        "
                        dangerouslySetInnerHTML={{
                            __html:
                                articleContent
                        }}
                        
                    />
                    

                    {/* =====================================================
                        PDF
                    ===================================================== */}

                    <ArticlePDF
                        articleId={blog._id}
                        isLoggedIn={!!user}
                    />


                    {/* =====================================================
                        TAGS
                    ===================================================== */}

                    {blog.tags?.length > 0 && (

                        <div
                            className="
                                max-w-3xl
                                mx-auto
                                mt-12
                                pt-6
                                border-t
                                border-gray-800
                            "
                        >

                            <div className="flex items-center gap-2 mb-4">

                                <Tag
                                    size={15}
                                    className="text-gray-500"
                                />

                                <span className="text-sm text-gray-400">
                                    Tags
                                </span>

                            </div>


                            <div className="flex flex-wrap gap-2">

                                {blog.tags.map(
                                    (tag, index) => (

                                        <span
                                            key={index}
                                            className="
                                                px-3
                                                py-1.5
                                                text-xs
                                                rounded-full
                                                bg-gray-900
                                                border
                                                border-gray-800
                                                text-gray-400
                                            "
                                        >
                                            #{tag}
                                        </span>

                                    )
                                )}

                            </div>

                        </div>

                    )}


                    {/* =====================================================
                        COMMENTS
                    ===================================================== */}

                    <section
                        id="comments"
                        className="
                            max-w-3xl
                            mx-auto
                            mt-5
                            pt-2
                            border-t
                            border-gray-800
                        "
                    >

                        <div className="flex items-center justify-between mb-6">

                            <div>

                                <h2 className="text-2xl font-bold text-white">
                                    Comments
                                </h2>

                                <p className="text-sm text-gray-500 mt-1">
                                    {comments.length}{" "}
                                    {comments.length === 1
                                        ? "comment"
                                        : "comments"}
                                </p>

                            </div>

                            <MessageCircle
                                className="text-gray-600"
                                size={22}
                            />

                        </div>


                        {/* COMMENT FORM */}

                        {user ? (

                            <form
                                onSubmit={
                                    handleComment
                                }
                                className="
                                    p-4
                                    rounded-2xl
                                    bg-gray-900/70
                                    border
                                    border-gray-800
                                "
                            >

                                <div className="flex gap-3">

                                    {user.profileImage ||
                                        user.avatar ? (

                                        <img
                                            src={
                                                user.profileImage ||
                                                user.avatar
                                            }
                                            alt={
                                                user.name ||
                                                user.username
                                            }
                                            className="
                                                w-10
                                                h-10
                                                rounded-full
                                                object-cover
                                            "
                                        />

                                    ) : (

                                        <div
                                            className="
                                                w-10
                                                h-10
                                                rounded-full
                                                bg-blue-600
                                                flex
                                                items-center
                                                justify-center
                                                text-white
                                                font-semibold
                                            "
                                        >
                                            {(
                                                user.name ||
                                                user.username ||
                                                "U"
                                            )
                                                .charAt(0)
                                                .toUpperCase()}
                                        </div>

                                    )}


                                    <div className="flex-1">

                                        <textarea
                                            value={
                                                commentText
                                            }
                                            onChange={e =>
                                                setCommentText(
                                                    e.target.value
                                                )
                                            }
                                            rows={4}
                                            placeholder="Write a comment..."
                                            className="
                                                w-full
                                                resize-none
                                                bg-gray-950
                                                border
                                                border-gray-800
                                                rounded-xl
                                                px-4
                                                py-3
                                                text-sm
                                                text-white
                                                placeholder-gray-600
                                                outline-none
                                                focus:border-blue-500/50
                                            "
                                        />

                                        <div className="flex justify-end mt-3">

                                            <button
                                                type="submit"
                                                disabled={
                                                    commentLoading ||
                                                    !commentText.trim()
                                                }
                                                className="
                                                    flex
                                                    items-center
                                                    gap-2
                                                    px-4
                                                    py-2
                                                    rounded-lg
                                                    bg-blue-600
                                                    hover:bg-blue-500
                                                    disabled:opacity-40
                                                    disabled:cursor-not-allowed
                                                    text-white
                                                    text-sm
                                                    transition
                                                "
                                            >

                                                <Send
                                                    size={15}
                                                />

                                                {commentLoading
                                                    ? "Posting..."
                                                    : "Comment"}

                                            </button>

                                        </div>

                                    </div>

                                </div>

                            </form>

                        ) : (

                            <div
                                className="
                                    p-6
                                    rounded-2xl
                                    bg-gray-900/70
                                    border
                                    border-gray-800
                                    text-center
                                "
                            >

                                <MessageCircle
                                    size={30}
                                    className="
                                        mx-auto
                                        text-gray-600
                                        mb-3
                                    "
                                />

                                <h3 className="text-white font-semibold">
                                    Join the conversation
                                </h3>

                                <p className="text-sm text-gray-500 mt-1">
                                    Login to like this article and
                                    leave a comment.
                                </p>

                                <button
                                    onClick={() =>
                                        navigate(
                                            `/login?redirect=/blogs/${id}`
                                        )
                                    }
                                    className="
                                        mt-4
                                        px-5
                                        py-2.5
                                        rounded-lg
                                        bg-blue-600
                                        hover:bg-blue-500
                                        text-white
                                        text-sm
                                        transition
                                    "
                                >
                                    Login to comment
                                </button>

                            </div>

                        )}


                        {/* COMMENTS LIST */}

                        <div className="mt-8 space-y-5">

                            {comments.length === 0 ? (

                                <div
                                    className="
                                        py-10
                                        text-center
                                        text-gray-600
                                        text-sm
                                    "
                                >
                                    No comments yet.
                                    Be the first to comment.
                                </div>

                            ) : (

                                comments.map(
                                    comment => (

                                        <div
                                            key={
                                                comment._id
                                            }
                                            className="
                                                flex
                                                gap-3
                                                p-4
                                                rounded-xl
                                                bg-gray-900/40
                                                border
                                                border-gray-800
                                            "
                                        >

                                            {comment.user
                                                ?.profileImage ||
                                                comment.user
                                                    ?.avatar ? (

                                                <img
                                                    src={
                                                        comment.user
                                                            .profileImage ||
                                                        comment.user
                                                            .avatar
                                                    }
                                                    alt={
                                                        comment.user
                                                            ?.name ||
                                                        "User"
                                                    }
                                                    className="
                                                        w-10
                                                        h-10
                                                        rounded-full
                                                        object-cover
                                                        flex-shrink-0
                                                    "
                                                />

                                            ) : (

                                                <div
                                                    className="
                                                        w-10
                                                        h-10
                                                        rounded-full
                                                        bg-gray-800
                                                        flex
                                                        items-center
                                                        justify-center
                                                        text-gray-300
                                                        font-semibold
                                                        flex-shrink-0
                                                    "
                                                >
                                                    {(
                                                        comment.user
                                                            ?.name ||
                                                        comment.user
                                                            ?.username ||
                                                        "U"
                                                    )
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </div>

                                            )}


                                            <div className="flex-1">

                                                <div className="flex flex-wrap items-center gap-2">

                                                    <span className="text-sm font-semibold text-white">
                                                        {
                                                            comment.user
                                                                ?.name ||
                                                            comment.user
                                                                ?.username ||
                                                            "User"
                                                        }
                                                    </span>

                                                    {comment.createdAt && (

                                                        <span className="text-xs text-gray-600">

                                                            {new Date(
                                                                comment.createdAt
                                                            ).toLocaleDateString(
                                                                "en-US",
                                                                {
                                                                    month: "short",
                                                                    day: "numeric",
                                                                    year: "numeric"
                                                                }
                                                            )}

                                                        </span>

                                                    )}

                                                </div>


                                                <p className="text-sm text-gray-400 leading-6 mt-2 whitespace-pre-wrap">
                                                    {
                                                        comment.content
                                                    }
                                                </p>

                                            </div>
                                            <div className="flex flex-wrap items-center gap-3">
                                                                                    
                                                {(comment.user?._id === user?._id || user?.role === "admin"  ) && (
                                                    <button
                                                        onClick={() => handleDeleteComment(comment._id)}
                                                        className="rounded-lg  px-4 py-2 text-7 font-thin text-white transition hover:bg-neutGray-400 disabled:cursor-not-allowed disabled:opacity-30"
                                                    >
                                                       Delete
                                                    </button>
                                                 )}
                                                {user?.role === "admin" && !comment.hidden && (
                                                    <button
                                                        onClick={() => handleHideComment(comment._id)}
                                                        className="rounded-lg  px-4 py-2 text-7 font-thin text-white transition hover:bg-neutGray-400 disabled:cursor-not-allowed disabled:opacity-30"
                                                    >
                                                        Hide
                                                    </button>
                                                )}
                                                {user?.role === "admin" && comment.hidden && (
                                                    <button
                                                        onClick={() => handleUnhideComment(comment._id)}
                                                        className="rounded-lg  px-4 py-2 text-7 font-thin text-white transition hover:bg-neutGray-400 disabled:cursor-not-allowed disabled:opacity-30"
                                                    >
                                                        Unhide
                                                    </button>
                                                )}
                                            </div>
                                            
                                        </div>

                                    )
                                )

                            )}

                        </div>

                    </section>


                    {/* =====================================================
                        NAVIGATION
                    ===================================================== */}

                    <div
                        className="
                            max-w-3xl
                            mx-auto
                            mt-16
                            pt-6
                            border-t
                            border-gray-800
                        "
                    >

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                            <button
                                onClick={
                                    handlePrevious
                                }
                                className="
                                    group
                                    text-left
                                    p-5
                                    rounded-xl
                                    border
                                    border-gray-800
                                    bg-gray-900/50
                                    hover:bg-gray-900
                                    hover:border-gray-700
                                    transition
                                "
                            >

                                <span className="text-xs text-gray-500">
                                    Previous Article
                                </span>

                                <div className="flex items-center gap-2 mt-2 text-sm font-medium text-white">

                                    <ArrowLeft
                                        size={15}
                                        className="
                                            group-hover:-translate-x-1
                                            transition
                                        "
                                    />

                                    Previous

                                </div>

                            </button>


                            <button
                                onClick={
                                    handleNext
                                }
                                className="
                                    group
                                    text-right
                                    p-5
                                    rounded-xl
                                    border
                                    border-gray-800
                                    bg-gray-900/50
                                    hover:bg-gray-900
                                    hover:border-gray-700
                                    transition
                                "
                            >

                                <span className="text-xs text-gray-500">
                                    Next Article
                                </span>

                                <div className="flex items-center justify-end gap-2 mt-2 text-sm font-medium text-white">

                                    Next

                                    <ArrowRight
                                        size={15}
                                        className="
                                            group-hover:translate-x-1
                                            transition
                                        "
                                    />

                                </div>

                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

};


export default BlogDetails;