import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export type TransactionType = 'income' | 'expense';

export interface Transaction {
    id: string;
    type: TransactionType;
    amount: number;
    category: string;
    date: string;
    description: string;
}

export interface SavingsGoal {
    id: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
    color: string;
}

interface FinanceContextType {
    transactions: Transaction[];
    goals: SavingsGoal[];
    addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
    deleteTransaction: (id: string) => void;
    addGoal: (goal: Omit<SavingsGoal, 'id'>) => void;
    updateGoalProgress: (id: string, amount: number) => void;
    deleteGoal: (id: string) => void;
    totalIncome: number;
    totalExpenses: number;
    balance: number;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export function FinanceProvider({ children }: { children: React.ReactNode }) {
    const [transactions, setTransactions] = useState<Transaction[]>(() => {
        const saved = localStorage.getItem('transactions');
        return saved ? JSON.parse(saved) : [];
    });

    const [goals, setGoals] = useState<SavingsGoal[]>(() => {
        const saved = localStorage.getItem('goals');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('transactions', JSON.stringify(transactions));
    }, [transactions]);

    useEffect(() => {
        localStorage.setItem('goals', JSON.stringify(goals));
    }, [goals]);

    const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
        const newTransaction = { ...transaction, id: uuidv4() };
        setTransactions((prev) => [newTransaction, ...prev]);
    };

    const deleteTransaction = (id: string) => {
        setTransactions((prev) => prev.filter((t) => t.id !== id));
    };

    const addGoal = (goal: Omit<SavingsGoal, 'id'>) => {
        const newGoal = { ...goal, id: uuidv4() };
        setGoals((prev) => [...prev, newGoal]);
    };

    const updateGoalProgress = (id: string, amount: number) => {
        setGoals((prev) =>
            prev.map((g) =>
                g.id === id ? { ...g, currentAmount: Math.min(g.targetAmount, Math.max(0, g.currentAmount + amount)) } : g
            )
        );
    };

    const deleteGoal = (id: string) => {
        setGoals((prev) => prev.filter((g) => g.id !== id));
    };

    const totalIncome = transactions
        .filter((t) => t.type === 'income')
        .reduce((acc, curr) => acc + curr.amount, 0);

    const totalExpenses = transactions
        .filter((t) => t.type === 'expense')
        .reduce((acc, curr) => acc + curr.amount, 0);

    const balance = totalIncome - totalExpenses;

    return (
        <FinanceContext.Provider
            value={{
                transactions,
                goals,
                addTransaction,
                deleteTransaction,
                addGoal,
                updateGoalProgress,
                deleteGoal,
                totalIncome,
                totalExpenses,
                balance,
            }}
        >
            {children}
        </FinanceContext.Provider>
    );
}

export function useFinance() {
    const context = useContext(FinanceContext);
    if (context === undefined) {
        throw new Error('useFinance must be used within a FinanceProvider');
    }
    return context;
}
