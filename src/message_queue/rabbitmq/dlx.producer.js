const amqplib = require("amqplib")

const dlxProducer = async () => {
    try {
        const connection = await amqplib.connect("amqp://localhost");
        const channel = await connection.createChannel();

        const notifyExchange = "notifyExchange"
        const notifyQueue = "notifyQueue"
        const notifyExchangeDLX = "notifyExchangeDLX"
        const notifyRoutingkeyDLX = "notifyRoutingkeyDLX"

        //1. create exchange
        await channel.assertExchange(notifyExchange, 'direct', {
            durable: true // server down queue van ko mat
        })
        //2. create queue
        const queueResult = await channel.assertQueue(notifyQueue, {
            exclusive: false, // cho phep không xoá queue sau khi close connection
            deadLetterExchange: notifyExchangeDLX,
            deadLetterRoutingKey: notifyRoutingkeyDLX,
        })
        //3. bind queue
        await channel.bindQueue(queueResult.queue, notifyExchange)
        //4. send message
        const message = "Hello dlx 123"
        console.log("producer dlx message::", message)
        channel.sendToQueue(queueResult.queue, Buffer.from(message), {
            expiration: 10000, // 5 giay
        })

        setTimeout(() => {
            connection.close()
            process.exit(0)
        }, 500)
    } catch(e) {
        console.error(e)
    }
}
dlxProducer().catch(console.error)
