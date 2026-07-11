
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight } from 'lucide-react';

const BLOG_POSTS = [
    {
        id: 1,
        title: '5 Tips for Better Budgeting in 2024',
        excerpt: 'Learn the fundamental rules of budgeting that can help you save more without sacrificing your lifestyle.',
        author: 'Sarah Johnson',
        date: 'Mar 15, 2024',
        category: 'Budgeting',
        image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800'
    },
    {
        id: 2,
        title: 'Understanding Compound Interest',
        excerpt: 'Why starting early is the most important factor in building long-term wealth.',
        author: 'Mike Chen',
        date: 'Mar 12, 2024',
        category: 'Investing',
        image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=800'
    },
    {
        id: 3,
        title: 'Minimalist Finance: Less is More',
        excerpt: 'How simplifying your financial life can lead to better decisions and less stress.',
        author: 'Emma Wilson',
        date: 'Mar 10, 2024',
        category: 'Lifestyle',
        image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800'
    }
];

export function Blog() {
    return (
        <div className="space-y-12 pb-20">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Financial Insights</h1>
                <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                    Expert advice and tips to help you make smarter financial decisions.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {BLOG_POSTS.map((post, index) => (
                    <motion.article
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow duration-200"
                    >
                        <div className="h-48 overflow-hidden">
                            <img
                                src={post.image}
                                alt={post.title}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                                <span className="bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 px-3 py-1 rounded-full text-xs font-medium">
                                    {post.category}
                                </span>
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {post.date}
                                </div>
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2">
                                {post.title}
                            </h2>
                            <p className="text-gray-500 dark:text-gray-400 line-clamp-3 text-sm">
                                {post.excerpt}
                            </p>
                            <div className="pt-4 flex items-center justify-between border-t border-gray-100 dark:border-gray-700">
                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                    <User className="h-4 w-4" />
                                    {post.author}
                                </div>
                                <button className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium flex items-center gap-1">
                                    Read More <ArrowRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </motion.article>
                ))}
            </div>
        </div>
    );
}
