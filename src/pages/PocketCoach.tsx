import { useState, useRef, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';
import { askFinancialCoach, type ChatMessage } from '../services/geminiService';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Send, Sparkles, AlertTriangle, Key, 
    TrendingUp, Shield, HelpCircle, ArrowRight 
} from 'lucide-react';
import { formatCurrency, cn } from '../utils';

export function PocketCoach() {
    const { transactions, goals, budgets, balance, totalIncome, totalExpenses } = useFinance();
    const [messages, setMessages] = useState<ChatMessage[]>(() => {
        const saved = localStorage.getItem('coach_messages');
        return saved ? JSON.parse(saved) : [
            {
                role: 'model',
                text: "Hello! I'm **PocketCoach AI**, your personal financial assistant. I've analyzed your current transactions, budgets, and savings goals. Ask me anything about budgeting, saving, or optimization!"
            }
        ];
    });
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const chatEndRef = useRef<HTMLDivElement>(null);

    const apiKey = localStorage.getItem('GEMINI_API_KEY') || '';

    useEffect(() => {
        localStorage.setItem('coach_messages', JSON.stringify(messages));
    }, [messages]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    // Calculate local categories spending context
    const categorySpend = Object.keys(budgets).reduce((acc, cat) => {
        const spent = transactions
            .filter(t => t.type === 'expense' && t.category === cat)
            .reduce((sum, t) => sum + t.amount, 0);
        acc[cat] = {
            spent,
            limit: budgets[cat]
        };
        return acc;
    }, {} as { [key: string]: { spent: number; limit: number } });

    // Find over-budget categories
    const overBudgetCategories = Object.keys(categorySpend).filter(
        cat => categorySpend[cat].spent > categorySpend[cat].limit
    );

    // Prepare context bundle for Gemini API
    const getContextData = () => {
        return {
            balance,
            totalIncome,
            totalExpenses,
            goals,
            categorySpend,
            recentTransactions: transactions.slice(0, 20).map(t => ({
                description: t.description,
                amount: t.amount,
                category: t.category,
                type: t.type,
                date: t.date
            }))
        };
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userText = input.trim();
        setInput('');
        setErrorMsg('');
        setIsLoading(true);

        const newMessages = [...messages, { role: 'user' as const, text: userText }];
        setMessages(newMessages);

        try {
            const aiResponse = await askFinancialCoach(
                userText,
                messages,
                getContextData()
            );
            setMessages(prev => [...prev, { role: 'model' as const, text: aiResponse }]);
        } catch (error: any) {
            console.error(error);
            if (error.message === 'API_KEY_MISSING') {
                setErrorMsg('Gemini API Key is missing. Please add it in settings.');
            } else {
                setErrorMsg('Failed to fetch response. Please verify your internet and API key.');
            }
            // Remove user message to let them retry easily
            setMessages(messages);
            setInput(userText);
        } finally {
            setIsLoading(false);
        }
    };

    const clearChat = () => {
        const initial = [
            {
                role: 'model' as const,
                text: "Hello! I'm **PocketCoach AI**, your personal financial assistant. Ask me anything about budgeting, saving, or optimization!"
            }
        ];
        setMessages(initial);
        localStorage.setItem('coach_messages', JSON.stringify(initial));
    };

    if (!apiKey) {
        return (
            <div className="max-w-2xl mx-auto py-12 px-4">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl p-8 text-center space-y-6 shadow-xl"
                >
                    <div className="mx-auto w-16 h-16 bg-primary-50 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center">
                        <Sparkles className="h-8 w-8 text-primary-600 dark:text-primary-400 animate-pulse" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Unlock Your AI Financial Coach</h2>
                        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto text-sm leading-relaxed">
                            PocketCoach AI analyzes your cashflow, budgets, and savings goals directly in your browser. To protect your privacy, we connect to Gemini using your own API key.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 text-left">
                        <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                            <Shield className="h-5 w-5 text-green-500 mb-2" />
                            <h4 className="font-semibold text-gray-900 dark:text-white text-xs">Local & Secure</h4>
                            <p className="text-[10px] text-gray-500">Your transactions never leave your device.</p>
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                            <Key className="h-5 w-5 text-yellow-500 mb-2" />
                            <h4 className="font-semibold text-gray-900 dark:text-white text-xs">Free API Key</h4>
                            <p className="text-[10px] text-gray-500">Get a free key from Google AI Studio.</p>
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                            <TrendingUp className="h-5 w-5 text-primary-500 mb-2" />
                            <h4 className="font-semibold text-gray-900 dark:text-white text-xs">Smart Audits</h4>
                            <p className="text-[10px] text-gray-500">Instant spending warnings and optimization tips.</p>
                        </div>
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                        <a 
                            href="https://aistudio.google.com/" 
                            target="_blank" 
                            rel="noreferrer"
                            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-700 text-sm font-medium rounded-xl text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            Get Free Key <ArrowRight className="ml-2 h-4 w-4" />
                        </a>
                        <button 
                            onClick={() => window.dispatchEvent(new Event('toggle-settings'))}
                            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-primary-600 hover:bg-primary-700 shadow-md transition-colors"
                        >
                            <Key className="mr-2 h-4 w-4" /> Configure Key
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pb-12">
            {/* Chat Panel */}
            <div className="lg:col-span-3 flex flex-col h-[calc(100vh-12rem)] min-h-[500px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl overflow-hidden shadow-sm">
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-primary-50 dark:bg-primary-900/20 rounded-xl">
                            <Sparkles className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 dark:text-white text-sm">PocketCoach AI</h3>
                            <p className="text-[10px] text-green-500 font-medium">Active • Connected to Gemini 1.5 Flash</p>
                        </div>
                    </div>
                    <button 
                        onClick={clearChat}
                        className="text-xs text-gray-500 hover:text-red-500 font-semibold"
                    >
                        Clear History
                    </button>
                </div>

                {/* Messages Box */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <AnimatePresence initial={false}>
                        {messages.map((msg, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={cn(
                                    "flex",
                                    msg.role === 'user' ? "justify-end" : "justify-start"
                                )}
                            >
                                <div className={cn(
                                    "max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm leading-relaxed",
                                    msg.role === 'user'
                                        ? "bg-primary-600 text-white rounded-tr-none"
                                        : "bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 rounded-tl-none border border-gray-200/50 dark:border-gray-800"
                                )}>
                                    {/* Simple Markdown Bold handler */}
                                    <p className="whitespace-pre-line">
                                        {msg.text.split('**').map((part, i) => i % 2 === 1 ? <strong key={i} className="font-bold text-primary-600 dark:text-primary-400">{part}</strong> : part)}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-gray-100 dark:bg-gray-900 text-gray-400 rounded-2xl rounded-tl-none px-4 py-3 text-sm border border-gray-200/50 dark:border-gray-800 flex items-center space-x-2">
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    )}
                    {errorMsg && (
                        <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-xl text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4" />
                            <span>{errorMsg}</span>
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>

                {/* Input Box */}
                <form onSubmit={handleSend} className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex gap-2">
                    <input
                        type="text"
                        placeholder="Ask about your budget, savings goals, or spending..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={isLoading}
                        className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="p-3 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white rounded-xl transition-colors shadow-sm"
                    >
                        <Send className="h-5 w-5" />
                    </button>
                </form>
            </div>

            {/* AI Insights Sidebar */}
            <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-3xl shadow-sm">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                        Live Budget Warnings
                    </h4>
                    {overBudgetCategories.length === 0 ? (
                        <p className="text-xs text-gray-500 dark:text-gray-400">All category spends are currently within limits. Good job!</p>
                    ) : (
                        <div className="space-y-3">
                            {overBudgetCategories.map(cat => (
                                <div key={cat} className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 rounded-xl text-xs space-y-1">
                                    <div className="flex justify-between font-bold text-amber-800 dark:text-amber-300">
                                        <span>{cat} Overspend</span>
                                        <span>{((categorySpend[cat].spent / categorySpend[cat].limit) * 100).toFixed(0)}%</span>
                                    </div>
                                    <p className="text-[10px] text-amber-600 dark:text-amber-400">
                                        Spent {formatCurrency(categorySpend[cat].spent)} of your {formatCurrency(categorySpend[cat].limit)} budget limit.
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-3xl shadow-sm">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
                        <HelpCircle className="h-4 w-4 text-primary-500" />
                        Suggested Queries
                    </h4>
                    <div className="flex flex-col gap-2">
                        {[
                            "Give me a summary of my financial health.",
                            "Which categories should I cut down on?",
                            "How can I reach my savings goals faster?",
                            "Analyze my spending for this month."
                        ].map((q, i) => (
                            <button
                                key={i}
                                onClick={() => setInput(q)}
                                className="text-left text-xs p-2.5 bg-gray-50 hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-900/80 rounded-xl text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-gray-800 hover:border-primary-500 transition-colors"
                            >
                                {q}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
