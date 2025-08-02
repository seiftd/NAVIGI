exports.handler = async (event, context) => {
    // Set CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
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

    try {
        if (event.httpMethod === 'POST') {
            // Log user activity
            const activity = JSON.parse(event.body);
            
            console.log('📝 User Activity Logged:', {
                user_id: activity.user_id,
                username: activity.username,
                title: activity.title,
                points: activity.points,
                type: activity.type,
                platform: activity.platform,
                timestamp: new Date(activity.timestamp).toISOString()
            });

            // In real implementation, save to database:
            // await db.query('INSERT INTO user_activities (user_id, username, title, points, type, platform, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?)',
            //                [activity.user_id, activity.username, activity.title, activity.points, activity.type, activity.platform, new Date(activity.timestamp)]);

            // Send real-time update to admin dashboard
            // await notifyAdminDashboard('user_activity', activity);

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    message: 'Activity logged successfully',
                    activity_id: activity.id,
                    timestamp: new Date().toISOString()
                })
            };
        }

        if (event.httpMethod === 'GET') {
            // Get user activities
            const { user_id, limit = 50 } = event.queryStringParameters || {};
            
            // In real implementation, fetch from database:
            // const activities = await db.query('SELECT * FROM user_activities WHERE user_id = ? ORDER BY timestamp DESC LIMIT ?', [user_id, limit]);
            
            // Mock data for now
            const mockActivities = [
                {
                    id: Date.now() - 1000,
                    title: 'Watched 2x15s Ads',
                    points: '+1.1 points',
                    type: 'earn',
                    timestamp: Date.now() - 1000,
                    date: new Date(Date.now() - 1000).toLocaleString()
                },
                {
                    id: Date.now() - 2000,
                    title: 'Daily Contest',
                    points: 'Joined',
                    type: 'contest',
                    timestamp: Date.now() - 2000,
                    date: new Date(Date.now() - 2000).toLocaleString()
                }
            ];

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    activities: user_id ? mockActivities : [],
                    total: mockActivities.length
                })
            };
        }

        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };

    } catch (error) {
        console.error('User activity error:', error);
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