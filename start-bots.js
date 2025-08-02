#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting NAVIGI SBARO Bot System...\n');

// Start main bot
console.log('📱 Starting Main Bot...');
const mainBot = spawn('node', ['bot-setup.js'], {
    stdio: ['inherit', 'pipe', 'pipe'],
    cwd: __dirname
});

// Start admin bot
console.log('🔧 Starting Admin Bot...');
const adminBot = spawn('node', ['admin-bot-setup.js'], {
    stdio: ['inherit', 'pipe', 'pipe'],
    cwd: __dirname
});

// Handle main bot output
mainBot.stdout.on('data', (data) => {
    console.log(`[MAIN BOT] ${data.toString().trim()}`);
});

mainBot.stderr.on('data', (data) => {
    console.error(`[MAIN BOT ERROR] ${data.toString().trim()}`);
});

// Handle admin bot output
adminBot.stdout.on('data', (data) => {
    console.log(`[ADMIN BOT] ${data.toString().trim()}`);
});

adminBot.stderr.on('data', (data) => {
    console.error(`[ADMIN BOT ERROR] ${data.toString().trim()}`);
});

// Handle process exits
mainBot.on('close', (code) => {
    console.log(`\n❌ Main Bot exited with code ${code}`);
    if (code !== 0) {
        console.log('🔄 Restarting Main Bot in 5 seconds...');
        setTimeout(() => {
            spawn('node', ['bot-setup.js'], { stdio: 'inherit', cwd: __dirname });
        }, 5000);
    }
});

adminBot.on('close', (code) => {
    console.log(`\n❌ Admin Bot exited with code ${code}`);
    if (code !== 0) {
        console.log('🔄 Restarting Admin Bot in 5 seconds...');
        setTimeout(() => {
            spawn('node', ['admin-bot-setup.js'], { stdio: 'inherit', cwd: __dirname });
        }, 5000);
    }
});

// Handle system signals
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down bots...');
    mainBot.kill('SIGINT');
    adminBot.kill('SIGINT');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Shutting down bots...');
    mainBot.kill('SIGTERM');
    adminBot.kill('SIGTERM');
    process.exit(0);
});

console.log('✅ Both bots are starting...');
console.log('📊 Admin Dashboard: https://navigiu.netlify.app/admin-dashboard');
console.log('🔥 Firebase Database: https://navigi-sbaro-bot-default-rtdb.europe-west1.firebasedatabase.app/');
console.log('\n💡 Press Ctrl+C to stop both bots\n');