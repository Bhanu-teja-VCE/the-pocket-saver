import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Menu, X, Sun, Moon, LogOut, User, Wallet } from 'lucide-react';
import { cn } from '../utils';

export function Navbar() {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navLinks = [
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'About', path: '/about' },
        { name: 'Blog', path: '/blog' },
        { name: 'Contact', path: '/contact' },
    ];

    return (
        <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <NavLink to="/" className="flex-shrink-0 flex items-center gap-2">
                            <Wallet className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                            <span className="text-xl font-bold text-gray-900 dark:text-white">Pocket Saver</span>
                        </NavLink>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            {user && navLinks.map((link) => (
                                <NavLink
                                    key={link.path}
                                    to={link.path}
                                    className={({ isActive }) =>
                                        cn(
                                            'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200',
                                            isActive
                                                ? 'border-primary-500 text-gray-900 dark:text-white'
                                                : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-300'
                                        )
                                    }
                                >
                                    {link.name}
                                </NavLink>
                            ))}
                        </div>
                    </div>
                    <div className="hidden sm:ml-6 sm:flex sm:items-center gap-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                        </button>

                        {user ? (
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                                    <User className="h-4 w-4" />
                                    <span>{user.name}</span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 rounded-full text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 focus:outline-none"
                                    title="Logout"
                                >
                                    <LogOut className="h-5 w-5" />
                                </button>
                            </div>
                        ) : (
                            <NavLink
                                to="/login"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
                            >
                                Sign In
                            </NavLink>
                        )}
                    </div>
                    <div className="-mr-2 flex items-center sm:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <div className={cn('sm:hidden', isOpen ? 'block' : 'hidden')}>
                <div className="pt-2 pb-3 space-y-1">
                    {user && navLinks.map((link) => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            onClick={() => setIsOpen(false)}
                            className={({ isActive }) =>
                                cn(
                                    'block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-200',
                                    isActive
                                        ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-500 text-primary-700 dark:text-primary-300'
                                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-300'
                                )
                            }
                        >
                            {link.name}
                        </NavLink>
                    ))}
                </div>
                <div className="pt-4 pb-4 border-t border-gray-200 dark:border-gray-800">
                    <div className="flex items-center px-4 justify-between">
                        {user ? (
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                                        <User className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                                    </div>
                                </div>
                                <div className="ml-3">
                                    <div className="text-base font-medium text-gray-800 dark:text-white">{user.name}</div>
                                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{user.email}</div>
                                </div>
                            </div>
                        ) : (
                            <NavLink
                                to="/login"
                                onClick={() => setIsOpen(false)}
                                className="text-base font-medium text-gray-800 dark:text-white hover:text-primary-600"
                            >
                                Sign In
                            </NavLink>
                        )}
                        <button
                            onClick={toggleTheme}
                            className="ml-auto flex-shrink-0 p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                            {theme === 'light' ? <Moon className="h-6 w-6" /> : <Sun className="h-6 w-6" />}
                        </button>
                    </div>
                    {user && (
                        <div className="mt-3 space-y-1">
                            <button
                                onClick={() => {
                                    handleLogout();
                                    setIsOpen(false);
                                }}
                                className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                            >
                                Sign out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
