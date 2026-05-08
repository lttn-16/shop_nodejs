const amqplib = require("amqplib");

const runConsumer = async () => {
    try {
        const connection = await amqplib.connect("amqp://localhost");
        const channel = await connection.createChannel();
        const queueName = "ordered queue";
        await channel.assertQueue(queueName, {
            durable: true,
        });
        channel.prefetch(1) // dam bao thu tu xu ly
        channel.consume(
            queueName,
            (msg) => {
                const message = msg.content.toString()
                setTimeout(() => {
                    console.log("message ack:: ", message)
                    channel.ack(msg)
                }, Math.random() * 1000)
            },
        );
    } catch (e) {
        console.error(e);
    }
};
runConsumer().catch(console.error);
