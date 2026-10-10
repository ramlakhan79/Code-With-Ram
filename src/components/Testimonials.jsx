import { testimonials } from "../constants/data";
import { useEffect, useState } from "react";
import { QuoteIcon } from "./Icons";
import { getTestimonials } from "../utils/testimonials";

export default function Testimonials() {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadTestimonials = async () => {
            try {
                const data = await getTestimonials();

                setTestimonials(
                    data?.testimonials || []
                );
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        loadTestimonials();
    }, []);

    if (loading) {
        return (
            <div className="py-8 text-center">
                Loading testimonials...
            </div>
        );
    }

    if (!testimonials.length) {
        return (
            <div className="py-8 text-center">
                No testimonials available.
            </div>
        );
    }
    return (
        <>
        {
            testimonials.map((testimonial) => (
                <figure
                    key={testimonial._id}
                    className="glassy-screen px-mobileBound py-8 flex flex-col flex-nowrap gap-6 sm:px-7 sm:py-8 sm:gap-7 md:px-8 md:py-9 md:gap-8 lg:px-9 lg:py-10 lg:gap-9"
                >
                    <QuoteIcon />

                    <blockquote className="h-[100%] max-h-[300px] relative overflow-y-auto pr-6">
                        <p className="text-justify">
                            {testimonial.message}
                        </p>
                    </blockquote>

                    <div className="flex flex-row flex-wrap items-end justify-center gap-6">
                        {testimonial.avatar ? (
                            <img
                                src={testimonial.avatar}
                                alt={testimonial.name}
                                className="w-[100px] h-[100px] rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-[100px] h-[100px] rounded-full flex items-center justify-center bg-gray-500">
                                {testimonial.name?.charAt(0)}
                            </div>
                        )}

                        <div className="max-w-[15em]">
                            <figcaption className="text-suppBlue-100 dark:text-suppBlue-200">
                                {testimonial.name}
                            </figcaption>

                            <p>
                                {testimonial.role}

                                {testimonial.company &&
                                    `, ${testimonial.company}`}
                            </p>

                            <div className="mt-2 text-yellow-400">
                                {"★".repeat(
                                    testimonial.rating
                                )}
                            </div>
                        </div>
                    </div>

                    {(testimonial.linkedinUrl ||
                        testimonial.websiteUrl) && (
                            <div className="flex justify-center gap-5">
                                {testimonial.linkedinUrl && (
                                    <a
                                        href={
                                            testimonial.linkedinUrl
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="underline"
                                    >
                                        LinkedIn
                                    </a>
                                )}

                                {testimonial.websiteUrl && (
                                    <a
                                        href={
                                            testimonial.websiteUrl
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="underline"
                                    >
                                        Website
                                    </a>
                                )}
                            </div>
                        )}
                </figure>
            ))
        }
        </>
        // <>
        //     {testimonials.map((testimonial, id) => (
        //         <figure key={id} className="glassy-screen px-mobileBound py-8 flex flex-col flex-nowrap gap-6 sm:px-7 sm:py-8 sm:gap-7 md:px-8 md:py-9 md:gap-8 lg:px-9 lg:py-10 lg:gap-9">
        //             <QuoteIcon />
        //             <blockquote className="h-[100%] max-h-[300px] relative overflow-y-scroll pr-6">
        //                 <p className="text-justify">{testimonial.quote}</p>
        //             </blockquote>
        //             <div className="flex flex-row flex-wrap items-end justify-center gap-6">
        //                 <img src={testimonial.src} alt={testimonial.altText} className="w-[100px] h-[100px]" />
        //                 <div className="max-w-[15em]">
        //                     <figcaption className="text-suppBlue-100 dark:text-suppBlue-200">{testimonial.name}</figcaption>
        //                     <p>{testimonial.title}</p>
        //                 </div>
        //             </div>
        //         </figure>
        //     ))}
        // </>
    );
}