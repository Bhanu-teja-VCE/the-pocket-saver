
import { motion } from 'framer-motion';
import { Shield, Users, Globe } from 'lucide-react';

export function About() {
  return (
    <div className="max-w-4xl mx-auto space-y-16 pb-20">
      <section className="text-center space-y-6">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-gray-900 dark:text-white"
        >
          About Pocket Saver
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-gray-500 dark:text-gray-400"
        >
          We're on a mission to democratize financial freedom.
        </motion.p>
      </section>

      <section className="grid md:grid-cols-3 gap-8">
        {[
          {
            icon: <Shield className="h-8 w-8 text-primary-500" />,
            title: 'Trust & Security',
            description: 'We prioritize your data privacy with local-first storage architecture.'
          },
          {
            icon: <Users className="h-8 w-8 text-primary-500" />,
            title: 'User Focused',
            description: 'Built with feedback from real users to solve real financial problems.'
          },
          {
            icon: <Globe className="h-8 w-8 text-primary-500" />,
            title: 'Global Reach',
            description: 'Supporting multiple currencies and financial systems worldwide.'
          }
        ].map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
          >
            <div className="mx-auto w-12 h-12 bg-primary-50 dark:bg-primary-900/20 rounded-full flex items-center justify-center mb-4">
              {item.icon}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h3>
            <p className="text-gray-500 dark:text-gray-400">{item.description}</p>
          </motion.div>
        ))}
      </section>

      <section className="bg-primary-50 dark:bg-primary-900/10 rounded-3xl p-8 md:p-12 text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Our Story</h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
          Founded in 2024, Pocket Saver started as a simple spreadsheet replacement. We realized that personal finance tools were either too complex or too simple. We set out to build the sweet spot: powerful analytics wrapped in a beautiful, easy-to-use interface.
        </p>
      </section>
    </div>
  );
}
