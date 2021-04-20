var mysql = require("mysql");
var pool = null;
var session = require("express-session");
var MySQLStore = require("express-mysql-session")(session);

var dbOptions = {
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: `market-report`,
  schema: {
    tableName: "sessions",
    columnNames: {
      session_id: "session_id",
      expires: "expires",
      data: "data",
    },
  },
};

var connection = mysql.createPool(dbOptions); // or mysql.createPool(options);
var sessionStore = new MySQLStore({}, connection);

exports.get = function () {
  return connection;
};

// exports.get = function (dbName){
//   options.database = dbName;
//   return mysql.createPool(options);
// }

var session = session({
  key: "session_cookie_name",
  secret: "session_cookie_secret",
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  secure: true,
  cookie: {
    expires: 6000000000,
  },
});

exports.sessionStore = sessionStore;
exports.session = session;
