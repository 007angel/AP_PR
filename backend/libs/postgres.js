const { Client} = require('pg')

async function getConection(){
const client = new Client({
    host: 'localhost',
    port: '5432',
    user: 'postgres',
    password:'abc123..',
    database:'postgres'
})
await client.connect();
return client;
}

module.exports=getConection;



