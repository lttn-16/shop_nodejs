const amqplib = require("amqplib");

const runConsumer = async () => {
    try {
        const connection = await amqplib.connect("amqp://localhost");
        const channel = await connection.createChannel();
        const queueName = "test-rabbit";
        await channel.assertQueue(queueName, {
            durable: true,
        });
        channel.consume(
            queueName,
            (message) => {
                console.log("message receive::", message.content.toString());
            },
            {
                noAck: true,
            },
        );
    } catch (e) {
        console.error(e);
    }
};
runConsumer().catch(console.error);
