import { GoogleGenAI } from '@google/genai';

export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}

export const askFinancialCoach = async (
    prompt: string,
    history: ChatMessage[],
    contextData: {
        balance: number;
        totalIncome: number;
        totalExpenses: number;
        goals: any[];
        categorySpend: { [category: string]: { spent: number; limit: number } };
        recentTransactions: any[];
    }
) => {
    const apiKey = localStorage.getItem('GEMINI_API_KEY') || '';
    if (!apiKey) {
        throw new Error('API_KEY_MISSING');
    }

    const ai = new GoogleGenAI({ apiKey });
    
    // Inject current financial state as system instructions
    const systemInstruction = `
You are PocketCoach AI, a premium, intelligent personal finance advisor.
You are helping the user manage their money, budget, and savings. 
Use a friendly, encouraging, professional, and highly analytical tone.

Current Financial Context:
- Current Balance: $${contextData.balance.toFixed(2)}
- Total Income: $${contextData.totalIncome.toFixed(2)}
- Total Expenses: $${contextData.totalExpenses.toFixed(2)}
- Active Savings Goals: ${JSON.stringify(contextData.goals)}
- Monthly Category Budgets (Limit set vs Current Spend): ${JSON.stringify(contextData.categorySpend)}
- Recent Transactions (Past 20): ${JSON.stringify(contextData.recentTransactions)}

Guidelines:
- Analyze their spending and warn them if they are close to or over budget.
- Give constructive, actionable advice (e.g. "You've spent 92% of your Utilities budget. Consider unplugging devices or checking for service plans").
- If they ask about saving, calculate how long it will take to hit their Savings Goals based on current cashflow.
- Keep responses relatively brief (2-4 paragraphs) and structured using clean markdown format.
`;

    const contents = [
        ...history.map(msg => ({
            role: msg.role === 'user' ? 'user' as const : 'model' as const,
            parts: [{ text: msg.text }]
        })),
        {
            role: 'user' as const,
            parts: [{ text: prompt }]
        }
    ];

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-1.5-flash',
            contents,
            config: {
                systemInstruction,
                maxOutputTokens: 500,
            }
        });
        
        if (!response.text) {
            throw new Error('Empty response from AI');
        }
        
        return response.text;
    } catch (error: any) {
        console.error('Gemini error:', error);
        throw error;
    }
};
