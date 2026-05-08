const amqplib = require("amqplib");

const runProducer = async () => {
    try {
        const connection = await amqplib.connect("amqp://localhost");
        const channel = await connection.createChannel();
        const queueName = "ordered queue";
        await channel.assertQueue(queueName, {
            durable: true,
        });
        // send message
        for (let i = 0; i < 10; i++) {
            const message = `order message ${i}`;
            console.log("message sent::", message);
            channel.sendToQueue(queueName, Buffer.from(message), {
                persistent: true
            });
        }
        setTimeout(() => {
            connection.close();
            process.exit(0);
        }, 500);
    } catch (e) {
        console.error(e);
    }
};
runProducer().catch(console.error);
