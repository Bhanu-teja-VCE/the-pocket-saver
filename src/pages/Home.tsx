
import { Link } from 'react-router-dom';
import { ArrowRight, PieChart, Shield, Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';

export function Home() {
    return (
        <div className="space-y-20 pb-20">
            {/* Hero Section */}
            <section className="text-center space-y-8 pt-10 sm:pt-20">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl sm:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight"
                >
                    Master Your Money with <br />
                    <span className="text-primary-600 dark:text-primary-400">Pocket Saver</span>
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400"
                >
                    Track expenses, set savings goals, and visualize your financial health with our intuitive and secure platform.
                </motion.p>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex justify-center gap-4"
                >
                    <Link
                        to="/dashboard"
                        className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-primary-600 hover:bg-primary-700 transition-colors duration-200"
                    >
                        Get Started <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                    <Link
                        to="/about"
                        className="inline-flex items-center px-8 py-3 border border-gray-300 dark:border-gray-700 text-base font-medium rounded-full text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                    >
                        Learn More
                    </Link>
                </motion.div>
            </section>

            {/* Features Section */}
            <section className="grid md:grid-cols-3 gap-8 px-4">
                {[
                    {
                        icon: <PieChart className="h-8 w-8 text-primary-500" />,
                        title: 'Visual Analytics',
                        description: 'Understand your spending habits with interactive charts and detailed reports.',
                    },
                    {
                        icon: <Shield className="h-8 w-8 text-primary-500" />,
                        title: 'Secure & Private',
                        description: 'Your financial data is encrypted and stored locally on your device.',
                    },
                    {
                        icon: <Smartphone className="h-8 w-8 text-primary-500" />,
                        title: 'Mobile Friendly',
                        description: 'Access your dashboard from anywhere, on any device, with a responsive design.',
                    },
                ].map((feature, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow duration-200"
                    >
                        <div className="bg-primary-50 dark:bg-primary-900/20 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                            {feature.icon}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                        <p className="text-gray-500 dark:text-gray-400 leading-relaxed">{feature.description}</p>
                    </motion.div>
                ))}
            </section>
        </div>
    );
}
