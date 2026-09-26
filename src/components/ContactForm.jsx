import {
    Turnstile,
} from "@marsidev/react-turnstile";
import { useState } from "react";
const turnstileSiteKey = '0x4AAAAAAFEkhMTpI7yxwsvH';

const useBasinFormId = '768f9cda9ef4';


export default function ContactForm() {
    const [token, setToken] = useState("");
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const validate = (formData) => {
        let newErrors = {};

        if (!formData.get("contact-name")?.trim()) {
            newErrors.name = "Enter Full Name";
        }
        if (!/^\d{10}$/.test(formData.get("contact-phone"))) {
            newErrors.phone = "Enter a valid 10-digit phone number";
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.get("contact-email"))) {
            newErrors.email = "Enter a valid email address";
        }
        if (!formData.get("contact-message")?.trim()) {
            newErrors.message = "Message cannot be empty";
        }
        if (!token) {
            newErrors.token = "Please complete the verification before submitting.";
        }
        return newErrors;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);

        const validationErrors = validate(formData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});
        setSubmitting(true);

        try {
            await fetch(`https://usebasin.com/f/${useBasinFormId}`, {
                method: "POST",
                body: formData,
            });
            window.location.href = "/thank-you";
        } catch (error) {
            console.error("Form submission failed:", error);
            alert("Something went wrong. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };
    return (
        <>
            <p className="text-center">Fields marked with asterisk (*) cannot be left blank.</p>
            <form
                name="contact-form"
                action={`https://usebasin.com/f/${useBasinFormId}`}
                method="POST"
                encType="multipart/form-data"
                className="w-[100%] flex flex-col flex-nowrap items-center gap-7"
                onSubmit={handleSubmit}
            >

                <label className="max-w-[30em] w-[100%]">
                    Full Name *
                    <input
                        type="text"
                        id="contact-name"
                        name="contact-name"
                        className="mt-3 px-5 py-4 bg-transparent border-2 border-solid border-neutGray-500 rounded-[5px] max-w-[30em] w-[100%] backdrop-blur-[5px]"
                        placeholder="Name"
                        required />
                    {errors.name && <p className="text-suppRed-500 text-sm">{errors.name}</p>}
                </label>

                <label className="max-w-[30em] w-[100%]">
                    Mobile No *
                    <input
                        type="text"
                        id="contact-phone"
                        name="contact-phone"
                        className="mt-3 px-5 py-4 bg-transparent border-2 border-solid border-neutGray-500 rounded-[5px] max-w-[30em] w-[100%] backdrop-blur-[5px]"
                        placeholder="phone number"
                        required />
                    {errors.phone && <p className="text-suppRed-500 text-sm">{errors.phone}</p>}
                </label>

                <label className="max-w-[30em] w-[100%]">
                    Email Address *
                    <input
                        type="email"
                        id="contact-email"
                        name="contact-email"
                        className="mt-3 px-5 py-4 bg-transparent border-2 border-solid border-neutGray-500 rounded-[5px] max-w-[30em] w-[100%] backdrop-blur-[5px]"
                        placeholder="Email"
                        required />
                    {errors.email && <p className="text-suppRed-500 text-sm">{errors.email}</p>}
                </label>

                <label className="max-w-[30em] w-[100%]">
                    Message *
                    <textarea
                        id="contact-message"
                        name="contact-message"
                        rows="4"
                        className="mt-3 px-5 py-4 bg-transparent border-2 border-solid border-neutGray-500 rounded-[5px] max-w-[30em] w-[100%] backdrop-blur-[5px]"
                        placeholder="Your message here..."
                        required
                    />
                    {errors.message && (
                        <p className="text-suppRed-500 text-sm">{errors.message}</p>
                    )}
                </label>

                <label className="max-w-[30em] w-[100%]">File Upload
                    <input
                        type="file"
                        name="file-upload"
                        className="mt-3 px-5 py-4 border-2 rounded-[5px] w-full"
                        placeholder="Upload file" />
                </label>
                <Turnstile
                    siteKey={turnstileSiteKey}
                    onSuccess={(newToken) => setToken(newToken)}
                    onError={() => setToken("")}
                    onExpire={() => setToken("")}
                />{errors.token && (<p className="text-suppRed-500 text-sm">{errors.token}</p>)}

                {/* <button
                    type="submit"
                    disabled={submitting}
                    className="mt-8 glassy-icon px-6">{submitting ? "Submitting..." : "Submit Message"}</button> */}

                <button
                    type="submit"
                    disabled={submitting || !token}
                    className={`mt-8 glassy-icon px-6 ${(!token || submitting) ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                    {submitting ? "Submitting..." : "Submit Message"}
                </button>
            </form>
        </>
    );
}