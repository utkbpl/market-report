# market-report


clone the project to your local system

// Create Database in mysql using market-report.sql file

    create database and import market-report.sql file

// Navigate to project folder

# Commands to run the project

    npm install

    npm start

// To create report data run below url to Postman
1. http://localhost:3000/reports

Method: POST

Request Body:
{
 "reportDetails": {
 "userID": "user-1",
 "marketID": "market-1",
 "marketName": "Vashi Navi Mumbai",
 "cmdtyID": "cmdty-1",
 "marketType": "Mandi",
 "cmdtyName": "Potato",
 "priceUnit": "Pack",
 "convFctr": 50,
 "price": 700
 }
}

2. http://localhost:3000/reports?reportID=884ece67-1150-48ec-a311-9d6817b01401

Method: GET