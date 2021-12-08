const { Kafka } = require('kafkajs')

// Kafka connection
const kafka = new Kafka({
    clientId: "tracker-" + Math.floor(Math.random() * 100000),
    brokers: ["my-cluster-kafka-bootstrap:9092"],
    retry: {
        retries: 0
    }
})

const producer = kafka.producer()

// Send tracking message to Kafka
async function sendTrackingMessage(data) {
    //Ensure the producer is connected
    await producer.connect()

    //Send message
    await producer.send({
        topic: "tracking-data",
        messages: [
            { value: JSON.stringify(data) }
        ]
    })
}

sendTrackingMessage({
    product: { name: "Maus" },
    price: 20,
    timestamp: Math.floor(new Date() / 1000)
}).then(() => console.log("Sent to kafka"))
    .catch(e => console.log("Error sending to kafka", e)) 