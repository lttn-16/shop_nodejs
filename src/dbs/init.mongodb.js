const mongoose = require("mongoose");
const connectionString =
    process.env.MONGODB_URI || "mongodb://localhost:27017/shop";

class Database {
    constructor() {
        this.connect();
    }
    connect() {
        mongoose
            .connect(connectionString, {
                maxPoolSize: 50,
            })
            .then(() => {
                console.log("Connected to MongoDB");
            })
            .catch((err) => {
                console.error("Error connecting to MongoDB", err);
            });
    }
    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
}
const dbInstance = Database.getInstance();
module.exports = dbInstance;
