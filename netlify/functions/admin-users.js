exports.handler = async (event, context) => {
    // Set CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
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
        const { platform, limit = 100 } = event.queryStringParameters || {};

        console.log('Fetching users for platform:', platform);

        // In real implementation, fetch from database:
        // const users = await db.query('SELECT id, telegram_id, username, vip_status FROM users WHERE platform = ? LIMIT ?', [platform, limit]);

        // Mock users data for testing bot communication
        const mockUsers = [
            {
                id: 1,
                telegram_id: '123456789', // Replace with real telegram IDs
                username: 'testuser1',
                vip_status: 'FREE',
                platform: 'telegram_bot',
                created_at: new Date().toISOString()
            },
            {
                id: 2,
                telegram_id: '987654321', // Replace with real telegram IDs
                username: 'testuser2',
                vip_status: 'KING',
                platform: 'telegram_bot',
                created_at: new Date().toISOString()
            }
        ];

        // Filter by platform if specified
        const filteredUsers = platform ? 
            mockUsers.filter(user => user.platform === platform) : 
            mockUsers;

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                users: filteredUsers,
                total: filteredUsers.length,
                platform: platform || 'all'
            })
        };

    } catch (error) {
        console.error('Admin users fetch error:', error);
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