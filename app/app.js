import path from "path";
import dotenv from "dotenv";
dotenv.config(path.resolve(__dirname + "../.env"));
import config from "~/config";

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import logger from "morgan";
import { sequelize } from "~/models";
import http from "http";
import session from "express-session";
import fs from "fs";
import https from "https";

// Routes
import authenticationRoutes from "~/routes/authentication";

import userRoutes from "~/routes/user";
import mediaRoutes from "~/routes/media";
import errorRoutes from "~/routes/error";

// let serverOptions = {
//   key: fs.readFileSync('./key.pem'),
//   cert: fs.readFileSync('./cert.pem'),
// };

const app = express();
const server = http.Server(app);
const PORT = config.port;
// const NOTIFICATION_PORT = config.NOTIFICATION_PORT;

app.set("view engine", "pug");

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://localhost:3000",
      "http://musedale.thinqteam.com",
      "https://musedale.thinqteam.com",
    ],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

app.use(
  session({
    secret: "secret",
    proxy: true,
    resave: true,
    saveUninitialized: true,
  })
);

app.use(cookieParser());
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

if (config.simulatedDelay) {
  app.all("*", (req, res, next) => {
    setTimeout(() => {
      next();
    }, 1000);
  });
}

app.use(config.versionUrl + "/docs", express.static("docs"));
app.use(config.versionUrl, authenticationRoutes);
app.use(config.versionUrl, userRoutes);
app.use(config.versionUrl, mediaRoutes);
app.use(config.versionUrl, errorRoutes);

app.get(config.versionUrl, async (_, res) => {
  return res.send('<a href="' + config.versionUrl + '/docs">Docs</a>');
});

sequelize.sync({ force: false }).then(() => {
  // https.createServer(serverOptions, app).listen(PORT, () => {
  //   console.log(`App started on ${PORT}`);
  // });

  app.listen(PORT, () => {
    console.log(`App started on ${PORT}`);
  });
});
