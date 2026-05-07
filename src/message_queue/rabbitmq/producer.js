const amqplib = require("amqplib")

const message = "test message"
const runProducer = async () => {
    try {
        const connection = await amqplib.connect("amqp://localhost");
        const channel = await connection.createChannel();
        const queueName = "test-rabbit"
        await channel.assertQueue(queueName, {
            durable: true
        })
        // send message
        channel.sendToQueue(queueName, Buffer.from(message))
        console.log("message::", message)
    } catch(e) {
        console.error(e)
    }
}
runProducer().catch(console.error)
