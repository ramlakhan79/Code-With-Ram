import { useEffect, useState } from "react";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";

import DOMPurify from "dompurify";

import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    Strikethrough,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    Quote,
    Code,
    Code2,
    Link as LinkIcon,
    Unlink,
    Undo2,
    Redo2,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Minus,
    Eye,
    EyeOff
} from "lucide-react";

import { uploadArticleCoverImage } from "../utils/admin";

const MenuButton = ({
    onClick,
    active,
    disabled,
    children,
    title
}) => {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            title={title}
            className={`
                p-2 rounded-md transition-all
                ${active
                    ? "bg-white/20 text-white"
                    : "text-gray-400 hover:text-white hover:bg-white/10"
                }
                ${disabled
                    ? "opacity-40 cursor-not-allowed"
                    : ""
                }
            `}
        >
            {children}
        </button>
    );
};


const EditorToolbar = ({ editor }) => {

    if (!editor) return null;

    const addLink = () => {

        const previousUrl = editor.getAttributes("link").href;

        const url = window.prompt(
            "Enter URL",
            previousUrl || "https://"
        );

        if (url === null) return;

        if (url === "") {
            editor.chain().focus().unsetLink().run();
            return;
        }

        editor
            .chain()
            .focus()
            .extendMarkRange("link")
            .setLink({ href: url })
            .run();
    };


    return (
        <div className="flex flex-wrap items-center gap-1 p-2 border-b border-white/10 bg-black/20">

            <MenuButton
                title="Undo"
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
            >
                <Undo2 size={17} />
            </MenuButton>

            <MenuButton
                title="Redo"
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
            >
                <Redo2 size={17} />
            </MenuButton>


            <div className="w-px h-6 bg-white/10 mx-1" />


            <MenuButton
                title="Bold"
                active={editor.isActive("bold")}
                onClick={() =>
                    editor.chain().focus().toggleBold().run()
                }
            >
                <Bold size={17} />
            </MenuButton>

            <MenuButton
                title="Italic"
                active={editor.isActive("italic")}
                onClick={() =>
                    editor.chain().focus().toggleItalic().run()
                }
            >
                <Italic size={17} />
            </MenuButton>

            <MenuButton
                title="Underline"
                active={editor.isActive("underline")}
                onClick={() =>
                    editor.chain().focus().toggleUnderline().run()
                }
            >
                <UnderlineIcon size={17} />
            </MenuButton>

            <MenuButton
                title="Strikethrough"
                active={editor.isActive("strike")}
                onClick={() =>
                    editor.chain().focus().toggleStrike().run()
                }
            >
                <Strikethrough size={17} />
            </MenuButton>


            <div className="w-px h-6 bg-white/10 mx-1" />


            <MenuButton
                title="Heading 2"
                active={editor.isActive("heading", { level: 2 })}
                onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 2 }).run()
                }
            >
                <Heading2 size={17} />
            </MenuButton>

            <MenuButton
                title="Heading 3"
                active={editor.isActive("heading", { level: 3 })}
                onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 3 }).run()
                }
            >
                <Heading3 size={17} />
            </MenuButton>


            <div className="w-px h-6 bg-white/10 mx-1" />


            <MenuButton
                title="Bullet List"
                active={editor.isActive("bulletList")}
                onClick={() =>
                    editor.chain().focus().toggleBulletList().run()
                }
            >
                <List size={17} />
            </MenuButton>

            <MenuButton
                title="Numbered List"
                active={editor.isActive("orderedList")}
                onClick={() =>
                    editor.chain().focus().toggleOrderedList().run()
                }
            >
                <ListOrdered size={17} />
            </MenuButton>

            <MenuButton
                title="Quote"
                active={editor.isActive("blockquote")}
                onClick={() =>
                    editor.chain().focus().toggleBlockquote().run()
                }
            >
                <Quote size={17} />
            </MenuButton>

            <MenuButton
                title="Inline Code"
                active={editor.isActive("code")}
                onClick={() =>
                    editor.chain().focus().toggleCode().run()
                }
            >
                <Code size={17} />
            </MenuButton>

            <MenuButton
                title="Code Block"
                active={editor.isActive("codeBlock")}
                onClick={() =>
                    editor.chain().focus().toggleCodeBlock().run()
                }
            >
                <Code2 size={17} />
            </MenuButton>


            <div className="w-px h-6 bg-white/10 mx-1" />


            <MenuButton
                title="Align Left"
                active={editor.isActive({ textAlign: "left" })}
                onClick={() =>
                    editor.chain().focus().setTextAlign("left").run()
                }
            >
                <AlignLeft size={17} />
            </MenuButton>

            <MenuButton
                title="Align Center"
                active={editor.isActive({ textAlign: "center" })}
                onClick={() =>
                    editor.chain().focus().setTextAlign("center").run()
                }
            >
                <AlignCenter size={17} />
            </MenuButton>

            <MenuButton
                title="Align Right"
                active={editor.isActive({ textAlign: "right" })}
                onClick={() =>
                    editor.chain().focus().setTextAlign("right").run()
                }
            >
                <AlignRight size={17} />
            </MenuButton>


            <div className="w-px h-6 bg-white/10 mx-1" />


            <MenuButton
                title="Add Link"
                active={editor.isActive("link")}
                onClick={addLink}
            >
                <LinkIcon size={17} />
            </MenuButton>

            <MenuButton
                title="Remove Link"
                disabled={!editor.isActive("link")}
                onClick={() =>
                    editor.chain().focus().unsetLink().run()
                }
            >
                <Unlink size={17} />
            </MenuButton>

            <MenuButton
                title="Horizontal Rule"
                onClick={() =>
                    editor.chain().focus().setHorizontalRule().run()
                }
            >
                <Minus size={17} />
            </MenuButton>

        </div>
    );
};


const ArticleForm = ({
    initialData,
    onSubmit,
    loading,
    buttonText = "Save Article"
}) => {
    const [uploadingImage, setUploadingImage] = useState(false);
    const [imageError, setImageError] = useState("");
    const [form, setForm] = useState({
        title: "",
        excerpt: "",
        content: "",
        category: "",
        tags: "",
        coverImage: "",
        published: true,
        featured: false
    });

    const [preview, setPreview] = useState(false);

    const [wordCount, setWordCount] = useState(0);
    const lowlight = createLowlight(common);
    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/gif"
        ];

        if (!allowedTypes.includes(file.type)) {
            setImageError("Please select a JPG, PNG, WEBP or GIF image.");
            e.target.value = "";
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setImageError("Image size must be 5 MB or less.");
            e.target.value = "";
            return;
        }

        try {
            setUploadingImage(true);
            setImageError("");

            const imageUrl = await uploadArticleCoverImage(file);

            setForm(prev => ({
                ...prev,
                coverImage: imageUrl
            }));
        } catch (error) {
            setImageError(error.message || "Image upload failed.");
        } finally {
            setUploadingImage(false);
            e.target.value = "";
        }
    };

    const editor = useEditor({

        extensions: [
            StarterKit.configure({
                link: false,
                underline: false,

                heading: {
                    levels: [2, 3]
                }
            }),
            CodeBlockLowlight.configure({
                lowlight,
                defaultLanguage: "plaintext",
            }),
            Underline,

            Link.configure({
                openOnClick: false,
                autolink: true,
                linkOnPaste: true,
                defaultProtocol: "https"
            }),

            TextAlign.configure({
                types: ["heading", "paragraph"]
            })
        ],

        content: "",

        editorProps: {
            attributes: {
                class:
                    "min-h-[400px] p-5 outline-none text-gray-200 leading-7 prose prose-invert max-w-none"
            }
        },

        onUpdate: ({ editor }) => {

            const html = editor.getHTML();

            const text = editor
                .getText()
                .replace(/\s+/g, " ")
                .trim();

            const words = text
                ? text.split(" ").length
                : 0;

            setWordCount(words);

            setForm(prev => ({
                ...prev,
                content: html
            }));
        }
    });


    useEffect(() => {

        if (!initialData) return;

        const data = {
            title: initialData.title || "",

            excerpt:
                initialData.excerpt ||
                initialData.desc ||
                "",

            content: initialData.content || "",

            category:
                initialData.category ||
                "",

            tags:
                initialData.tags?.join(", ") ||
                "",

            coverImage:
                initialData.coverImage ||
                initialData.image ||
                "",

            published:
                initialData.published ?? true,

            featured:
                initialData.featured ?? false
        };

        setForm(data);

        if (editor) {

            editor.commands.setContent(
                data.content || ""
            );

            const text = editor
                .getText()
                .replace(/\s+/g, " ")
                .trim();

            setWordCount(
                text
                    ? text.split(" ").length
                    : 0
            );
        }

    }, [initialData, editor]);


    const handleChange = e => {

        const {
            name,
            value,
            type,
            checked
        } = e.target;

        setForm(prev => ({
            ...prev,
            [name]:
                type === "checkbox"
                    ? checked
                    : value
        }));
    };


    const handleSubmit = e => {
        e.preventDefault();

        if (uploadingImage) {
            setImageError("Please wait for the image upload to finish.");
            return;
        }

        onSubmit({
            ...form,
            image: form.coverImage,
            tags: form.tags
                .split(",")
                .map(tag => tag.trim())
                .filter(Boolean)
        });
    };

    const readingTime = Math.max(
        1,
        Math.ceil(wordCount / 200)
    );


    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-5xl mx-auto space-y-6"
        >

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                <div>

                    <h1 className="text-2xl font-semibold text-white">
                        {initialData
                            ? "Edit Article"
                            : "Create Article"
                        }
                    </h1>

                    <p className="text-sm text-gray-500 mt-1">
                        Write, format and publish your article.
                    </p>

                </div>

                <button
                    type="button"
                    onClick={() => setPreview(!preview)}
                    className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 transition"
                >
                    {preview ? (
                        <>
                            <EyeOff size={17} />
                            Editor
                        </>
                    ) : (
                        <>
                            <Eye size={17} />
                            Preview
                        </>
                    )}
                </button>

            </div>


            {!preview ? (

                <>

                    {/* Article Information */}

                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 space-y-6">

                        <div>

                            <h2 className="text-lg font-medium text-white">
                                Article Information
                            </h2>

                            <p className="text-sm text-gray-500 mt-1">
                                Add the basic information about your article.
                            </p>

                        </div>


                        <div>

                            <label className="block text-sm text-gray-300 mb-2">
                                Title
                            </label>

                            <input
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                required
                                className="admin-input text-lg"
                                placeholder="Enter article title..."
                            />

                        </div>


                        <div>

                            <label className="block text-sm text-gray-300 mb-2">
                                Excerpt
                            </label>

                            <textarea
                                name="excerpt"
                                value={form.excerpt}
                                onChange={handleChange}
                                required
                                rows="3"
                                maxLength={300}
                                className="admin-input resize-none"
                                placeholder="Write a short summary of your article..."
                            />

                            <div className="text-xs text-gray-600 text-right mt-1">
                                {form.excerpt.length}/300
                            </div>

                        </div>


                        <div className="grid md:grid-cols-2 gap-5">

                            <div>

                                <label className="block text-sm text-gray-300 mb-2">
                                    Category
                                </label>

                                <input
                                    name="category"
                                    value={form.category}
                                    onChange={handleChange}
                                    required
                                    className="admin-input"
                                    placeholder="SAP ABAP"
                                />

                            </div>


                            <div>

                                <label className="block text-sm text-gray-300 mb-2">
                                    Estimated Reading Time
                                </label>

                                <div className="admin-input flex items-center justify-between">

                                    <span className="text-gray-300">
                                        {readingTime} min read
                                    </span>

                                    <span className="text-xs text-gray-500">
                                        {wordCount} words
                                    </span>

                                </div>

                            </div>

                        </div>


                        <div>

                            <label className="block text-sm text-gray-300 mb-2">
                                Tags
                            </label>

                            <input
                                name="tags"
                                value={form.tags}
                                onChange={handleChange}
                                className="admin-input"
                                placeholder="SAP, ABAP, S4HANA"
                            />

                            <p className="text-xs text-gray-500 mt-2">
                                Separate tags using commas.
                            </p>

                        </div>


                        <div>

                            <label className="block text-sm text-gray-300 mb-2">
                                Cover Image
                            </label>

                            {/* <input
                                name="coverImage"
                                value={form.coverImage}
                                onChange={handleChange}
                                className="admin-input"
                                placeholder="https://..."
                            /> */}

                            <div>
                                <label className="block text-sm text-gray-300 mb-2">
                                    Cover Image
                                </label>

                                <div className="flex flex-wrap items-center gap-4">
                                    <label className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-white/10 bg-white/5 text-gray-200 hover:bg-white/10 cursor-pointer transition">
                                        <span>
                                            {uploadingImage ? "Uploading..." : "Choose Image"}
                                        </span>

                                        <input
                                            type="file"
                                            accept="image/jpeg,image/png,image/webp,image/gif"
                                            onChange={handleImageUpload}
                                            disabled={uploadingImage}
                                            className="hidden"
                                        />
                                    </label>

                                    {form.coverImage && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setForm(prev => ({
                                                    ...prev,
                                                    coverImage: ""
                                                }));
                                                setImageError("");
                                            }}
                                            className="text-sm text-red-400 hover:text-red-300"
                                        >
                                            Remove image
                                        </button>
                                    )}
                                </div>

                                <p className="text-xs text-gray-500 mt-2">
                                    JPG, PNG, WEBP or GIF. Maximum size: 5 MB.
                                </p>

                                {imageError && (
                                    <p className="text-sm text-red-400 mt-2">
                                        {imageError}
                                    </p>
                                )}

                                {form.coverImage && (
                                    <div className="mt-4 rounded-xl overflow-hidden border border-white/10">
                                        <img
                                            src={form.coverImage}
                                            alt="Cover preview"
                                            className="w-full h-48 object-cover"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* {form.coverImage && (
                                <div className="mt-3 rounded-xl overflow-hidden border border-white/10 h-40">

                                    <img
                                        src={form.coverImage}
                                        alt="Cover preview"
                                        className="w-full h-full object-cover"
                                        onError={e => {
                                            e.currentTarget.style.display =
                                                "none";
                                        }}
                                    />

                                </div>
                            )} */}

                        </div>

                    </div>


                    {/* Editor */}

                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">

                        <div className="p-6 pb-4">

                            <h2 className="text-lg font-medium text-white">
                                Article Content
                            </h2>

                            <p className="text-sm text-gray-500 mt-1">
                                Use headings to structure your article.
                            </p>

                        </div>


                        <div className="border-t border-white/10">

                            <EditorToolbar editor={editor} />

                            <EditorContent editor={editor} />

                        </div>


                        <div className="px-5 py-3 border-t border-white/10 text-xs text-gray-500">

                            H2/H3 headings are used to build the article
                            table of contents.

                        </div>

                    </div>


                    {/* Publishing */}

                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                        <div className="space-y-3">

                            <label className="flex items-center gap-3 text-gray-300 cursor-pointer">

                                <input
                                    type="checkbox"
                                    name="published"
                                    checked={form.published}
                                    onChange={handleChange}
                                    className="w-4 h-4 accent-white"
                                />

                                <div>

                                    <div className="text-sm font-medium text-white">
                                        Publish article
                                    </div>

                                    <div className="text-xs text-gray-500">
                                        {form.published
                                            ? "This article will be visible on your portfolio."
                                            : "Save as draft and publish later."
                                        }
                                    </div>

                                </div>

                            </label>


                            <label className="flex items-center gap-3 text-gray-300 cursor-pointer">

                                <input
                                    type="checkbox"
                                    name="featured"
                                    checked={form.featured}
                                    onChange={handleChange}
                                    className="w-4 h-4 accent-white"
                                />

                                <div>

                                    <div className="text-sm font-medium text-white">
                                        Featured article
                                    </div>

                                    <div className="text-xs text-gray-500">
                                        Highlight this article on your blog.
                                    </div>

                                </div>

                            </label>

                        </div>


                        <button
                            type="submit"
                            disabled={loading || uploadingImage}
                            className="glassy-icon px-7 py-3 shrink-0 border rounded-lg disabled:opacity-50"
                        >
                            {uploadingImage
                                ? "Uploading Image..."
                                : loading
                                    ? "Saving..."
                                    : buttonText}
                        </button>

                    </div>

                </>

            ) : (

                /* Preview */

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">

                    {form.coverImage && (
                        <img
                            src={form.coverImage}
                            alt={form.title}
                            className="w-full max-h-[450px] object-cover"
                        />
                    )}


                    <article className="max-w-4xl mx-auto px-6 md:px-10 py-10">

                        <div className="flex flex-wrap items-center gap-3 mb-5">

                            {form.category && (
                                <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-sm text-blue-400">
                                    {form.category}
                                </span>
                            )}

                            <span className="text-sm text-gray-500">
                                {readingTime} min read
                            </span>

                        </div>


                        <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-5">
                            {form.title || "Untitled Article"}
                        </h1>


                        <p className="text-gray-400 text-lg leading-7 mb-10">
                            {form.excerpt}
                        </p>


                        <div
                            className="
                                prose
                                prose-invert
                                prose-lg
                                max-w-none

                                prose-headings:text-white
                                prose-h2:text-2xl
                                prose-h2:mt-12
                                prose-h3:text-xl
                                prose-h3:mt-8

                                prose-p:text-gray-300
                                prose-p:leading-8

                                prose-a:text-blue-400
                                prose-a:underline

                                prose-strong:text-white

                                prose-li:text-gray-300

                                prose-code:text-pink-400

                                prose-pre:bg-gray-900
                            "
                            dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(form.content)
                            }}
                        />

                    </article>

                </div>
            )}

        </form>
    );
};

export default ArticleForm;