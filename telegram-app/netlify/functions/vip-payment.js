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
        const { user_id, username, telegram_user, vip_tier, price, payment_method, transaction_hash, app_id, platform, status, timestamp } = data;

        // Validate required fields
        if (!user_id || !telegram_user || !vip_tier || !price || !payment_method || !transaction_hash) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Missing required fields' })
            };
        }

        // Validate payment method
        if (!['TON', 'TRC20_USDT'].includes(payment_method)) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Invalid payment method' })
            };
        }

        // Validate tier
        if (!['KING', 'EMPEROR', 'LORD'].includes(vip_tier.toUpperCase())) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Invalid VIP tier' })
            };
        }

        // Store VIP request for admin dashboard
        const vipRequest = {
            id: `vip_req_${Date.now()}_${user_id}`,
            user_id: user_id,
            username: username || `@user${user_id}`,
            telegram_user: {
                id: telegram_user.id,
                first_name: telegram_user.first_name,
                last_name: telegram_user.last_name,
                username: telegram_user.username,
                language_code: telegram_user.language_code
            },
            vip_tier: vip_tier.toUpperCase(),
            price: price,
            amount: `$${price}`,
            payment_method: payment_method,
            transaction_hash: transaction_hash,
            app_id: app_id,
            wallet_address: payment_method === 'TON' 
                ? 'UQBVeJflae5yTTgS6wczgpDkDcyEAnmA88bZyaiB3lYGqWw9'
                : 'TLDsutnxpdLZaRxhGWBJismwsjY3WITHWX',
            status: status || 'pending',
            submitted_at: new Date().toISOString(),
            platform: platform || 'telegram_bot',
            estimated_processing_time: '6 hours'
        };

        // In a real implementation, you would:
        // 1. Save to your database
        // 2. Send to admin dashboard for approval
        // 3. Set up payment verification
        // 4. Create notification for admin
        // 5. Send confirmation to user

        // In real implementation, save to database:
        // await db.collection('vip_requests').add(vipRequest);
        
        console.log('VIP Payment Request Stored for Admin:', vipRequest);

        // Simulate sending to admin dashboard
        // Replace with your actual admin dashboard API endpoint
        try {
            // Example: Send to your admin dashboard
            // const adminResponse = await fetch('YOUR_ADMIN_DASHBOARD_API/vip-payment', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(adminData)
            // });
            
            console.log('VIP payment request would be sent to admin dashboard:', adminData);

            // You could also send a Telegram notification to admin
            // await sendTelegramNotificationToAdmin(adminData);
            
        } catch (adminError) {
            console.error('Failed to send to admin dashboard:', adminError);
            // Continue processing even if admin dashboard fails
        }

        // Generate a unique request ID for tracking
        const requestId = `vip_${user_id}_${Date.now()}`;

        // Return success response
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: 'VIP payment request submitted successfully',
                request_id: requestId,
                tier: tier.toUpperCase(),
                price: price,
                payment_method: payment_method,
                transaction_hash: transaction_hash,
                status: 'pending',
                estimated_processing_time: '6 hours',
                note: 'You will receive a notification in Telegram once your payment is verified and VIP status is activated.'
            })
        };

    } catch (error) {
        console.error('Error processing VIP payment:', error);
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

// Helper function to send Telegram notification to admin (optional)
async function sendTelegramNotificationToAdmin(paymentData) {
    const BOT_TOKEN = '8185239716:AAGwRpHQH3pEoMLVTzWpLnE3hHTNc35AleY';
    const ADMIN_CHAT_ID = 'YOUR_ADMIN_CHAT_ID'; // Replace with your admin chat ID
    
    const message = `
🔔 *New VIP Payment Request*

👤 *User:* ${paymentData.telegram_user.first_name} ${paymentData.telegram_user.last_name || ''}
🆔 *Telegram ID:* ${paymentData.telegram_user.id}
👑 *VIP Tier:* ${paymentData.vip_tier}
💰 *Price:* $${paymentData.price}
💳 *Payment Method:* ${paymentData.payment_method}
🔗 *Transaction Hash:* \`${paymentData.transaction_hash}\`
📱 *Platform:* Telegram Mini App
⏰ *Submitted:* ${new Date(paymentData.submitted_at).toLocaleString()}

Please verify the payment and approve the VIP upgrade.
    `;

    try {
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: ADMIN_CHAT_ID,
                text: message,
                parse_mode: 'Markdown'
            })
        });

        if (response.ok) {
            console.log('Admin notification sent successfully');
        } else {
            console.error('Failed to send admin notification');
        }
    } catch (error) {
        console.error('Error sending admin notification:', error);
    }
}