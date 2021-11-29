const os = require('os')
const dns = require('dns').promises
const { program: optionparser } = require('commander')
const mysqlx = require('@mysql/xdevapi');
const MemcachePlus = require('memcache-plus');
const express = require('express')

const app = express()

// -------------------------------------------------------
// Command-line options
// -------------------------------------------------------

let options = optionparser
	.storeOptionsAsProperties(true)
	// Web server
	.option('--port <port>', "Web server port", 3000)
	// Kafka options
	.option('--kafka-broker <host:port>', "Kafka bootstrap host:port", "my-cluster-kafka-bootstrap:9092")
	.option('--kafka-topic-tracking <topic>', "Kafka topic to tracking data send to", "tracking-data")
	.option('--kafka-client-id < id > ', "Kafka client ID", "tracker-" + Math.floor(Math.random() * 100000))
	// Memcached options
	.option('--memcached-hostname <hostname>', 'Memcached hostname (may resolve to multiple IPs)', 'my-memcached-service')
	.option('--memcached-port <port>', 'Memcached port', 11211)
	.option('--memcached-update-interval <ms>', 'Interval to query DNS for memcached IPs', 5000)
	// Database options
	.option('--mysql-host <host>', 'MySQL host', 'my-app-mysql-service')
	.option('--mysql-port <port>', 'MySQL port', 33060)
	.option('--mysql-schema <db>', 'MySQL Schema/database', 'store')
	.option('--mysql-username <username>', 'MySQL username', 'root')
	.option('--mysql-password <password>', 'MySQL password', 'mysecretpw')
	// Misc
	.addHelpCommand()
	.parse()
	.opts()

// -------------------------------------------------------
// Database Configuration
// -------------------------------------------------------

const dbConfig = {
	host: options.mysqlHost,
	port: options.mysqlPort,
	user: options.mysqlUsername,
	password: options.mysqlPassword,
	schema: options.mysqlSchema
};

async function executeQuery(query, data) {
	let session = await mysqlx.getSession(dbConfig);
	return await session.sql(query, data).bind(data).execute()
}

async function getAdvertisments(){
  const query = "SELECT * FROM Advertisment";
  let data = (await executeQuery(query)).fetch();
  if(data){
    return data;
  }else{
    console.log("Empty");
  }
}

// app.get('/advertisments', (req, res) => {
//   getAdvertisments().then(data => {
//     res.send(data);
//   })
//   .catch(err => {
//     res.send(err);
//   })
  
// })

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(options.port, () => {
  console.log(`Example app listening!  at http://localhost:${options.port}`)
})

