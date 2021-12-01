const os = require('os')
const dns = require('dns').promises
const { program: optionparser } = require('commander')
const mysqlx = require('@mysql/xdevapi');
const MemcachePlus = require('memcache-plus');
const express = require('express')
const cors = require('cors');

const app = express()
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

async function getAdvertisment(id){
	let result = {
		id: 1,
		product: {
			id: 1,
			title: "Awesome Lego",
			category: {
				id: 1
			},
			avgPrice: 10,
			maxPrice: 20,
			minPrice: 8,
			lastModified: '2020-01-01 00:00:00' 
		},
		createdAt: '2020-01-01 00:00:00',
		price: 12.2,
		description: "Everyone loves Lego... right?",
		clicks: 2,
		lastModified: '2020-01-01 00:00:00',
	  };
	return result;
}

async function getAdvertisments(){
	console.log("Get Advertisments");
  const result = [{
    id: 1,
    product: {
		id: 1,
		title: "Awesome Lego",
		category: {
			id: 1
		},
		avgPrice: 10,
		maxPrice: 20,
		minPrice: 8,
		lastModified: '2020-01-01 00:00:00' 
	},
    createdAt: '2020-01-01 00:00:00',
    price: 12.2,
    description: "Everyone loves Lego... right?",
    clicks: 2,
    lastModified: '2020-01-01 00:00:00',
  },
  {
    id: 2,
    product: {
		id: 1,
		title: "Awesome Jukebox",
		category: {
			id: 1
		},
		avgPrice: 100.30,
		maxPrice: 250,
		minPrice: 80,
		lastModified: '2020-01-01 00:00:00' 
	},
    createdAt: '2020-01-01 00:00:00',
    price: 95,
    description: "Awesome Music. Works perfectly for Spice Girls!",
    clicks: 2,
    lastModified: '2020-01-01 00:00:00',
  },
];
  return result;
  const query = "SELECT * FROM Advertisment";
  let data = (await executeQuery(query)).fetch();
  if(data){
    return data;
  }else{
    console.log("Empty");
  }
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

app.post('/advertisments', (req, res) => {
	const id = 1;
	const message = {
		id: id
	};
	return res.send(message);
})

app.delete('/advertisments/:id', (req, res) => {
	const message = {
		text: `Deleted Advertisment with Id ${req.params.id}`
	};
	return res.send(message);
})

app.get('/', (req, res) => {
  res.send('Hello World!Again')
})

app.listen(options.port, () => {
  console.log(`Example app listening!  at http://localhost:${options.port}`)
})

