exports.handler = async (event, context) => {
    // Set CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
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
        if (event.httpMethod === 'GET') {
            // Get current prize pools
            const prizePools = {
                daily: {
                    type: 'points',
                    amount: 1000,
                    winners: 1,
                    description: '1000 Points to Winner'
                },
                weekly: {
                    type: 'points',
                    amount: 5000,
                    winners: 3,
                    description: '5000 Points Split (3 Winners)'
                },
                monthly: {
                    type: 'vip',
                    amount: 5,
                    winners: 5,
                    description: 'VIP King for 5 Winners'
                },
                vip: {
                    type: 'points',
                    amount: 10000,
                    winners: 1,
                    description: '10000 Points to VIP Winner'
                }
            };

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    prize_pools: prizePools
                })
            };
        }

        if (event.httpMethod === 'POST') {
            const data = JSON.parse(event.body);
            const { contest_type, prize_type, amount, winners, admin_token } = data;

            // Simple admin authentication (replace with proper auth)
            if (admin_token !== 'navigi2024') {
                return {
                    statusCode: 401,
                    headers,
                    body: JSON.stringify({ error: 'Unauthorized' })
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

            // Validate prize type
            if (!['points', 'vip'].includes(prize_type)) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'Invalid prize type' })
                };
            }

            // Log prize pool update
            console.log('Prize Pool Updated:', {
                contest_type,
                prize_type,
                amount,
                winners,
                timestamp: new Date().toISOString()
            });

            // In real implementation, save to database:
            // await db.query('UPDATE contest_settings SET prize_type = ?, prize_amount = ?, winners_count = ?, updated_at = NOW() WHERE contest_type = ?', 
            //                [prize_type, amount, winners, contest_type]);

            // Update prize pool description
            let description;
            if (prize_type === 'points') {
                description = winners === 1 ? 
                    `${amount} Points to Winner` : 
                    `${amount} Points Split (${winners} Winners)`;
            } else if (prize_type === 'vip') {
                description = `VIP King for ${winners} Winner${winners > 1 ? 's' : ''}`;
            }

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    message: 'Prize pool updated successfully',
                    contest_type,
                    prize_type,
                    amount,
                    winners,
                    description,
                    timestamp: new Date().toISOString()
                })
            };
        }

        if (event.httpMethod === 'PUT') {
            // Distribute prizes to winners
            const data = JSON.parse(event.body);
            const { contest_type, winners_list, admin_token } = data;

            // Simple admin authentication
            if (admin_token !== 'navigi2024') {
                return {
                    statusCode: 401,
                    headers,
                    body: JSON.stringify({ error: 'Unauthorized' })
                };
            }

            console.log('Distributing prizes:', {
                contest_type,
                winners_count: winners_list.length,
                winners: winners_list,
                timestamp: new Date().toISOString()
            });

            // In real implementation, distribute prizes:
            // for (const winner of winners_list) {
            //     if (winner.prize_type === 'points') {
            //         await db.query('UPDATE users SET points = points + ? WHERE user_id = ?', [winner.amount, winner.user_id]);
            //     } else if (winner.prize_type === 'vip') {
            //         const vipExpiry = new Date();
            //         vipExpiry.setMonth(vipExpiry.getMonth() + 1);
            //         await db.query('UPDATE users SET vip_status = "KING", vip_expires = ? WHERE user_id = ?', [vipExpiry, winner.user_id]);
            //     }
            //     
            //     // Send notification to winner
            //     await sendNotification(winner.user_id, `🎉 Congratulations! You won the ${contest_type} contest!`);
            // }

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    message: 'Prizes distributed successfully',
                    contest_type,
                    winners_count: winners_list.length,
                    timestamp: new Date().toISOString()
                })
            };
        }

        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };

    } catch (error) {
        console.error('Contest prizes error:', error);
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