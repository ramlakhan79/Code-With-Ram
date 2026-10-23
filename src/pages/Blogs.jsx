import { useEffect, useState } from "react";

import { Search, Clock, Tag } from "lucide-react";

import { Link } from "react-router-dom";

import { getArticles } from "../utils/api.js";

export default function Blogs() {

    const [blogs, setBlogs] = useState([]);
    const [activeCat, setActiveCat] = useState("All");
    const [search, setSearch] = useState("");
    const [visibleCount, setVisibleCount] = useState(2);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const data = await getArticles();
                const publishedBlogs = data.filter(
                    blog => blog.published && !blog.archived
                );
                setBlogs(publishedBlogs);
            } catch (error) {
                console.error("Failed to fetch blogs:", error);
                setError("Failed to load blogs.");
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    /************** 
     * Show tag based on category selection and search input
     * 
     * 1. Filter blogs based on active category and search input
     * 2. Display filtered blogs with a "Load More" button to show more blogs
     * 3. Handle loading and error states
     **************
     */

    const categories = ["All", ...new Set(blogs.map((b) => b.category).flat())];
    const tags = [...new Set(blogs.map((b) => b.tags).flat())];

     categories.sort((a, b) => {
        if (a === "All") return -1;
        if (b === "All") return 1;
        return a.localeCompare(b);
    });

    // add selection for category and search input to filter blogs


    const filtered = blogs.filter((b) => {
        const matchCat = activeCat === "All" || b.tags.includes(activeCat) || b.category === activeCat;

        const matchSearch =
            b.title.toLowerCase().includes(search.toLowerCase()) ||
            b.desc.toLowerCase().includes(search.toLowerCase());

        return matchCat && matchSearch;
    });

    const loadMore = () => {
        setVisibleCount(prev => prev + 2);
    };
    
   
    return (
        <section className="w-full mt-10 px-mobileBound sm:px-8">

            <div className="mx-auto w-full max-w-6xl flex flex-col gap-8">

                <div className="flex items-center justify-center content-center gap-4">

                    <div className="relative w-full max-w-xl">
                        
                        <input
                            type="text"
                            placeholder="Search blogs..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full border rounded-xl py-3 px-4 pl-12 outline-none focus:border-gray-400 transition"
                        />

                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />

                    </div>
                   
                    {/* <div className="relative w-full max-w-xl">
                        <select
                            value={activeCat}
                            defaultValue={'SAP ABAP'}
                            onChange={(e) => setActiveCat(e.target.value)}
                            className="custom-height-option border rounded-xl outline-none bg-black text-primBlue-400"
                        >
                            {tags.map((category) => (
                                <option
                                    key={category}
                                    value={category}
                                    className="bg-black text-primBlue-400"
                                >
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div> */}

                </div>

                <div className="flex flex-wrap gap-3 justify-center">

                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => {
                                setActiveCat(cat);
                                setVisibleCount(2);
                            }}
                            className={`px-4 py-2 rounded-full border text-sm transition
                            ${activeCat === cat ? "bg-black text-white" : "hover:"}
                            `}
                        >
                            {cat}
                        </button>
                    ))}

                </div>

                {loading && (
                    <div className="loader-container">
                        <div className="custom-loader"></div>
                    </div>
                )}

                {!loading && error && (
                    <p className="text-center text-red-500">
                        {error}
                    </p>
                )}

                {!loading && !error && filtered.length > 0 && (
                    <div className="w-full max-w-[1280px] flex flex-col gap-8">

                        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 mx-auto">

                            {filtered.slice(0, visibleCount).map((blog) => {

                                const isLongDesc = blog.desc.length > 10;

                                return (
                                    <article
                                        key={blog._id}
                                        className="w-full max-w-[330px] mx-auto rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer overflow-hidden border border-gray-200"
                                    >

                                        <div className="p-5">

                                            <h4 className="text-sm md:text-sm lg:text-sm font-semibold text-gray-900 leading-snug mb-2 break-words">
                                                Title: {blog.title}
                                            </h4>

                                            <p className="text-gray-600 text-xs leading-relaxed">
                                                Description:{" "}
                                                {isLongDesc
                                                    ? blog.desc.slice(0, 10) + "..."
                                                    : blog.desc}
                                            </p>

                                            {isLongDesc && (
                                                <Link
                                                    to={`/blogs/${blog.slug}`}
                                                    state={{ blog }}
                                                    className="text-blue-600 text-xs font-medium mt-2 inline-block"
                                                >
                                                    Read More
                                                </Link>
                                            )}

                                            <div className="flex flex-wrap gap-2 mt-4">

                                                {blog.tags.map((t) => (
                                                    <span
                                                        key={t}
                                                        className="flex items-center gap-1 text-[10px] bg-gray-100 text-gray-700 border border-gray-200 rounded-full px-2 py-1"
                                                    >
                                                        <Tag
                                                            size={12}
                                                            className="text-gray-500"
                                                        />

                                                        {t}

                                                    </span>
                                                ))}

                                            </div>

                                        </div>

                                        <div className="px-5 py-4 border-t flex items-center justify-between text-xs text-gray-500">

                                            <span>
                                                {new Date(blog.createdAt).toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric"
                                                })}
                                            </span>

                                            <span className="flex items-center gap-1">

                                                <Clock size={13} />

                                                {blog.read}

                                            </span>

                                        </div>

                                    </article>
                                );
                            })}

                        </div>

                        <div className="flex justify-center mt-4">

                            {visibleCount < filtered.length && (
                                <button
                                    onClick={loadMore}
                                    className="glassy-icon px-6 shrink-0 border rounded-lg"
                                >
                                    Load More
                                </button>
                            )}

                        </div>

                    </div>
                )}

                {!loading && !error && filtered.length === 0 && (
                    <p className="text-center text-gray-500 mt-4">
                        No blogs found.
                    </p>
                )}

            </div>

        </section>
    );
}
