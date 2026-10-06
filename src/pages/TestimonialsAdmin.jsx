import { useEffect, useState } from "react";
import {
    getAdminTestimonials,
    deleteTestimonial,
    toggleTestimonialPublish,
} from "../utils/testimonials";
import { Link } from "react-router-dom";

const TestimonialsAdmin = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadTestimonials = async () => {
        try {
            const data = await getAdminTestimonials();

            setTestimonials(data?.testimonials || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTestimonials();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this testimonial?")) {
            return;
        }

        try {
            await deleteTestimonial(id);

            setTestimonials((prev) =>
                prev.filter(
                    (testimonial) =>
                        testimonial._id !== id
                )
            );
        } catch (error) {
            alert(error.message);
        }
    };

    const handlePublish = async (id) => {
        try {
            await toggleTestimonialPublish(id);
            await loadTestimonials();
        } catch (error) {
            alert(error.message);
        }
    };

    if (loading) {
        return <div>Loading testimonials...</div>;
    }

    return (
        <section className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">
                        Testimonials
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Manage testimonials displayed on the website.
                    </p>
                </div>

                <Link
                    to="/admin/testimonials/create"
                    className="rounded-lg bg-gray-900 px-4 py-2 text-white dark:bg-white dark:text-gray-900"
                >
                    Add Testimonial
                </Link>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {testimonials.map((testimonial) => (
                    <article
                        key={testimonial._id}
                        className="rounded-xl border border-gray-200 p-5 dark:border-gray-700"
                    >
                        <div className="flex items-center gap-3">
                            {testimonial.avatar ? (
                                <img
                                    src={testimonial.avatar}
                                    alt={testimonial.name}
                                    className="h-12 w-12 rounded-full object-cover"
                                />
                            ) : (
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200">
                                    {testimonial.name?.charAt(0)}
                                </div>
                            )}

                            <div>
                                <h2 className="font-semibold">
                                    {testimonial.name}
                                </h2>

                                <p className="text-sm text-gray-500">
                                    {testimonial.role}
                                </p>
                            </div>
                        </div>

                        <div className="mt-3 text-yellow-400">
                            {"★".repeat(testimonial.rating)}
                        </div>

                        <p className="mt-4 line-clamp-4 text-sm text-gray-600 dark:text-gray-300">
                            {testimonial.message}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-2">
                            <Link
                                to={`/admin/testimonials/edit/${testimonial._id}`}
                                className="rounded-lg border px-3 py-2 text-sm"
                            >
                                Edit
                            </Link>

                            <button
                                onClick={() =>
                                    handlePublish(testimonial._id)
                                }
                                className="rounded-lg border px-3 py-2 text-sm"
                            >
                                {testimonial.published
                                    ? "Unpublish"
                                    : "Publish"}
                            </button>

                            <button
                                onClick={() =>
                                    handleDelete(testimonial._id)
                                }
                                className="rounded-lg border border-red-300 px-3 py-2 text-sm text-red-600"
                            >
                                Delete
                            </button>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
};

export default TestimonialsAdmin;