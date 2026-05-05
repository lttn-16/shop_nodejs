
const mongoose = require('mongoose');
const os = require('os');

const countConnections = (io) => {
  const numberOfConnections = mongoose.connections.length;
  return numberOfConnections;
}

const checkOverload = () => {
    setInterval(() => {
        const numberOfConnections = countConnections();
        const numCores = os.cpus().length;
        const memoryUsage = process.memoryUsage().rss / 1024 / 1024; // Convert to MB
        const maxConnections = numCores * 5; // Example threshold based on CPU cores
        if(numberOfConnections > maxConnections || memoryUsage > 500) { // Example memory threshold{}
            console.warn('Warning: System overload detected!');
        }
    }, 60000); // Check every 60 seconds
}

module.exports = {
    countConnections,
    checkOverload
}