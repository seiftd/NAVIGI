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
        const { user_id, telegram_user, points_earned, timestamp, ad_type } = data;

        // Validate required fields
        if (!user_id || !telegram_user || !points_earned) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Missing required fields' })
            };
        }

        // Prepare data for admin dashboard
        const adminData = {
            type: 'ad_watch',
            user_id: user_id,
            telegram_user: {
                id: telegram_user.id,
                first_name: telegram_user.first_name,
                last_name: telegram_user.last_name,
                username: telegram_user.username,
                language_code: telegram_user.language_code
            },
            points_earned: points_earned,
            ad_type: ad_type || 'monetag_rewarded',
            timestamp: timestamp || Date.now(),
            platform: 'telegram_mini_app'
        };

        // In a real implementation, you would:
        // 1. Save to your database
        // 2. Update user points
        // 3. Send to admin dashboard via webhook/API
        // 4. Log for analytics

        console.log('Ad watch event:', adminData);

        // Simulate sending to admin dashboard
        // Replace with your actual admin dashboard API endpoint
        try {
            // Example: Send to your admin dashboard
            // const adminResponse = await fetch('YOUR_ADMIN_DASHBOARD_API/ad-watch', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(adminData)
            // });
            
            console.log('Data would be sent to admin dashboard:', adminData);
        } catch (adminError) {
            console.error('Failed to send to admin dashboard:', adminError);
            // Continue processing even if admin dashboard fails
        }

        // Return success response
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: 'Ad watch recorded successfully',
                points_earned: points_earned,
                user_id: user_id
            })
        };

    } catch (error) {
        console.error('Error processing ad watch:', error);
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