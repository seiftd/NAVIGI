exports.handler = async (event, context) => {
    // Set CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Handle preflight requests
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    if (event.httpMethod !== 'GET') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const { platform } = event.queryStringParameters || {};

        // In real implementation, fetch from database
        // SELECT * FROM vip_requests WHERE platform = ? AND status = 'pending'
        
        const mockVipRequests = [
            {
                id: 'vip_req_001',
                user_id: '123456789',
                username: '@cryptoking',
                tier: 'EMPEROR',
                amount: '$9.00',
                payment_method: 'TON',
                transaction_hash: 'EQA1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z6',
                submitted_at: '2024-01-15 10:30:00',
                status: 'pending',
                platform: platform || 'telegram_bot'
            },
            {
                id: 'vip_req_002',
                user_id: '987654321',
                username: '@pointmaster',
                tier: 'KING',
                amount: '$2.50',
                payment_method: 'TRC20',
                transaction_hash: 'TRX1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T1U2V3W4X5Y6Z7',
                submitted_at: '2024-01-15 09:15:00',
                status: 'pending',
                platform: platform || 'telegram_bot'
            },
            {
                id: 'vip_req_003',
                user_id: '456789123',
                username: '@vipuser',
                tier: 'LORD',
                amount: '$25.00',
                payment_method: 'TON',
                transaction_hash: 'EQB1C2D3E4F5G6H7I8J9K0L1M2N3O4P5Q6R7S8T9U0V1W2X3Y4Z5A6',
                submitted_at: '2024-01-15 08:45:00',
                status: 'pending',
                platform: platform || 'telegram_bot'
            }
        ];

        // Filter by platform if specified
        const filteredRequests = platform 
            ? mockVipRequests.filter(req => req.platform === platform)
            : mockVipRequests;

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(filteredRequests)
        };

    } catch (error) {
        console.error('Error fetching VIP requests:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'Internal server error',
                message: error.message
            })
        };
    }
};