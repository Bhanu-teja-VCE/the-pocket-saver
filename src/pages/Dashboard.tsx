import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency, formatDate, cn } from '../utils';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from 'recharts';
import {
    Wallet,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    Plus,
    Trash2,
    Target,
    Download,
    FileText,
    FileSpreadsheet
} from 'lucide-react';
import { motion } from 'framer-motion';
import type { TransactionType } from '../context/FinanceContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export function Dashboard() {
    const {
        transactions, deleteTransaction, addTransaction,
        goals, addGoal, updateGoalProgress, deleteGoal,
        totalIncome, totalExpenses, balance,
        budgets, updateBudgetLimit
    } = useFinance();

    const [isAdding, setIsAdding] = useState(false);
    const [isAddingGoal, setIsAddingGoal] = useState(false);
    const [showExportMenu, setShowExportMenu] = useState(false);

    const [newTransaction, setNewTransaction] = useState({
        amount: '',
        description: '',
        category: 'General',
        type: 'expense' as TransactionType,
        date: new Date().toISOString().split('T')[0]
    });

    const [newGoal, setNewGoal] = useState({
        name: '',
        targetAmount: '',
        currentAmount: '0',
        color: '#0ea5e9'
    });

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTransaction.amount || !newTransaction.description) return;

        addTransaction({
            amount: parseFloat(newTransaction.amount),
            description: newTransaction.description,
            category: newTransaction.category,
            type: newTransaction.type,
            date: newTransaction.date
        });

        setNewTransaction({
            amount: '',
            description: '',
            category: 'General',
            type: 'expense',
            date: new Date().toISOString().split('T')[0]
        });
        setIsAdding(false);
    };

    const handleAddGoal = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newGoal.name || !newGoal.targetAmount) return;

        addGoal({
            name: newGoal.name,
            targetAmount: parseFloat(newGoal.targetAmount),
            currentAmount: parseFloat(newGoal.currentAmount),
            color: newGoal.color
        });

        setNewGoal({
            name: '',
            targetAmount: '',
            currentAmount: '0',
            color: '#0ea5e9'
        });
        setIsAddingGoal(false);
    };

    const exportToCSV = () => {
        const headers = ['Description', 'Category', 'Date', 'Type', 'Amount'];
        const data = transactions.map(t => [
            t.description,
            t.category,
            formatDate(new Date(t.date)),
            t.type,
            t.amount
        ]);

        const csvContent = [
            headers.join(','),
            ...data.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        setShowExportMenu(false);
    };

    const exportToPDF = () => {
        const doc = new jsPDF();

        doc.setFontSize(20);
        doc.text('Financial Report', 14, 22);

        doc.setFontSize(11);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

        const tableData = transactions.map(t => [
            t.description,
            t.category,
            formatDate(new Date(t.date)),
            t.type,
            formatCurrency(t.amount)
        ]);

        autoTable(doc, {
            head: [['Description', 'Category', 'Date', 'Type', 'Amount']],
            body: tableData,
            startY: 40,
        });

        doc.save(`finance_report_${new Date().toISOString().split('T')[0]}.pdf`);
        setShowExportMenu(false);
    };

    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(transactions.map(t => ({
            Description: t.description,
            Category: t.category,
            Date: formatDate(new Date(t.date)),
            Type: t.type,
            Amount: t.amount
        })));

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Transactions");
        XLSX.writeFile(wb, `finance_data_${new Date().toISOString().split('T')[0]}.xlsx`);
        setShowExportMenu(false);
    };

    // Prepare data for charts
    const monthlyData = transactions.reduce((acc, t) => {
        const month = new Date(t.date).toLocaleString('default', { month: 'short' });
        const existing = acc.find(d => d.name === month);
        if (existing) {
            if (t.type === 'income') existing.income += t.amount;
            else existing.expense += t.amount;
        } else {
            acc.push({
                name: month,
                income: t.type === 'income' ? t.amount : 0,
                expense: t.type === 'expense' ? t.amount : 0
            });
        }
        return acc;
    }, [] as any[]);

    const expenseByCategory = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => {
            const existing = acc.find(d => d.name === t.category);
            if (existing) existing.value += t.amount;
            else acc.push({ name: t.category, value: t.amount });
            return acc;
        }, [] as any[]);

    return (
        <div className="space-y-8">
            {/* Header with Export */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                <div className="relative">
                    <button
                        onClick={() => setShowExportMenu(!showExportMenu)}
                        className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        <Download className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                        <span className="text-gray-700 dark:text-gray-200">Export</span>
                    </button>

                    {showExportMenu && (
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 z-10">
                            <button onClick={exportToCSV} className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center text-gray-700 dark:text-gray-200">
                                <FileText className="h-4 w-4 mr-2" /> CSV
                            </button>
                            <button onClick={exportToExcel} className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center text-gray-700 dark:text-gray-200">
                                <FileSpreadsheet className="h-4 w-4 mr-2" /> Excel
                            </button>
                            <button onClick={exportToPDF} className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center text-gray-700 dark:text-gray-200">
                                <FileText className="h-4 w-4 mr-2" /> PDF
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-500 dark:text-gray-400 font-medium">Total Balance</h3>
                        <div className="p-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                            <Wallet className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{formatCurrency(balance)}</p>
                    <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <span className="text-green-500 font-medium flex items-center">
                            <TrendingUp className="h-4 w-4 mr-1" /> +2.5%
                        </span>
                        <span className="ml-2">from last month</span>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-500 dark:text-gray-400 font-medium">Income</h3>
                        <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <ArrowUpRight className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalIncome)}</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-500 dark:text-gray-400 font-medium">Expenses</h3>
                        <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                            <ArrowDownRight className="h-6 w-6 text-red-600 dark:text-red-400" />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalExpenses)}</p>
                </motion.div>
            </div>

            {/* Savings Goals & Category Budgets Grid */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
                {/* Savings Goals (2/3 width) */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Savings Goals</h3>
                        <button
                            onClick={() => setIsAddingGoal(!isAddingGoal)}
                            className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
                        >
                            <Plus className="h-4 w-4 mr-1" /> Add Goal
                        </button>
                    </div>

                    {isAddingGoal && (
                        <form onSubmit={handleAddGoal} className="mb-6 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 grid grid-cols-1 md:grid-cols-4 gap-4">
                            <input
                                type="text"
                                placeholder="Goal Name"
                                required
                                value={newGoal.name}
                                onChange={e => setNewGoal({ ...newGoal, name: e.target.value })}
                                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                            />
                            <input
                                type="number"
                                placeholder="Target Amount"
                                required
                                value={newGoal.targetAmount}
                                onChange={e => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
                                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                            />
                            <input
                                type="number"
                                placeholder="Current Amount"
                                value={newGoal.currentAmount}
                                onChange={e => setNewGoal({ ...newGoal, currentAmount: e.target.value })}
                                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                            />
                            <button type="submit" className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium text-sm">
                                Create Goal
                            </button>
                        </form>
                    )}

                    {goals.length === 0 ? (
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 text-center text-gray-500 dark:text-gray-400 text-sm">
                            No savings goals set. Define one to track your savings milestones!
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {goals.map(goal => {
                                const progress = Math.min(100, (goal.currentAmount / goal.targetAmount) * 100);
                                return (
                                    <div key={goal.id} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center">
                                                <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 mr-3">
                                                    <Target className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{goal.name}</h4>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">Target: {formatCurrency(goal.targetAmount)}</p>
                                                </div>
                                            </div>
                                            <button onClick={() => deleteGoal(goal.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                        <div className="mb-2 flex justify-between text-xs">
                                            <span className="text-gray-600 dark:text-gray-300 font-medium">{formatCurrency(goal.currentAmount)}</span>
                                            <span className="font-bold text-primary-600">{progress.toFixed(0)}%</span>
                                        </div>
                                        <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-primary-600 rounded-full transition-all duration-500"
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                        <div className="mt-4 flex gap-2">
                                            <button
                                                onClick={() => updateGoalProgress(goal.id, 100)}
                                                className="flex-1 py-1.5 text-xs font-semibold bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg transition-colors"
                                            >
                                                + $100
                                            </button>
                                            <button
                                                onClick={() => updateGoalProgress(goal.id, 500)}
                                                className="flex-1 py-1.5 text-xs font-semibold bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg transition-colors"
                                            >
                                                + $500
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Category Budgets Manager (1/3 width) */}
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Monthly Budgets</h3>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
                        <div className="max-h-[300px] overflow-y-auto space-y-4 pr-1">
                            {Object.keys(budgets).map(cat => {
                                const spent = transactions
                                    .filter(t => t.type === 'expense' && t.category === cat)
                                    .reduce((sum, t) => sum + t.amount, 0);
                                const limit = budgets[cat];
                                const percent = Math.min(100, limit > 0 ? (spent / limit) * 100 : 0);
                                
                                return (
                                    <div key={cat} className="space-y-1.5 animate-fade-in">
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="font-semibold text-gray-800 dark:text-gray-200">{cat}</span>
                                            <div className="flex items-center gap-1">
                                                <span className="text-gray-500 dark:text-gray-400 font-medium">${spent.toFixed(0)} /</span>
                                                <input 
                                                    type="number"
                                                    value={limit === 0 ? '' : limit}
                                                    placeholder="0"
                                                    onChange={(e) => updateBudgetLimit(cat, parseFloat(e.target.value) || 0)}
                                                    className="w-14 bg-gray-55 dark:bg-gray-900 border border-gray-200 dark:border-gray-750 rounded px-1.5 py-0.5 text-center font-bold text-gray-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary-500 text-[10px]"
                                                />
                                            </div>
                                        </div>
                                        <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                            <div 
                                                className={cn(
                                                    "h-full rounded-full transition-all duration-550",
                                                    percent >= 100 ? "bg-red-500" : percent >= 80 ? "bg-amber-500" : "bg-primary-500"
                                                )}
                                                style={{ width: `${percent}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700"
                >
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Income vs Expense</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={monthlyData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                                <XAxis dataKey="name" stroke="#6b7280" />
                                <YAxis stroke="#6b7280" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                                />
                                <Bar dataKey="income" fill="#22c55e" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700"
                >
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Expense Breakdown</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={expenseByCategory}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {expenseByCategory.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>

            {/* Transactions Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
            >
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Transactions</h3>
                    <button
                        onClick={() => setIsAdding(!isAdding)}
                        className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                        <Plus className="h-4 w-4 mr-2" /> Add New
                    </button>
                </div>

                {isAdding && (
                    <form onSubmit={handleAdd} className="p-6 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700 grid grid-cols-1 md:grid-cols-6 gap-4">
                        <input
                            type="text"
                            placeholder="Description"
                            required
                            value={newTransaction.description}
                            onChange={e => setNewTransaction({ ...newTransaction, description: e.target.value })}
                            className="md:col-span-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                        <input
                            type="number"
                            placeholder="Amount"
                            required
                            value={newTransaction.amount}
                            onChange={e => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                        <select
                            value={newTransaction.category}
                            onChange={e => setNewTransaction({ ...newTransaction, category: e.target.value })}
                            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                            {newTransaction.type === 'income' ? (
                                <>
                                    <option value="Salary">Salary 💰</option>
                                    <option value="Investments">Investments 📈</option>
                                    <option value="General">General 📦</option>
                                </>
                            ) : (
                                <>
                                    <option value="Food">Food 🍔</option>
                                    <option value="Utilities">Utilities ⚡</option>
                                    <option value="Rent">Rent 🏠</option>
                                    <option value="Shopping">Shopping 🛒</option>
                                    <option value="Entertainment">Entertainment 🎬</option>
                                    <option value="Travel">Travel ✈️</option>
                                    <option value="Healthcare">Healthcare 🏥</option>
                                    <option value="General">General 📦</option>
                                </>
                            )}
                        </select>
                        <select
                            value={newTransaction.type}
                            onChange={e => {
                                const newType = e.target.value as TransactionType;
                                setNewTransaction({ 
                                    ...newTransaction, 
                                    type: newType,
                                    category: newType === 'income' ? 'Salary' : 'General'
                                });
                            }}
                            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                            <option value="expense">Expense</option>
                            <option value="income">Income</option>
                        </select>
                        <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium">
                            Save
                        </button>
                    </form>
                )}

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 text-sm">
                            <tr>
                                <th className="px-6 py-4 font-medium">Description</th>
                                <th className="px-6 py-4 font-medium">Category</th>
                                <th className="px-6 py-4 font-medium">Date</th>
                                <th className="px-6 py-4 font-medium">Amount</th>
                                <th className="px-6 py-4 font-medium">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {transactions.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                        No transactions yet. Add one to get started!
                                    </td>
                                </tr>
                            ) : (
                                transactions.map((t) => (
                                    <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">{t.description}</td>
                                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                                                {t.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{formatDate(new Date(t.date))}</td>
                                        <td className={cn("px-6 py-4 font-bold", t.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400')}>
                                            {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => deleteTransaction(t.id)}
                                                className="text-gray-400 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
}
