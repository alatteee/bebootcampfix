const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    username: "postgres",
    password: "postgres",
    database: "bootcamp",
    host: "127.0.0.1",
    dialect: "postgres",
    port: 5432
});

// const sequelize = new Sequelize('postgres://postgres:postgres:5432/bootcamp')

module.exports = sequelize;
