
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import HeaderLogo from './HeaderLogo';

Header.propTypes = {
    isDarkMode: PropTypes.bool.isRequired,
    toggleDarkMode: PropTypes.func.isRequired,
};

export default function Header({ isDarkMode, toggleDarkMode }) {
    return (
        <header className="flex flex-row flex-wrap justify-between items-center gap-6 px-mobileBound pt-1 pb-1 text-gray-900">
            <Link to="/">
                <HeaderLogo isDarkMode={isDarkMode} />
            </Link>
            <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
        </header>
    );
}