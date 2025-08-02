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
        const { request_id, action, admin_id } = JSON.parse(event.body);

        // Validate required fields
        if (!request_id || !action || !admin_id) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Missing required fields' })
            };
        }

        // Validate action
        if (!['approve', 'reject'].includes(action)) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Invalid action' })
            };
        }

        console.log('VIP Request Action:', {
            request_id,
            action,
            admin_id,
            timestamp: new Date().toISOString()
        });

        // Mock user data for bot communication (in real implementation, fetch from database)
        const mockUserData = {
            user_id: `user_${request_id}`,
            telegram_id: '123456789', // In real implementation, get from vip_requests table
            username: 'testuser',
            vip_tier: 'KING',
            vip_expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
        };

        // In real implementation, this would:
        // 1. Find the VIP request in database
        // const vipRequest = await db.query('SELECT * FROM vip_requests vr JOIN users u ON vr.user_id = u.id WHERE vr.id = ?', [request_id]);
        // 
        // 2. Update the request status
        // await db.query('UPDATE vip_requests SET status = ?, processed_by = ?, processed_at = NOW() WHERE id = ?', 
        //                [action, admin_id, request_id]);
        //
        // 3. If approved, update user VIP status
        // if (action === 'approve') {
        //     const vipExpiry = new Date();
        //     vipExpiry.setMonth(vipExpiry.getMonth() + 1); // 1 month VIP
        //     await db.query('UPDATE users SET vip_status = ?, vip_expires = ? WHERE id = ?', 
        //                    [vipRequest.vip_tier, vipExpiry, vipRequest.user_id]);
        // }

        // Log the action
        console.log(`✅ VIP request ${request_id} ${action}d by ${admin_id}`);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: `VIP request ${action}d successfully`,
                request_id,
                action,
                user_data: mockUserData, // Include user data for bot communication
                timestamp: new Date().toISOString()
            })
        };

    } catch (error) {
        console.error('Admin approve VIP request error:', error);
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