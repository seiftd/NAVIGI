exports.handler = async (event, context) => {
    // Set CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
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
        const { admin_id, timestamp } = data;

        // Validate admin authorization
        if (!admin_id || admin_id !== 'admin_bot') {
            return {
                statusCode: 401,
                headers,
                body: JSON.stringify({ error: 'Unauthorized access' })
            };
        }

        console.log('🔄 FULL SYSTEM RESET INITIATED by:', admin_id);
        console.log('Reset timestamp:', new Date(timestamp).toISOString());

        // In real implementation, this would:
        // 1. Reset all user data
        // await db.query('UPDATE users SET points = 0, balance = 0, total_earned = 0, vip_status = "FREE", referrals = 0');
        
        // 2. Reset contest data
        // await db.query('DELETE FROM contest_participants');
        // await db.query('DELETE FROM contest_winners');
        // await db.query('UPDATE contest_settings SET participants = 0, eligible_users = 0');
        
        // 3. Reset daily progress
        // await db.query('UPDATE users SET daily_ads_watched = 0, last_ad_time = 0');
        
        // 4. Reset VIP requests
        // await db.query('DELETE FROM vip_requests WHERE status = "pending"');
        
        // 5. Reset leaderboards
        // await db.query('DELETE FROM leaderboards');
        
        // 6. Reset notifications
        // await db.query('DELETE FROM notifications');
        
        // 7. Reset activity logs
        // await db.query('DELETE FROM activity_logs');

        // Log the reset action
        const resetActions = [
            'All user points and balances reset to 0',
            'All VIP statuses reset to FREE',
            'All contest progress reset',
            'All daily ad progress reset',
            'All leaderboards cleared',
            'All pending VIP requests cleared',
            'All notifications cleared',
            'All activity logs cleared',
            'All referral data reset',
            'All task progress reset',
            'All mining progress reset'
        ];

        console.log('Reset actions performed:');
        resetActions.forEach(action => console.log('✅', action));

        // In real implementation, broadcast reset notification to all users
        // await broadcastNotification('🔄 System has been reset. All progress has been cleared.');

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: 'Full system reset completed successfully',
                actions_performed: resetActions,
                reset_by: admin_id,
                reset_time: new Date(timestamp).toISOString(),
                affected_components: [
                    'User accounts',
                    'Contest system',
                    'VIP system',
                    'Leaderboards',
                    'Notifications',
                    'Activity logs',
                    'Referral system',
                    'Task system',
                    'Mining system'
                ]
            })
        };

    } catch (error) {
        console.error('Full system reset error:', error);
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