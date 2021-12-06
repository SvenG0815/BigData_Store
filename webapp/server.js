const os = require('os')
const dns = require('dns').promises
const { program: optionparser } = require('commander')
const mysqlx = require('@mysql/xdevapi');
const MemcachePlus = require('memcache-plus');
const express = require('express')
const cors = require('cors');
var bodyParser = require('body-parser');

const app = express()
var jsonParser = bodyParser.json();
app.use(cors())

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
	//.option('--mysql-host <host>', 'MySQL host', 'my-app-mysql-service')
	.option('--mysql-host <host>', 'MySQL host', 'localhost')
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


// -------------------------------------------------------
// Memcache Configuration
// -------------------------------------------------------

//Connect to the memcached instances
let memcached = null
let memcachedServers = []

async function getMemcachedServersFromDns() {
	try {
		// Query all IP addresses for this hostname
		let queryResult = await dns.lookup(options.memcachedHostname, { all: true })

		// Create IP:Port mappings
		let servers = queryResult.map(el => el.address + ":" + options.memcachedPort)

		// Check if the list of servers has changed
		// and only create a new object if the server list has changed
		if (memcachedServers.sort().toString() !== servers.sort().toString()) {
			console.log("Updated memcached server list to ", servers)
			memcachedServers = servers

			//Disconnect an existing client
			if (memcached)
				await memcached.disconnect()

			memcached = new MemcachePlus(memcachedServers);
		}
	} catch (e) {
		console.log("Unable to get memcache servers", e)
	}
}

//Initially try to connect to the memcached servers, then each 5s update the list
getMemcachedServersFromDns()
setInterval(() => getMemcachedServersFromDns(), options.memcachedUpdateInterval)

//Get data from cache if a cache exists yet
async function getFromCache(key) {
	if (!memcached) {
		console.log(`No memcached instance available, memcachedServers = ${memcachedServers}`)
		return null;
	}
	return await memcached.get(key);
}

async function getAdvertisments(){
	const key = 'advertisments';
	let cachedata = await getFromCache(key);
	if(cachedata){
	  console.log(`Cache hit for key=${key}, cachedata = ${cachedata}`)
	  return res.send(cachedata);
	}

	console.log("Get Advertisments");
	const query = "SELECT * FROM Advertisment";
	let executeResult = await executeQuery(query,[]);
	let data = executeResult.fetchAll();
	return data;
}

async function postAdvertisment(ad){
	const query = `INSERT INTO Advertisment (product, price, description, clicks) VALUES (${ad.product}, ${ad.price}, '${ad.description}', 0);`;
	let executeResult = await executeQuery(query,[]);
	let data = executeResult.fetchAll();
	return data;
}

async function getProducts(){
	const key = 'products';
	let cachedata = await getFromCache(key);
	if(cachedata){
	  console.log(`Cache hit for key=${key}, cachedata = ${cachedata}`)
	  return res.send(cachedata);
	}

	const query = "SELECT * FROM Product";
	let executeResult = await executeQuery(query,[]);
	let data = executeResult.fetchAll();
	return data;
}



app.get('/advertisments', (req, res) => {
  getAdvertisments().then(data => {
    res.send(data);
  })
  .catch(err => {
    res.send(err);
  })
})

app.get('/advertisments/:id', (req, res) => {
	getAdvertisment(req.params.id).then(data => {
	  res.send(data);
	})
	.catch(err => {
	  res.send(err);
	})
})

app.post('/advertisments', jsonParser, (req, res) => {
	postAdvertisment(req.body).then(data => {
		res.send(data);
	})
	.catch(err => {
		res.send(err);
	})
})

app.delete('/advertisments/:id', (req, res) => {
	const message = {
		text: `Deleted Advertisment with Id ${req.params.id}`
	};
	return res.send(message);
})

app.get('/products', (req, res) => {
	getProducts().then(data => {
	  res.send(data);
	})
	.catch(err => {
	  res.send(err);
	})
  })

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(options.port, () => {
  console.log(`Example app listening!  at http://localhost:${options.port}`)
})

