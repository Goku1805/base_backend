var path = require("path");
var fs = require("fs");

var PRIVATE_KEY = fs.readFileSync(path.join(__dirname, "../private.key"));

var config = {
  env: process.env.NODE_ENV || "development",
  versionUrl: "/api/v1",
  host: `https://${process.env.HOST || "localhost"}:${
    process.env.PORT || 10001
  }`,
  port: process.env.PORT || 10001,
  notificationPort: process.env.NOTIFICATION_PORT || 10021,
  hashSalt: 10,
  refreshTokenLife: 1000 * 60 * 60 * 24 * 7,
  refreshTokenExpiresIn: 7,
  privateKey: PRIVATE_KEY,
  sessionDuration: 60 * 60 * 24 * 7,
  simulatedDelay: process.env.SIMULATED_DELAY || 0,
  rootFolder: path.resolve(path.join(__dirname, "..")),
  AWSAccessKeyId: "AKIAJWCMZBW4332OKJGA",
  AWSSecretKey: "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",
  AWSBucket: "lawn-server-storage-31-01-2020",
  AWSRegion: "ap-south-1",
  mailAddress: "hello@thinqteam.com",
  contactUsEmailAddr: "varun9509@gmail.com",
  razorpayKeyId: "rzp_test_T62VtpNugIn5Qs",
  razorpayKeySecret: "qGHaqyUOyvjFrztt5O3ROQ2M",
  googleClientId:
    "802918914620-lu5k3a33v750hbbd9u09103ule7pavvf.apps.googleusercontent.com",
  development: {
    username: process.env.DB_DEV_USERNAME,
    password: process.env.DB_DEV_PASSWORD,
    database: process.env.DB_DEV_DATABASE,
    host: process.env.DB_DEV_HOST,
    dialect: process.env.DB_DEV_DIALECT,
    AWSAccessKeyId: "AKIAJWCMZBW4332OKJGA",
    AWSSecretKey: "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",
    AWSBucket: "lawn-server-storage-31-01-2020",
    AWSRegion: "ap-south-1",
    mailAddress: "hello@thinqteam.com",
    contactUsEmailAddr: "varun9509@gmail.com",
    razorpayKeyId: "rzp_test_T62VtpNugIn5Qs",
    razorpayKeySecret: "qGHaqyUOyvjFrztt5O3ROQ2M",
  },
  test: {
    username: process.env.DB_TEST_USERNAME,
    password: process.env.DB_TEST_PASSWORD,
    database: process.env.DB_TEST_DATABASE,
    host: process.env.DB_TEST_HOST,
    dialect: process.env.DB_TEST_DIALECT,
    AWSAccessKeyId: "AKIAJWCMZBW4332OKJGA",
    AWSSecretKey: "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",
    AWSBucket: "lawn-server-storage-31-01-2020",
    AWSRegion: "ap-south-1",
    mailAddress: "hello@thinqteam.com",
    contactUsEmailAddr: "varun9509@gmail.com",
    razorpayKeyId: "rzp_test_T62VtpNugIn5Qs",
    razorpayKeySecret: "qGHaqyUOyvjFrztt5O3ROQ2M",
  },
  production: {
    username: process.env.DB_PROD_USERNAME,
    password: process.env.DB_PROD_PASSWORD,
    database: process.env.DB_PROD_DATABASE,
    host: process.env.DB_PROD_HOST,
    dialect: process.env.DB_PROD_DIALECT,
    AWSAccessKeyId: "AKIAJWCMZBW4332OKJGA",
    AWSSecretKey: "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",
    AWSBucket: "lawn-server-storage-31-01-2020",
    AWSRegion: "ap-south-1",
    mailAddress: "hello@thinqteam.com",
    contactUsEmailAddr: "varun9509@gmail.com",
    razorpayKeyId: "rzp_test_T62VtpNugIn5Qs",
    razorpayKeySecret: "qGHaqyUOyvjFrztt5O3ROQ2M",
  },
};

module.exports = config;
