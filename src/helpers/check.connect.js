'use strict';
const mongoose = require('mongoose');
const os = require('os');
const process = require('process');
const _SECONDS = 5000;

// Count connection
const countConnect = () => {
    const numConnection = mongoose.connections.length;
    console.log(`Number of connection: ${numConnection}`);
};

// Check overload connection - server bị quá tải
const checkOverload = () => {
    setInterval(() => {
        const numConnection = mongoose.connections.length;
        const numCores = os.cpus().length;
        const memoryUsage = process.memoryUsage().rss;

        // Eg: Maximum 5 connections based on number of cores
        const maxConnections = numCores * 5;
        // console.log(`Active connection: ${numConnection}`);
        // console.log(`Memory use: ${memoryUsage / 1024 / 1024} MB`);

        // Moved the overload check inside setInterval to continuously monitor
        if (numConnection > maxConnections) {
            console.log('Connection overload detected');
        }
    }, _SECONDS); // Monitor every 5 seconds
};

module.exports = {
    countConnect,
    checkOverload
};