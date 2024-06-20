require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const { createProxyMiddleware } = require("http-proxy-middleware");
const swaggerUi = require("swagger-ui-express");
const { mergeSwaggerFiles } = require("./swagger.config");
const https = require("https");
const fs = require("fs");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;
const TOKEN_REFRESH_URL = process.env.TOKEN_REFRESH_URL;
const key = fs.readFileSync(path.join(__dirname, "localhost-key.pem"));
const cert = fs.readFileSync(path.join(__dirname, "localhost.pem"));

const PROXY_TARGETS = {
  mc_component: process.env.MC_COMPONENT_URL,
  mc_user: process.env.MC_USER_URL,
  mc_notification: process.env.MC_NOTIFICATION_URL,
  mc_order: process.env.MC_ORDER_URL,
  mc_auth: process.env.MC_AUTH_URL,
  mc_article: process.env.MC_ARTICLE_URL,
  mc_menu: process.env.MC_MENU_URL,
  mc_log: process.env.MC_LOG_URL,
  mc_restaurant: process.env.MC_RESTAURANT_URL,
};

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

      if (response.status === 201) {
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

const isRequestFromSwaggerUI = (req) => {
  return req.headers.referer && req.headers.referer.includes("/api-docs");
};

app.use("/api/*", (req, res, next) => {
  if (isRequestFromSwaggerUI(req)) {
    next();
  } else if (
    req.originalUrl.startsWith("/api/mc_auth/login") ||
    req.originalUrl.startsWith("/api/mc_auth/register")
  ) {
    next();
  } else {
    middleware(req, res, next);
  }
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

mergeSwaggerFiles().then((mergedSwagger) => {
  app.use("/api-docs", swaggerUi.serve);
  app.get("/api-docs", swaggerUi.setup(mergedSwagger));
});

const server = https.createServer({ key, cert }, app);

server.listen(port, () => {
  console.log(`Server is running at https://localhost:${port}`);
});
