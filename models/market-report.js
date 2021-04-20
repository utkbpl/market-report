// The algorithm to generate the aggregate report is as below:
// 1. Look for an existing report with marketID-cmdtyID in the DB [1].
// 2. Convert the prices into base price based on the base unit [2]
// 3. Calculate the mean of prices.
// 4. Save the aggregated report with price per Kg.
// 5. Return the reportID of the generated report.

let db = require("../db");
const uuid = require("uuid");

function createCommidity(cmdtyName) {
  return new Promise((resolve, reject) => {
    db.get().query(
      "SELECT * FROM commodity WHERE cmdtyName=?",
      [cmdtyName],
      function (err, commodityResult) {
        if (err) {
          reject(err);
        } else {
          if (commodityResult.length > 0) {
            resolve(commodityResult[0].cmdtyID);
          } else {
            db.get().query(
              "INSERT INTO commodity(cmdtyName)values(?)",
              [cmdtyName],
              function (err, commidityResults) {
                if (err) {
                  reject(err);
                }
                resolve(commidityResults.insertId);
              }
            );
          }
        }
      }
    );
  });
}

function getCommidityName(cmdtyID) {
  return new Promise((resolve, reject) => {
    db.get().query(
      "SELECT * FROM commodity WHERE cmdtyID=?",
      [cmdtyID],
      function (err, commodityResult) {
        if (err) {
          reject(err);
        } else {
          if (commodityResult.length > 0) {
            resolve(commodityResult[0].cmdtyName);
          } else {
            resolve("");
          }
        }
      }
    );
  });
}

function createReport(req, res) {
  let reportID = uuid.v4();
  let { reportDetails } = req.body;
  let {
    userID,
    marketName,
    marketType,
    cmdtyName,
    priceUnit,
    convFctr,
    price,
  } = reportDetails;
  console.log("reportDetails", reportDetails);
  let apiPromise = new Promise((resolve, reject) => {
    db.get().query(
      "SELECT reportID FROM market WHERE marketName=?",
      [marketName],
      async function (err, marketResult) {
        if (err) {
          reject(err);
        } else {
          let cmdtyID = await createCommidity(cmdtyName);
          if (marketResult.length > 0) {
            reportID = marketResult[0].reportID;
            db.get().query(
              "INSERT INTO market( userID, marketName, cmdtyID, marketType,priceUnit,convFctr,price,reportID)values(?,?,?,?,?,?,?,?)",
              [
                userID,
                marketName,
                cmdtyID,
                marketType,
                priceUnit,
                convFctr,
                price,
                reportID,
              ],
              function (err, results) {
                if (err) {
                  reject(err);
                }
                resolve(reportID);
              }
            );
          } else {
            db.get().query(
              "INSERT INTO market( userID, marketName, cmdtyID, marketType,priceUnit,convFctr,price,reportID)values(?,?,?,?,?,?,?,?)",
              [
                userID,
                marketName,
                cmdtyID,
                marketType,
                priceUnit,
                convFctr,
                price,
                reportID,
              ],
              function (err, results) {
                if (err) {
                  reject(err);
                }
                resolve(reportID);
              }
            );
          }
        }
      }
    );
  });
  apiPromise
    .then((results) => {
      if (results) {
        res.json({ status: "success", reportID: results });
      }
    })
    .catch((error) => {
      console.log(error);
      res.json({ status: -2 });
    });
}
exports.createReport = createReport;

function getReport(req, res) {
  let { reportID } = req.query;
  let apiPromise = new Promise((resolve, reject) => {
    db.get().query(
      "SELECT * FROM market WHERE reportID=?",
      [reportID],
      async function (err, marketResult) {
        if (err) {
          reject(err);
        } else {
          let users = marketResult.map((item) => item.userID);
          let meanPrice = marketResult.map((item) => item.price);
          meanPrice =
            meanPrice.reduce((a, b) => a + b, 0) / marketResult.length;

          let totalWeight = marketResult
            .map((item) => item.convFctr)
            .reduce((a, b) => a + b, 0);

          let pricePerKg = (meanPrice * marketResult.length) / totalWeight;
          console.log(meanPrice, totalWeight, parseInt(pricePerKg));

          let cmdtyName = await getCommidityName(marketResult[0].cmdtyID);
          let resObj = {
            _id: reportID,
            cmdtyName: cmdtyName,
            marketID: marketResult[0].marketID,
            marketName: marketResult[0].marketName,
            users: users,
            timestamp: new Date(),
            priceUnit: "Kg",
            price: parseInt(pricePerKg),
          };
          resolve(resObj);
        }
      }
    );
  });
  apiPromise
    .then((results) => {
      if (results) {
        res.json(results);
      }
    })
    .catch((error) => {
      console.log(error);
      res.json({ status: -2 });
    });
}
exports.getReport = getReport;
