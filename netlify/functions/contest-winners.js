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
        const { contest_type, platform } = data;

        // Contest winner processing algorithm
        const contestResults = await processContestWinners(contest_type, platform);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                contest_type: contest_type,
                results: contestResults,
                message: `${contest_type} contest winners processed successfully`
            })
        };

    } catch (error) {
        console.error('Error processing contest winners:', error);
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

async function processContestWinners(contestType, platform) {
    // Simulate contest data (replace with real database queries)
    const contestData = await getContestData(contestType, platform);
    
    const { participants, totalAdsWatched } = contestData;
    const totalPoints = totalAdsWatched * 1.1; // Each ad = 1.1 points
    
    let winners = [];
    
    switch (contestType) {
        case 'daily':
            // Daily: 1 winner gets 20% of total points
            winners = await processDailyContest(participants, totalPoints);
            break;
            
        case 'weekly':
            // Weekly: 5 winners, each gets 10% of total points
            winners = await processWeeklyContest(participants, totalPoints);
            break;
            
        case 'monthly':
            // Monthly: 3 winners get VIP King + 5% points each
            winners = await processMonthlyContest(participants, totalPoints);
            break;
    }
    
    // Distribute rewards to winners
    await distributeRewards(winners, contestType);
    
    return {
        contest_type: contestType,
        participants: participants.length,
        total_ads_watched: totalAdsWatched,
        total_points_pool: totalPoints,
        winners: winners.map(w => ({
            user_id: w.user_id,
            username: w.username,
            reward_points: w.reward_points,
            vip_reward: w.vip_reward || null
        }))
    };
}

async function processDailyContest(participants, totalPoints) {
    if (participants.length === 0) return [];
    
    // Calculate 20% of total points for the winner
    const winnerPoints = Math.floor(totalPoints * 0.20);
    
    // Select random winner
    const randomIndex = Math.floor(Math.random() * participants.length);
    const winner = participants[randomIndex];
    
    return [{
        user_id: winner.user_id,
        username: winner.username,
        reward_points: winnerPoints,
        contest_type: 'daily'
    }];
}

async function processWeeklyContest(participants, totalPoints) {
    if (participants.length === 0) return [];
    
    // Calculate 10% of total points per winner (5 winners)
    const pointsPerWinner = Math.floor(totalPoints * 0.10);
    
    // Select 5 random winners (or all participants if less than 5)
    const numWinners = Math.min(5, participants.length);
    const winners = [];
    const selectedIndices = new Set();
    
    while (winners.length < numWinners) {
        const randomIndex = Math.floor(Math.random() * participants.length);
        
        if (!selectedIndices.has(randomIndex)) {
            selectedIndices.add(randomIndex);
            const winner = participants[randomIndex];
            
            winners.push({
                user_id: winner.user_id,
                username: winner.username,
                reward_points: pointsPerWinner,
                contest_type: 'weekly'
            });
        }
    }
    
    return winners;
}

async function processMonthlyContest(participants, totalPoints) {
    if (participants.length === 0) return [];
    
    // Calculate 5% of total points per winner (3 winners)
    const pointsPerWinner = Math.floor(totalPoints * 0.05);
    
    // Select 3 random winners (or all participants if less than 3)
    const numWinners = Math.min(3, participants.length);
    const winners = [];
    const selectedIndices = new Set();
    
    while (winners.length < numWinners) {
        const randomIndex = Math.floor(Math.random() * participants.length);
        
        if (!selectedIndices.has(randomIndex)) {
            selectedIndices.add(randomIndex);
            const winner = participants[randomIndex];
            
            winners.push({
                user_id: winner.user_id,
                username: winner.username,
                reward_points: pointsPerWinner,
                vip_reward: 'KING', // VIP King for 30 days
                contest_type: 'monthly'
            });
        }
    }
    
    return winners;
}

async function getContestData(contestType, platform) {
    // Simulate contest data (replace with real database queries)
    // In real implementation, this would query your database for:
    // - All users who participated in the contest
    // - Total number of contest ads watched
    
    const mockData = {
        daily: {
            participants: [
                { user_id: 123456789, username: '@user1', ads_watched: 15 },
                { user_id: 987654321, username: '@user2', ads_watched: 12 },
                { user_id: 456789123, username: '@user3', ads_watched: 18 },
                // ... more participants
            ],
            totalAdsWatched: 1000 // Total ads watched by all participants
        },
        weekly: {
            participants: [
                { user_id: 123456789, username: '@user1', ads_watched: 45 },
                { user_id: 987654321, username: '@user2', ads_watched: 38 },
                { user_id: 456789123, username: '@user3', ads_watched: 52 },
                { user_id: 789123456, username: '@user4', ads_watched: 41 },
                { user_id: 321654987, username: '@user5', ads_watched: 35 },
                // ... more participants
            ],
            totalAdsWatched: 2500
        },
        monthly: {
            participants: [
                { user_id: 123456789, username: '@user1', ads_watched: 150 },
                { user_id: 987654321, username: '@user2', ads_watched: 142 },
                { user_id: 456789123, username: '@user3', ads_watched: 168 },
                // ... more participants
            ],
            totalAdsWatched: 5000
        }
    };
    
    return mockData[contestType] || { participants: [], totalAdsWatched: 0 };
}

async function distributeRewards(winners, contestType) {
    // In real implementation, this would:
    // 1. Update user points in database
    // 2. Update VIP status if applicable
    // 3. Send notifications to winners
    // 4. Log the reward distribution
    
    for (const winner of winners) {
        console.log(`Distributing reward to ${winner.username}:`);
        console.log(`- Points: ${winner.reward_points}`);
        
        if (winner.vip_reward) {
            console.log(`- VIP: ${winner.vip_reward} for 30 days`);
        }
        
        // Simulate database update
        await updateUserRewards(winner);
        
        // Send notification to winner
        await sendWinnerNotification(winner, contestType);
    }
}

async function updateUserRewards(winner) {
    // Simulate database update
    // In real implementation:
    // UPDATE users SET 
    //   points = points + winner.reward_points,
    //   vip_status = winner.vip_reward,
    //   vip_expires = DATE_ADD(NOW(), INTERVAL 30 DAY)
    // WHERE user_id = winner.user_id
    
    console.log(`Updated rewards for user ${winner.user_id}`);
}

async function sendWinnerNotification(winner, contestType) {
    // In real implementation, this would send a notification via:
    // - Telegram message
    // - In-app notification
    // - Email (if available)
    
    const message = `🎉 Congratulations! You won the ${contestType} contest and received ${winner.reward_points} points!`;
    
    if (winner.vip_reward) {
        message += ` Plus VIP ${winner.vip_reward} status for 30 days!`;
    }
    
    console.log(`Notification sent to ${winner.username}: ${message}`);
    
    // Example: Send Telegram notification
    // await sendTelegramNotification(winner.user_id, message);
}