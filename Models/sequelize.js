'use strict';

const {Sequelize} = require("sequelize");
const config = require("../config.js");

const { username, password, database, host, dialect } = config.development;

const sequelize = new Sequelize(database, username, password, {
    host: host,
    dialect: dialect,
    logging: false, // Disable logging
  });

//Testing the configuration
async function testConnection(){
    try{
        // await sequelize.authenticate();
        await sequelize.authenticate();
        console.log("Database connected succefully")
    }
    catch(error){
        console.error('Unable to connect to the database:', error);
    }
}

testConnection();


module.exports = sequelize;