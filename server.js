require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const mongoose = require('mongoose');
const { createProxyMiddleware } = require("http-proxy-middleware");
const app = express();
const port = process.env.PORT;
const PROXY_TARGETS = {
  mc_component: process.env.MC_COMPONENT_URL,
  mc_user: process.env.MC_USER_URL,
  mc_notification: process.env.MC_NOTIFICATION_URL,
  mc_order: process.env.MC_ORDER_URL,
  mc_auth: process.env.MC_AUTH_URL,
  mc_article: process.env.MC_ARTICLE_URL,
  mc_menu: process.env.MC_MENU_URL,
  mc_log: process.env.MC_LOG_URL,
  mc_payment: process.env.MC_PAYMENT_URL,
};
const TOKEN_REFRESH_URL = process.env.TOKEN_REFRESH_URL;

app.use(
  cors({
    exposedHeaders: ["Newaccesstoken"],
  })
);

const middleware = async (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(444).send({ message: "No token provided." });
  }
  try {
    jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    next();
  } catch (err) {
    try {
      const response = await axios.post(TOKEN_REFRESH_URL, { token: token });
      if (response.data.message === "Token refreshed successfully!") {
        res.setHeader("Newaccesstoken", response.data.newAccessToken);
        next();
      } else {
        return res.status(444).send({ message: "Failed to refresh token." });
      }
    } catch (error) {
      return res.status(444).send({ message: "Failed to refresh token." });
    }
  }
};

app.use("/api/*", (req, res, next) => {
  if (
    req.originalUrl.startsWith("/api/mc_auth/login") ||
    req.originalUrl.startsWith("/api/mc_auth/register")
  ) {
    next();
  } else {
    middleware(req, res, next);
  }
});

const dbUrl = process.env.MONGO_URI || "mongodb://localhost:27017/kittydelivery";

mongoose
  .connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch((err) => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });


Object.entries(PROXY_TARGETS).forEach(([path, target]) => {
  app.use(
    `/api/${path}`,
    createProxyMiddleware({
      target,
      changeOrigin: true,
    })
  );
});

app.listen(port, () => console.log(`app running on http://localhost:${port}`));
