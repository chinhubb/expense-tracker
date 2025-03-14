const API_URL = `${process.env.REACT_APP_API_URL}/api/transactions`;

const apiRequest = async (endpoint: string, options?: RequestInit) => {
    try {
        const res = await fetch(`${API_URL}${endpoint}`, options);

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`API Error: ${res.status} ${res.statusText} - ${errorText}`);
        }

        return await res.json();
    } catch (error) {
        console.error('API Request Failed:', error);
        return null;
    }
};

export const fetchTransactions = async () => {
    return await apiRequest('/');
};

export const addTransaction = async (transaction: { type: string; amount: number; date: string; note?: string }) => {
    return await apiRequest('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transaction),
    });
};
