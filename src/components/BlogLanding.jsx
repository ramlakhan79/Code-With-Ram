import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
    ArrowLeft,
    ArrowRight,
    Search,
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

const topics = [
    "All",
    "DSA",
    "Java",
    "Web Development",
    "SAP ABAP",
    "Tutorials",
];

const getArticleId = (article) => article?._id || article?.id;

const getArticleUrl = (article) =>
    `/blogs/${getArticleId(article)}`;

const formatViews = (views = 0) =>
    `${Number(views || 0).toLocaleString()} views`;

const BlogLanding = ({ articles = [], isLoading = false }) => {
    const [search, setSearch] = useState("");
    const [activeTopic, setActiveTopic] = useState("All");

    const publishedArticles = useMemo(
        () =>
            articles.filter(
                (article) =>
                    article.published !== false &&
                    article.archived !== true
            ),
        [articles]
    );

    const filteredArticles = useMemo(() => {
        const query = search.trim().toLowerCase();

        return publishedArticles.filter((article) => {
            const matchesTopic =
                activeTopic === "All" ||
                article.category?.toLowerCase() ===
                activeTopic.toLowerCase();

            const searchableText = [
                article.title,
                article.desc,
                article.category,
                ...(article.tags || []),
            ]
                .join(" ")
                .toLowerCase();

            return (
                matchesTopic &&
                (!query || searchableText.includes(query))
            );
        });
    }, [publishedArticles, search, activeTopic]);

    const featured = filteredArticles[0];
    const remainingArticles = filteredArticles.slice(1);

    return (
        <main className="min-h-screen text-gray-900 dark:bg-[#1d1f25] dark:text-gray-100">
            {/* Hero */}
            <section className="relative overflow-hidden border-b border-gray-200 dark:border-white/10">
                <div className="pointer-events-none absolute -top-36 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl" />

                <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
                    <div className="mx-auto max-w-3xl text-center">
                        <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-xs font-semibold text-indigo-700 dark:border-indigo-400/20 dark:bg-indigo-400/10 dark:text-indigo-300">
                            <span className="h-2 w-2 rounded-full bg-indigo-500" />
                            A space for curious developers
                        </span>

                        <h1 className="mt-7 text-3 font-extrabold tracking-tight sm:text-sm lg:text-2xl">
                            Learn. Build.
                            <span className="block bg-gradient-to-r from-indigo-500 via-violet-500 to-sky-500 bg-clip-text">
                                Solve. Repeat.
                            </span>
                        </h1>

                        <p className="mx-auto mt-6 max-w-3xl text-8 leading-8 text-gray-600 dark:text-gray-400 sm:text-sm">
                            Practical programming tutorials, coding challenges, developer guides, and lessons from building real-world projects. Learn concepts clearly and put them into practice.
                        </p>
                        <div className="flex items-center justify-center content-center gap-4">
                      
                            <div className="relative w-full max-w-xl">
                               
                                <input
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(event.target.value)
                                    }
                                    placeholder="Search tutorials, topics..."
                                    aria-label="Search articles"
                                    className="w-full text-8 border rounded-xl pl-8 px-2 py-2 outline-none focus:border-gray-400 transition"
                                />
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                        </div>

                            <a
                                href="#latest-articles"
                                className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-3 font-semibold transition hover:bg-indigo-500"
                            >
                                Explore articles
                                <span className="ml-2" aria-hidden="true">
                                    →
                                </span>
                            </a>
                        </div>

                        <div className="mt-6 flex flex-wrap justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                            <span>Explore:</span>
                            <button onClick={() => setActiveTopic("DSA")}>
                                DSA
                            </button>
                            <button onClick={() => setActiveTopic("Java")}>
                                Java
                            </button>
                            <button
                                onClick={() => setActiveTopic("Web Development")}
                            >
                                Web Development
                            </button>
                            <button
                                onClick={() => setActiveTopic("SAP ABAP")}
                            >
                                SAP ABAP
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Topics */}
            <section className="mx-auto max-w-7xl px-5 pt-8 sm:px-8">
                <div className="flex flex-wrap gap-2">
                    {topics.map((topic) => (
                        <button
                            key={topic}
                            onClick={() => setActiveTopic(topic)}
                            aria-pressed={activeTopic === topic}
                            className={`rounded-full px-4 py-2 text-sm transition ${activeTopic === topic
                                    ? "bg-indigo-600 text-white"
                                    : "border border-gray-200 text-gray-600 hover:border-indigo-400 dark:border-white/10 dark:text-gray-300"
                                }`}
                        >
                            {topic}
                        </button>
                    ))}
                </div>
            </section>

            {/* Featured article */}
            <section className="mx-auto max-w-7xl px-5 pt-10 sm:px-8">
                <div className="mb-6">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-500">
                        Editor's picks
                    </p>
                    <h2 className="mt-2 text-sm font-bold sm:text-2xl">
                        Ideas worth exploring.
                    </h2>
                </div>

                {isLoading ? (
                    <p className="py-12 text-gray-500">
                        Loading articles...
                    </p>
                ) : featured ? (
                    <Link
                        to={getArticleUrl(featured)}
                        className="group grid overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 transition hover:border-indigo-400 dark:border-white/10 dark:bg-white/[0.03] md:grid-cols-2"
                    >
                        {featured.image ? (
                            <img
                                src={featured.image}
                                alt={featured.title}
                                className="h-64 w-full object-cover transition duration-500 group-hover:scale-[1.02] md:h-full"
                            />
                        ) : (
                            <div className="flex min-h-32 items-center justify-center bg-gradient-to-br from-indigo-500/20 via-violet-500/10 to-sky-500/20 p-8">
                                <span className="text-2xl font-black text-indigo-500/70">
                                    {"< />"}
                                </span>
                            </div>
                        )}

                        <div className="flex flex-col justify-center p-6 sm:p-10">
                            <span className="text-5 font-bold uppercase tracking-wider text-indigo-500">
                                {featured.category || "Featured article"}
                            </span>

                            <h3 className="mt-4 text-6 font-bold leading-tight sm:text-3xl">
                                {featured.title}
                            </h3>

                            <p className="mt-4 text-8 line-clamp-3 leading-7 text-gray-600 dark:text-gray-400">
                                {featured.desc}
                            </p>

                            <div className="mt-6 flex flex-wrap gap-4 text-xs text-gray-500 dark:text-gray-400">
                                <span className="flex items-center gap-1.5"><Clock size={14} />{featured.read || "5 min read"}</span>
                                <span className="flex items-center gap-1.5"><Eye size={14} />{formatViews(featured.views)}</span>
                            </div>

                            <span className="mt-7 font-semibold text-indigo-600 dark:text-indigo-400">
                                Read article →
                            </span>
                        </div>
                    </Link>
                ) : (
                    <p className="rounded-xl border border-dashed border-gray-300 p-8 text-gray-500 dark:border-white/10">
                        No featured articles yet. Publish an article
                        from your dashboard to get started.
                    </p>
                )}
            </section>

            {/* Latest articles */}
            <section
                id="latest-articles"
                className="mx-auto max-w-7xl px-5 pt-8 sm:px-8 sm:py-20"
            >
                <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-500">
                            Keep learning
                        </p>

                        <h2 className="mt-2 text-3 font-bold sm:text-3xl">
                            Latest articles
                        </h2>

                        <p className="mt-2 text-6 text-gray-500 dark:text-gray-400">
                            Tutorials and ideas to put into practice.
                        </p>
                    </div>

                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        {filteredArticles.length} articles
                    </span>
                </div>

                {isLoading ? (
                    <p className="py-10 text-gray-500">
                        Loading the latest articles...
                    </p>
                ) : filteredArticles.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-gray-300 p-10 text-center dark:border-white/10">
                        <h3 className="font-semibold">No articles found</h3>
                        <p className="mt-2 text-sm text-gray-500">
                            Try another search or select a different topic.
                        </p>
                        <button
                            onClick={() => {
                                setSearch("");
                                setActiveTopic("All");
                            }}
                            className="mt-4 font-semibold text-indigo-500"
                        >
                            Clear filters
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {remainingArticles.map((article) => (
                            <Link
                                key={getArticleId(article)}
                                to={getArticleUrl(article)}
                                className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 transition hover:-translate-y-1 hover:border-indigo-400 hover:shadow-xl hover:shadow-indigo-500/5 dark:border-white/10 dark:bg-white/[0.03]"
                            >
                                {article.image ? (
                                    <img
                                        src={article.image}
                                        alt={article.title}
                                        loading="lazy"
                                        className="h-48 w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-48 items-center justify-center bg-gradient-to-br from-indigo-500/15 to-sky-500/15">
                                        <span className="text-4xl font-black text-indigo-500/60">
                                            {"< />"}
                                        </span>
                                    </div>
                                )}

                                <div className="flex flex-1 flex-col p-5">
                                    <span className="text-xs font-semibold text-indigo-500">
                                        {article.category || "Programming"}
                                    </span>

                                    <h3 className="mt-3 text-7 font-bold leading-snug group-hover:text-indigo-500">
                                        {article.title}
                                    </h3>

                                    <p className="mt-3 line-clamp-3 flex-1 text-8 leading-6 text-gray-600 dark:text-gray-400">
                                        {article.desc}
                                    </p>

                                    <div className="mt-5 flex flex-wrap justify-between gap-2 border-t border-gray-200 pt-4 text-xs text-gray-500 dark:border-white/10 dark:text-gray-400">
                                        <span className="flex items-center gap-1.5">
                                            <Clock size={14} />
                                            {article.read || "5 min read"}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <Eye size={14} />
                                            {formatViews(article.views)}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </section>

            {/* Bottom call to action */}
            <section className="mx-auto max-w-7xl px-5 pb-1 sm:px-8 sm:pb-24">
                <div className="rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-blue-600 px-6 py-4 text-center text-white sm:px-12 sm:py-8">
                    <p className="text-sm font-semibold text-indigo-100">
                        CODE WITH RAM
                    </p>

                    <h2 className="mx-auto mt-4 max-w-2xl text-4 font-extrabold sm:text-sm">
                        Your next breakthrough starts with one article.
                    </h2>

                    <p className="mx-auto mt-4 max-w-xl text-8 leading-7 text-indigo-100">
                        Choose a topic, explore a new concept, and turn
                        what you learn into something real.
                    </p>

                    <a
                        href="#latest-articles"
                        className="mt-8 inline-flex rounded-xl px-6 py-3 font-bold text-indigo-700 transition hover:bg-indigo-50"
                    >
                        Start exploring →
                    </a>
                </div>
            </section>
        </main>
    );
};

export default BlogLanding;