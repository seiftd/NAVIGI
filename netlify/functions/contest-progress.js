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

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const data = JSON.parse(event.body);
        const { user_id, username, contest_type, ads_watched, platform, timestamp } = data;

        // Validate required fields
        if (!user_id || !contest_type || ads_watched === undefined) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Missing required fields' })
            };
        }

        // Validate contest type
        if (!['daily', 'weekly', 'monthly', 'vip'].includes(contest_type)) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Invalid contest type' })
            };
        }

        // Log contest progress
        console.log('Contest Progress Update:', {
            user_id,
            username,
            contest_type,
            ads_watched,
            platform,
            timestamp: new Date(timestamp).toISOString()
        });

        // In real implementation, save to database:
        // await db.query('UPDATE contest_participants SET ads_watched = ?, last_activity = NOW() WHERE user_id = ? AND contest_type = ?', 
        //                [ads_watched, user_id, contest_type]);
        
        // Check if user meets requirements for contest entry
        const requirements = { daily: 10, weekly: 30, monthly: 200, vip: 50 };
        const isEligible = ads_watched >= requirements[contest_type];
        
        if (isEligible) {
            console.log(`User ${user_id} is now eligible for ${contest_type} contest!`);
            
            // In real implementation, mark user as eligible:
            // await db.query('INSERT INTO contest_eligible (user_id, contest_type, eligible_date) VALUES (?, ?, NOW()) ON DUPLICATE KEY UPDATE eligible_date = NOW()', 
            //                [user_id, contest_type]);
        }

        // Send real-time update to admin dashboard
        // await notifyAdminDashboard('contest_progress', {
        //     user_id,
        //     username,
        //     contest_type,
        //     ads_watched,
        //     is_eligible: isEligible,
        //     platform
        // });

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: 'Contest progress updated',
                contest_type,
                ads_watched,
                is_eligible: isEligible,
                timestamp: new Date().toISOString()
            })
        };

    } catch (error) {
        console.error('Contest progress error:', error);
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