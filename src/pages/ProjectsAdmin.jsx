import { useEffect, useState } from "react";
import {
    getAdminProjects,
    deleteProject,
    toggleProjectPublish,
} from "../utils/projects";
import { Link } from "react-router-dom";

const ProjectsAdmin = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadProjects = async () => {
        try {
            const data = await getAdminProjects();
            setProjects(data?.projects || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProjects();
    }, []);

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this project?"
        );

        if (!confirmed) return;

        try {
            await deleteProject(id);

            setProjects((prev) =>
                prev.filter((project) => project._id !== id)
            );
        } catch (error) {
            alert(error.message);
        }
    };

    const handlePublish = async (id) => {
        try {
            await toggleProjectPublish(id);
            await loadProjects();
        } catch (error) {
            alert(error.message);
        }
    };

    if (loading) {
        return <div className="loader-container">
            <div className="custom-loader"></div>
        </div>
    }

    return (
        <section className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Projects
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Manage portfolio projects.
                    </p>
                </div>

                <Link
                    to="/admin/projects/create"
                    className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-gray-900"
                >
                    Add Project
                </Link>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {projects.map((project) => (
                    <article
                        key={project._id}
                        className="overflow-hidden rounded-xl border border-gray-200 bg-black dark:border-gray-700 dark:bg-gray-900"
                    >
                        {project.image && (
                            <img
                                src={project.image}
                                alt={project.title}
                                className="h-48 w-full object-cover"
                            />
                        )}

                        <div className="flex flex-col gap-4 p-5">
                            <div>
                                <h2 className="font-bold text-gray-900 dark:text-white">
                                    {project.title}
                                </h2>

                                <p className="mt-2 text-sm text-gray-500">
                                    {project.shortDescription}
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <span
                                    className={`rounded-full px-2.5 py-1 text-xs ${project.published
                                            ? "bg-green-100 text-green-700"
                                            : "bg-gray-100 text-gray-600"
                                        }`}
                                >
                                    {project.published
                                        ? "Published"
                                        : "Draft"}
                                </span>

                                {project.featured && (
                                    <span className="rounded-full bg-yellow-100 px-2.5 py-1 text-xs text-yellow-700">
                                        Featured
                                    </span>
                                )}
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <Link
                                    to={`/admin/projects/edit/${project._id}`}
                                    className="rounded-lg border px-3 py-2 text-sm"
                                >
                                    Edit
                                </Link>

                                <button
                                    onClick={() =>
                                        handlePublish(project._id)
                                    }
                                    className="rounded-lg border px-3 py-2 text-sm"
                                >
                                    {project.published
                                        ? "Unpublish"
                                        : "Publish"}
                                </button>

                                <button
                                    onClick={() =>
                                        handleDelete(project._id)
                                    }
                                    className="rounded-lg border border-red-300 px-3 py-2 text-sm text-red-600"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
};

export default ProjectsAdmin;