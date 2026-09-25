
import { useOutletContext } from "react-router-dom";
import Socials from "../components/Socials";
import Projects from "../components/Projects";
import LeetCodeHeatMap from "../components/LeetCodeHeatMap";
import Dailyquotes from "../components/Dailyquotes";
// import Testimonials from "../components/Testimonials";
import SplashSection from "../components/SplashSection";
import ContactForm from "../components/ContactForm";

export default function Home() {
    const [isDarkMode] = useOutletContext();

    return (
        <>
            <SplashSection splashMessage={'Code With Ram'} isDarkMode={isDarkMode} isErrorMode={false} />
            {/* <section className="w-[100%] flex flex-col flex-nowrap items-center justify-center gap-7 px-mobileBound sm:px-8 sm:gap-8 md:gap-9 lg:gap-10">
                <h1 className="text-center max-w-[18em]">Problem Solving and Web Experiences</h1>
                <p className="text-justify">Hello, and welcome! I&apos;m Ramlakhan Lodhi, a MERN-Stack Aspiring developer. I am a passionate competitive programmer and highly interested in algorithmic problem solving. I am very interested in new technologies and am always eager to learn new technologies that enhance my knowledge. Together, let&apos;s Explore the vast opportunities in the digital world and design online solutions that engage, inspire, and propel success.</p>
            </section> */}
            {/* <section className="w-[100%] flex flex-col flex-nowrap items-center justify-center gap-7 px-mobileBound sm:px-8 sm:gap-8 md:gap-9 lg:gap-10">
                <h2>My Projects</h2>
                <Projects />
            </section> */}
            {/* <section className="w-[100%] flex flex-col flex-nowrap items-center justify-center gap-7 px-mobileBound sm:px-8 sm:gap-8 md:gap-9 lg:gap-10">
                <h2>My Leetcode Graph</h2>
                <LeetCodeHeatMap />                
            </section> */}
            {/* <section className="w-[100%] flex flex-col flex-nowrap items-center justify-center gap-7 px-mobileBound sm:px-8 sm:gap-8 md:gap-9 lg:gap-10">
                <h2>Daily Quote</h2>
                <Dailyquotes />
            </section> */}
            {/* <section className="w-[100%] flex flex-col flex-nowrap items-center justify-center gap-7 px-mobileBound sm:px-8 sm:gap-8 md:gap-9 lg:gap-10">
                <h2>Testimonials</h2>
                <Testimonials />
            </section> */}
            <section className="w-[100%] flex flex-col flex-nowrap items-center justify-center gap-7 px-mobileBound sm:px-8 sm:gap-8 md:gap-9 lg:gap-10">
                <h2>Contact</h2>
                <Socials />
                <p className="text-center">Are you ready to connect me? Let&apos;s chat!</p>
                <ContactForm />
            </section>
            {/* connect for login page
            <section className="w-[100%] flex flex-col flex-nowrap items-center justify-center gap-7 px-mobileBound sm:px-8 sm:gap-8 md:gap-9 lg:gap-10">
                <p className="text-center">Please login to manage your articles.</p>
                <a href="/login" className="glassy-icon px-6 py-3 border rounded-lg"> Login</a>
            </section> */}
            
        </>
    );
}
