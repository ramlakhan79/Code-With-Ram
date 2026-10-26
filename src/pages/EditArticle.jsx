import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ArticleForm from "../components/ArticleForm";
import {
    getArticle,
    updateArticle
} from "../utils/admin";

import PDFUpload from "../components/article/PDFUpload";
import { getArticlePDF } from "../utils/articlePdfApi";

const EditArticle = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const [articlePDF, setArticlePDF] = useState(null);

    useEffect(() => {
        if (!article?._id) return;

        const loadPDF = async () => {
            try {
                const data = await getArticlePDF(article._id);
                setArticlePDF(data);
            } catch {
                setArticlePDF(null);
            }
        };

        loadPDF();
    }, [article?._id]);

    useEffect(() => {
        const loadArticle = async () => {
            try {
                const data = await getArticle(id);

                setArticle(data.article || data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        loadArticle();
    }, [id]);

    const handleSubmit = async (updatedArticle) => {
        try {
            setSaving(true);
            setError("");

            await updateArticle(id, updatedArticle);

            navigate("/admin");
        } catch (error) {
            setError(error.message);
        } finally {
            setSaving(false);
        }
    };
    // console.log(article);

    if (loading) {
        return (
            <div className="loader-container">
                <div className="custom-loader"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-950 text-white">

            <header className="border-b border-gray-800 bg-gray-900">
                <div className="max-w-4xl mx-auto px-6 py-5 flex justify-between items-center">

                    <h1 className="text-2xl font-bold">
                        Edit Article
                    </h1>

                    <button
                        onClick={() => navigate("/dashboard/articles")}
                        className="glassy-icon px-6 shrink-0 border rounded-lg"
                    >
                        ← Back
                    </button>
                    <PDFUpload
                        articleId={article._id}
                        existingPDF={articlePDF}
                        onUploaded={setArticlePDF}
                    />
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-8">

                {error && (
                    <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                )}

                {article && (
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 md:p-8">                        

                        <ArticleForm
                            initialData={article}
                            onSubmit={handleSubmit}
                            loading={saving}
                            buttonText="Update Article"
                            className="glassy-icon px-6 shrink-0 border rounded-lg"
                        /> 

                    </div>
                )}

            </main>

        </div>
    );
};

export default EditArticle;