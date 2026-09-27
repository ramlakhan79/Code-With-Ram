
import { getCopyrightYear } from "../utils/date";

export default function Footer() {
    return (
        <footer className="bg-neutGray-800 dark:bg-neutGray-1050 mt-auto px-mobileBound py-4 sm:px-6 sm:py-9 md:px-7 md:py-10 lg:px-8">
            <p className="font-thin text-center mx-auto">&copy; {getCopyrightYear()} Code With Ram. All rights reserved</p>
        </footer>
    );
}