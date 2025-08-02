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
        const { event_type, data, timestamp, source } = JSON.parse(event.body);

        console.log(`📢 Admin Bot Notification - ${event_type}:`, data);

        // In real implementation, this would send a message to the admin bot
        // using the Telegram Bot API to notify the admin immediately

        if (event_type === 'vip_request') {
            const message = `
🚨 **NEW VIP REQUEST**

👤 User: @${data.username} (${data.user_id})
💎 Tier: ${data.vip_tier}
💰 Amount: ${data.amount}
💳 Method: ${data.payment_method}
🔗 TX Hash: \`${data.transaction_hash}\`
📱 App ID: ${data.app_id}
📅 Time: ${new Date(timestamp).toLocaleString()}

Please review and approve/reject this request.
            `;

            // In real implementation:
            // await sendTelegramMessage(ADMIN_CHAT_ID, message, {
            //     parse_mode: 'Markdown',
            //     reply_markup: {
            //         inline_keyboard: [[
            //             { text: '✅ Approve', callback_data: `approve_vip_${data.user_id}` },
            //             { text: '❌ Reject', callback_data: `reject_vip_${data.user_id}` }
            //         ]]
            //     }
            // });

            console.log('VIP Request notification prepared for admin bot');
        
        } else if (event_type === 'contest_winner') {
            const message = `
🏆 **CONTEST WINNER**

🎉 Contest: ${data.contest_type}
👤 Winner: @${data.username} (${data.user_id})
🏅 Rank: ${data.rank}
💰 Prize: ${data.prize}
📅 Time: ${new Date(timestamp).toLocaleString()}
            `;

            console.log('Contest winner notification prepared for admin bot');

        } else if (event_type === 'system_alert') {
            const message = `
⚠️ **SYSTEM ALERT**

🚨 Alert: ${data.alert_type}
📝 Message: ${data.message}
📊 Details: ${JSON.stringify(data.details, null, 2)}
📅 Time: ${new Date(timestamp).toLocaleString()}
            `;

            console.log('System alert notification prepared for admin bot');
        }

        // Store notification for admin dashboard
        // In real implementation:
        // await db.query('INSERT INTO admin_notifications (type, data, timestamp, read_status) VALUES (?, ?, ?, ?)',
        //                [event_type, JSON.stringify(data), new Date(timestamp), false]);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: 'Admin notification sent successfully',
                event_type,
                timestamp: new Date().toISOString()
            })
        };

    } catch (error) {
        console.error('Admin bot notification error:', error);
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