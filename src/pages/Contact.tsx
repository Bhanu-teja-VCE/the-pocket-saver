import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Send } from 'lucide-react';

export function Contact() {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
        // Simulate form submission
        setTimeout(() => setSubmitted(false), 3000);
    };

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <div className="text-center space-y-4 mb-12">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Get in Touch</h1>
                <p className="text-xl text-gray-500 dark:text-gray-400">
                    Have questions? We'd love to hear from you.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-8"
                >
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 rounded-xl flex items-center justify-center mb-6">
                            <Mail className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Email Us</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-4">
                            For general inquiries and support.
                        </p>
                        <a href="mailto:hello@pocketsaver.com" className="text-primary-600 dark:text-primary-400 font-medium hover:underline">
                            hello@pocketsaver.com
                        </a>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 rounded-xl flex items-center justify-center mb-6">
                            <MessageSquare className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Live Chat</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-4">
                            Available Mon-Fri, 9am - 5pm EST.
                        </p>
                        <button className="text-primary-600 dark:text-primary-400 font-medium hover:underline">
                            Start a conversation
                        </button>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700"
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                required
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                required
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Message
                            </label>
                            <textarea
                                id="message"
                                rows={4}
                                required
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            disabled={submitted}
                            className="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 disabled:bg-green-600 text-white font-medium rounded-lg shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 flex items-center justify-center gap-2"
                        >
                            {submitted ? (
                                'Message Sent!'
                            ) : (
                                <>
                                    Send Message <Send className="h-4 w-4" />
                                </>
                            )}
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
