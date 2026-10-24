import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import Socials from "../components/Socials";
import Projects from "../components/Projects";
import LeetCodeHeatMap from "../components/LeetCodeHeatMap";
import Dailyquotes from "../components/Dailyquotes";
import Testimonials from "../components/Testimonials";
import SplashSection from "../components/SplashSection";
import ContactForm from "../components/ContactForm";
import CubeCarousel from "../components/CubeCarousel";
import { dessertImages } from "../constants/data";
import BlogLanding from "../components/BlogLanding";
import { getArticles } from "../utils/api";

export default function Home() {
    const [isDarkMode] = useOutletContext();
    const [articles, setArticles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;

        const loadArticles = async () => {
            try {
                setIsLoading(true);
                setError("");

                const response = await getArticles();

                const list = Array.isArray(response)
                    ? response
                    : response?.articles ??
                    response?.data?.articles ??
                    response?.data ??
                    [];

                if (active) {
                    setArticles(Array.isArray(list) ? list : []);
                }
            } catch (err) {
                if (active) {
                    setError("Unable to load articles. Please try again.");
                    console.error("Failed to load articles:", err);
                }
            } finally {
                if (active) {
                    setIsLoading(false);
                }
            }
        };

        loadArticles();

        return () => {
            active = false;
        };
    }, []);

    return (
        <>
            {error && (
                <div
                    role="alert"
                    className="mx-auto mt-6 max-w-7xl px-5 text-sm text-red-500"
                >
                    {error}
                </div>
            )}

            <BlogLanding
                articles={articles}
                isLoading={isLoading}
            />

            {/* <SplashSection splashMessage={'Code With Ram'} isDarkMode={isDarkMode} isErrorMode={false} /> */}
            {/* <section className="w-[100%] flex flex-col flex-nowrap items-center justify-center gap-7 px-mobileBound sm:px-8 sm:gap-8 md:gap-9 lg:gap-10">
                <h1 className="text-center max-w-[18em]">Problem Solving and Web Experiences</h1>
                <p className="text-justify">Hello, and welcome! I&apos;m Ramlakhan Lodhi, a MERN-Stack Aspiring developer. I am a passionate competitive programmer and highly interested in algorithmic problem solving. I am very interested in new technologies and am always eager to learn new technologies that enhance my knowledge. Together, let&apos;s Explore the vast opportunities in the digital world and design online solutions that engage, inspire, and propel success.</p>
            </section> */}
            <section className="w-[100%] flex flex-col flex-nowrap items-center justify-center gap-7 px-mobileBound sm:px-8 sm:gap-8 md:gap-9 lg:gap-10">
                <h2>Our Projects</h2>
                <Projects />
            </section>
            {/* <section className="w-[100%] flex flex-col flex-nowrap items-center justify-center gap-7 px-mobileBound sm:px-8 sm:gap-8 md:gap-9 lg:gap-10">
                <h2>My Leetcode Graph</h2>
                <LeetCodeHeatMap />                
            </section> */}
            {/* <section className="w-[100%] flex flex-col flex-nowrap items-center justify-center gap-7 px-mobileBound sm:px-8 sm:gap-8 md:gap-9 lg:gap-10">
                <h2>Daily Quote</h2>
                <Dailyquotes />
            </section> */}
            <section className="w-[100%] flex flex-col flex-nowrap items-center justify-center gap-7 px-mobileBound sm:px-8 sm:gap-8 md:gap-9 lg:gap-10">
                <h2>Testimonials</h2>
                <Testimonials />
            </section>
            {/* <p className="text-center">Here are a few of my moments creations picturs:</p>
            <CubeCarousel name="desserts" carouselImages={dessertImages} /> */}
            <section className="w-[100%] flex flex-col flex-nowrap items-center justify-center gap-7 px-mobileBound sm:px-8 sm:gap-8 md:gap-9 lg:gap-10">
                <h2>Contact</h2>
                <Socials />
                <p className="text-center">Are you ready to connect me? Let&apos;s chat!</p>
                <ContactForm />
            </section>           
            
        </>
    );
}
