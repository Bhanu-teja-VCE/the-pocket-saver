
import { Outlet, Link } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';

export function Layout() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 flex flex-col">
            <Navbar />
            <main className="flex-grow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Outlet />
                </div>
            </main>
            <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 transition-colors duration-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="col-span-1 md:col-span-2">
                            <Link to="/" className="flex items-center mb-4">
                                <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center mr-2">
                                    <span className="text-white font-bold text-xl">P</span>
                                </div>
                                <span className="text-xl font-bold text-gray-900 dark:text-white">Pocket Saver</span>
                            </Link>
                            <p className="text-gray-500 dark:text-gray-400 mb-4 max-w-xs">
                                Take control of your finances with our intuitive and powerful tracking tools. Start your journey to financial freedom today.
                            </p>
                            <div className="flex space-x-4">
                                <a href="#" className="text-gray-400 hover:text-primary-600 transition-colors">
                                    <Twitter className="h-5 w-5" />
                                </a>
                                <a href="#" className="text-gray-400 hover:text-primary-600 transition-colors">
                                    <Github className="h-5 w-5" />
                                </a>
                                <a href="#" className="text-gray-400 hover:text-primary-600 transition-colors">
                                    <Linkedin className="h-5 w-5" />
                                </a>
                                <a href="#" className="text-gray-400 hover:text-primary-600 transition-colors">
                                    <Mail className="h-5 w-5" />
                                </a>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                                Navigation
                            </h3>
                            <ul className="space-y-3">
                                <li>
                                    <Link to="/" className="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/about" className="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                                        About Us
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/blog" className="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                                        Blog
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/contact" className="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                                        Contact
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                                Legal
                            </h3>
                            <ul className="space-y-3">
                                <li>
                                    <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                                        Privacy Policy
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                                        Terms of Service
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                                        Cookie Policy
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                            © {new Date().getFullYear()} Pocket Saver. All rights reserved.
                        </p>
                        <p className="text-gray-400 dark:text-gray-500 text-sm mt-2 md:mt-0 flex items-center">
                            Made with <span className="text-red-500 mx-1">❤</span> for better finance
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
