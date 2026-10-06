import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    createTestimonial,
    getTestimonial,
    updateTestimonial,
} from "../utils/testimonials";
import { getProjects } from "../utils/projects";

const initialForm = {
    name: "",
    role: "",
    company: "",
    avatar: "",
    rating: 5,
    message: "",
    linkedinUrl: "",
    websiteUrl: "",
    project: "",
    featured: false,
    published: true,
    order: 0,
};

const TestimonialForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState(initialForm);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(Boolean(id));
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                const projectsData = await getProjects();

                setProjects(projectsData?.projects || []);

                if (id) {
                    const testimonialData =
                        await getTestimonial(id);

                    const testimonial =
                        testimonialData?.testimonial;

                    setForm({
                        ...initialForm,
                        ...testimonial,
                        project:
                            testimonial?.project?._id ||
                            testimonial?.project ||
                            "",
                    });
                }
            } catch (error) {
                alert(error.message);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.name.trim() || !form.message.trim()) {
            alert("Name and message are required.");
            return;
        }

        try {
            setSaving(true);

            const payload = {
                ...form,
                rating: Number(form.rating),
                order: Number(form.order),
                project: form.project || null,
            };

            if (id) {
                await updateTestimonial(id, payload);
            } else {
                await createTestimonial(payload);
            }

            navigate("/admin/testimonials");
        } catch (error) {
            alert(error.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="flex max-w-4xl flex-col gap-6"
        >
            <h1 className="text-2xl font-bold">
                {id
                    ? "Edit Testimonial"
                    : "Create Testimonial"}
            </h1>

            <div className="grid gap-5 md:grid-cols-2">
                <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Name"
                    className="rounded-lg border p-3 dark:bg-gray-900"
                />

                <input
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    placeholder="Role"
                    className="rounded-lg border p-3 dark:bg-gray-900"
                />

                <input
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    placeholder="Company"
                    className="rounded-lg border p-3 dark:bg-gray-900"
                />

                <input
                    name="avatar"
                    value={form.avatar}
                    onChange={handleChange}
                    placeholder="Avatar URL"
                    className="rounded-lg border p-3 dark:bg-gray-900"
                />
            </div>

            <div>
                <label className="mb-2 block text-sm">
                    Rating
                </label>

                <select
                    name="rating"
                    value={form.rating}
                    onChange={handleChange}
                    className="rounded-lg border p-3 dark:bg-gray-900"
                >
                    <option value={5}>5 Stars</option>
                    <option value={4}>4 Stars</option>
                    <option value={3}>3 Stars</option>
                    <option value={2}>2 Stars</option>
                    <option value={1}>1 Star</option>
                </select>
            </div>

            <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Testimonial"
                rows={7}
                className="rounded-lg border p-3 dark:bg-gray-900"
            />

            <div className="grid gap-5 md:grid-cols-2">
                <input
                    name="linkedinUrl"
                    value={form.linkedinUrl}
                    onChange={handleChange}
                    placeholder="LinkedIn URL"
                    className="rounded-lg border p-3 dark:bg-gray-900"
                />

                <input
                    name="websiteUrl"
                    value={form.websiteUrl}
                    onChange={handleChange}
                    placeholder="Website URL"
                    className="rounded-lg border p-3 dark:bg-gray-900"
                />
            </div>

            <div>
                <label className="mb-2 block text-sm">
                    Related Project
                </label>

                <select
                    name="project"
                    value={form.project}
                    onChange={handleChange}
                    className="w-full rounded-lg border p-3 dark:bg-gray-900"
                >
                    <option value="">
                        No project
                    </option>

                    {projects.map((project) => (
                        <option
                            key={project._id}
                            value={project._id}
                        >
                            {project.title}
                        </option>
                    ))}
                </select>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        name="featured"
                        checked={form.featured}
                        onChange={handleChange}
                    />

                    Featured
                </label>

                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        name="published"
                        checked={form.published}
                        onChange={handleChange}
                    />

                    Published
                </label>
            </div>

            <input
                type="number"
                name="order"
                value={form.order}
                onChange={handleChange}
                placeholder="Display order"
                className="rounded-lg border p-3 dark:bg-gray-900"
            />

            <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-gray-900 px-5 py-3 font-medium text-white disabled:opacity-50 dark:bg-white dark:text-gray-900"
            >
                {saving
                    ? "Saving..."
                    : id
                        ? "Update Testimonial"
                        : "Create Testimonial"}
            </button>
        </form>
    );
};

export default TestimonialForm;