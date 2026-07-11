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

export interface ParsedTransaction {
    amount: number;
    description: string;
    category: string;
    type: 'income' | 'expense';
    date: string;
    isFallback: boolean;
}

export const parseNaturalLanguageTransaction = async (
    text: string
): Promise<ParsedTransaction> => {
    const apiKey = localStorage.getItem('GEMINI_API_KEY') || '';

    const localRegexParse = (input: string): ParsedTransaction => {
        const amountRegex = /(\d+(?:\.\d{1,2})?)/;
        const amountMatch = input.match(amountRegex);
        const amount = amountMatch ? parseFloat(amountMatch[1]) : 0;
        
        let type: 'income' | 'expense' = 'expense';
        let category = 'General';
        let description = input;
        
        const lowerText = input.toLowerCase();
        if (
            lowerText.includes('got') || 
            lowerText.includes('received') || 
            lowerText.includes('bonus') || 
            lowerText.includes('earned') || 
            lowerText.includes('income') || 
            lowerText.includes('+') || 
            lowerText.includes('salary')
        ) {
            type = 'income';
            category = 'Salary';
        }
        
        return {
            amount,
            description,
            category,
            type,
            date: new Date().toISOString().split('T')[0],
            isFallback: true
        };
    };
    
    if (!apiKey) {
        return localRegexParse(text);
    }

    const ai = new GoogleGenAI({ apiKey });
    const systemInstruction = `
You are a transaction parser. Extract data from natural language and return it strictly as a JSON object.

Allowed Categories for expenses: "Food", "Utilities", "Rent", "Shopping", "Entertainment", "Travel", "Healthcare", "General".
Allowed Categories for income: "Salary", "Investments", "General".

Allowed Types: "income" or "expense".

JSON format to return:
{
  "amount": number (positive float),
  "description": "string describing the item/event",
  "category": "one of the allowed categories above",
  "type": "income" | "expense",
  "date": "YYYY-MM-DD" (use the current date ${new Date().toISOString().split('T')[0]} as default unless specified)
}

Do not return any markdown code block formatting (like \`\`\`json). Just return the raw JSON string. If you cannot parse it, default to a category of "General" and type "expense".
`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: text,
            config: {
                systemInstruction,
                responseMimeType: 'application/json',
                maxOutputTokens: 150,
            }
        });

        if (!response.text) {
            throw new Error('Empty response');
        }

        const data = JSON.parse(response.text.trim());
        return {
            amount: Number(data.amount) || 0,
            description: data.description || text,
            category: data.category || 'General',
            type: (data.type === 'income' || data.type === 'expense') ? data.type : 'expense',
            date: data.date || new Date().toISOString().split('T')[0],
            isFallback: false
        };
    } catch (error) {
        console.error('Failed to parse with AI, falling back to regex:', error);
        return localRegexParse(text);
    }
};
