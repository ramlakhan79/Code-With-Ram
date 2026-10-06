import { useEffect, useState } from "react";
import {
    createProject,
    getAdminProject,
    updateProject,
} from "../utils/projects";
import { useNavigate, useParams } from "react-router-dom";

const emptyProject = {
    title: "",
    shortDescription: "",
    description: "",
    image: "",
    gallery: [],
    technologies: [],
    features: [],
    role: "",
    category: "Web Development",
    githubUrl: "",
    liveUrl: "",
    demoVideo: "",
    challenges: "",
    solution: "",
    results: "",
    startDate: "",
    endDate: "",
    status: "completed",
    featured: false,
    published: true,
    order: 0,
};

const ProjectForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState(emptyProject);
    const [technologyInput, setTechnologyInput] =
        useState("");
    const [featureInput, setFeatureInput] = useState("");
    const [galleryUrl, setGalleryUrl] = useState("");
    const [galleryAlt, setGalleryAlt] = useState("");
    const [loading, setLoading] = useState(Boolean(id));
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!id) return;

        const loadProject = async () => {
            try {
                const data = await getAdminProject(id);

                const project = data.project;

                setForm({
                    ...emptyProject,
                    ...project,
                    startDate: project.startDate
                        ? project.startDate.substring(0, 10)
                        : "",
                    endDate: project.endDate
                        ? project.endDate.substring(0, 10)
                        : "",
                });
            } catch (error) {
                alert(error.message);
            } finally {
                setLoading(false);
            }
        };

        loadProject();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const addTechnology = () => {
        if (!technologyInput.trim()) return;

        setForm((prev) => ({
            ...prev,
            technologies: [
                ...prev.technologies,
                technologyInput.trim(),
            ],
        }));

        setTechnologyInput("");
    };

    const removeTechnology = (index) => {
        setForm((prev) => ({
            ...prev,
            technologies: prev.technologies.filter(
                (_, i) => i !== index
            ),
        }));
    };

    const addFeature = () => {
        if (!featureInput.trim()) return;

        setForm((prev) => ({
            ...prev,
            features: [
                ...prev.features,
                featureInput.trim(),
            ],
        }));

        setFeatureInput("");
    };

    const removeFeature = (index) => {
        setForm((prev) => ({
            ...prev,
            features: prev.features.filter(
                (_, i) => i !== index
            ),
        }));
    };

    const addGallery = () => {
        if (!galleryUrl.trim()) return;

        setForm((prev) => ({
            ...prev,
            gallery: [
                ...prev.gallery,
                {
                    url: galleryUrl.trim(),
                    alt: galleryAlt.trim(),
                },
            ],
        }));

        setGalleryUrl("");
        setGalleryAlt("");
    };

    const removeGallery = (index) => {
        setForm((prev) => ({
            ...prev,
            gallery: prev.gallery.filter(
                (_, i) => i !== index
            ),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            !form.title.trim() ||
            !form.shortDescription.trim() ||
            !form.description.trim()
        ) {
            alert(
                "Title, short description and description are required."
            );
            return;
        }

        try {
            setSaving(true);

            if (id) {
                await updateProject(id, form);
            } else {
                await createProject(form);
            }

            navigate("/admin/projects");
        } catch (error) {
            alert(error.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div>Loading project...</div>;
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-8"
        >
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {id ? "Edit Project" : "Create Project"}
                </h1>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
                <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Project title"
                    className="rounded-lg border p-3 dark:bg-gray-900"
                />

                <input
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    placeholder="Category"
                    className="rounded-lg border p-3 dark:bg-gray-900"
                />
            </div>

            <input
                name="shortDescription"
                value={form.shortDescription}
                onChange={handleChange}
                placeholder="Short description"
                className="rounded-lg border p-3 dark:bg-gray-900"
            />

            <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Complete project description"
                rows={7}
                className="rounded-lg border p-3 dark:bg-gray-900"
            />

            <input
                name="image"
                value={form.image}
                onChange={handleChange}
                placeholder="Main image URL"
                className="rounded-lg border p-3 dark:bg-gray-900"
            />

            <div>
                <h2 className="mb-3 font-semibold">
                    Technologies
                </h2>

                <div className="flex gap-2">
                    <input
                        value={technologyInput}
                        onChange={(e) =>
                            setTechnologyInput(e.target.value)
                        }
                        placeholder="React"
                        className="flex-1 rounded-lg border p-3 dark:bg-gray-900"
                    />

                    <button
                        type="button"
                        onClick={addTechnology}
                        className="rounded-lg bg-gray-900 px-4 text-white dark:bg-white dark:text-gray-900"
                    >
                        Add
                    </button>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                    {form.technologies.map((item, index) => (
                        <button
                            type="button"
                            key={index}
                            onClick={() => removeTechnology(index)}
                            className="rounded-full bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800"
                        >
                            {item} ×
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <h2 className="mb-3 font-semibold">
                    Features
                </h2>

                <div className="flex gap-2">
                    <input
                        value={featureInput}
                        onChange={(e) =>
                            setFeatureInput(e.target.value)
                        }
                        placeholder="Authentication"
                        className="flex-1 rounded-lg border p-3 dark:bg-gray-900"
                    />

                    <button
                        type="button"
                        onClick={addFeature}
                        className="rounded-lg bg-gray-900 px-4 text-white dark:bg-white dark:text-gray-900"
                    >
                        Add
                    </button>
                </div>

                <div className="mt-3 flex flex-col gap-2">
                    {form.features.map((item, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between rounded-lg border p-3"
                        >
                            <span>{item}</span>

                            <button
                                type="button"
                                onClick={() => removeFeature(index)}
                                className="text-red-600"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <h2 className="mb-3 font-semibold">
                    Gallery
                </h2>

                <div className="grid gap-3 md:grid-cols-2">
                    <input
                        value={galleryUrl}
                        onChange={(e) =>
                            setGalleryUrl(e.target.value)
                        }
                        placeholder="Image URL"
                        className="rounded-lg border p-3 dark:bg-gray-900"
                    />

                    <input
                        value={galleryAlt}
                        onChange={(e) =>
                            setGalleryAlt(e.target.value)
                        }
                        placeholder="Image alt text"
                        className="rounded-lg border p-3 dark:bg-gray-900"
                    />
                </div>

                <button
                    type="button"
                    onClick={addGallery}
                    className="mt-3 rounded-lg border px-4 py-2"
                >
                    Add Screenshot
                </button>

                <div className="mt-4 grid gap-4 md:grid-cols-3">
                    {form.gallery.map((item, index) => (
                        <div
                            key={index}
                            className="rounded-lg border p-3"
                        >
                            <img
                                src={item.url}
                                alt={item.alt}
                                className="h-32 w-full rounded object-cover"
                            />

                            <button
                                type="button"
                                onClick={() => removeGallery(index)}
                                className="mt-2 text-sm text-red-600"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
                <input
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    placeholder="Your role"
                    className="rounded-lg border p-3 dark:bg-gray-900"
                />

                <input
                    name="githubUrl"
                    value={form.githubUrl}
                    onChange={handleChange}
                    placeholder="GitHub URL"
                    className="rounded-lg border p-3 dark:bg-gray-900"
                />

                <input
                    name="liveUrl"
                    value={form.liveUrl}
                    onChange={handleChange}
                    placeholder="Live project URL"
                    className="rounded-lg border p-3 dark:bg-gray-900"
                />

                <input
                    name="demoVideo"
                    value={form.demoVideo}
                    onChange={handleChange}
                    placeholder="Demo video URL"
                    className="rounded-lg border p-3 dark:bg-gray-900"
                />
            </div>

            <textarea
                name="challenges"
                value={form.challenges}
                onChange={handleChange}
                placeholder="Challenges faced"
                rows={5}
                className="rounded-lg border p-3 dark:bg-gray-900"
            />

            <textarea
                name="solution"
                value={form.solution}
                onChange={handleChange}
                placeholder="Solution"
                rows={5}
                className="rounded-lg border p-3 dark:bg-gray-900"
            />

            <textarea
                name="results"
                value={form.results}
                onChange={handleChange}
                placeholder="Results / outcome"
                rows={5}
                className="rounded-lg border p-3 dark:bg-gray-900"
            />

            <div className="grid gap-5 md:grid-cols-3">
                <div>
                    <label className="mb-2 block text-sm">
                        Start Date
                    </label>

                    <input
                        type="date"
                        name="startDate"
                        value={form.startDate}
                        onChange={handleChange}
                        className="w-full rounded-lg border p-3 dark:bg-gray-900"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm">
                        End Date
                    </label>

                    <input
                        type="date"
                        name="endDate"
                        value={form.endDate}
                        onChange={handleChange}
                        className="w-full rounded-lg border p-3 dark:bg-gray-900"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm">
                        Status
                    </label>

                    <select
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                        className="w-full rounded-lg border p-3 dark:bg-gray-900"
                    >
                        <option value="completed">Completed</option>
                        <option value="in-progress">
                            In Progress
                        </option>
                        <option value="maintenance">
                            Maintenance
                        </option>
                        <option value="archived">Archived</option>
                    </select>
                </div>
            </div>

            <div className="flex flex-wrap gap-6">
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
                        ? "Update Project"
                        : "Create Project"}
            </button>
        </form>
    );
};

export default ProjectForm;