const axios = require("axios");

const swaggerFiles = [
  {
    url: `${process.env.MC_COMPONENT_URL}/swagger.json`,
    basePaths: ["/"],
    tag: "Microservice: mc_component",
  },
  {
    url: `${process.env.MC_USER_URL}/swagger.json`,
    basePaths: ["/"],
    tag: "Microservice: mc_user",
  },
  {
    url: `${process.env.MC_NOTIFICATION_URL}/swagger.json`,
    basePaths: ["/"],
    tag: "Microservice: mc_notification",
  },
  {
    url: `${process.env.MC_ORDER_URL}/swagger.json`,
    basePaths: ["/"],
    tag: "Microservice: mc_order",
  },
  {
    url: `${process.env.MC_AUTH_URL}/swagger.json`,
    basePaths: ["/"],
    tag: "Microservice: mc_auth",
  },
  {
    url: `${process.env.MC_ARTICLE_URL}/swagger.json`,
    basePaths: ["/"],
    tag: "Microservice: mc_article",
  },
  {
    url: `${process.env.MC_MENU_URL}/swagger.json`,
    basePaths: ["/"],
    tag: "Microservice: mc_menu",
  },
  {
    url: `${process.env.MC_LOG_URL}/swagger.json`,
    basePaths: ["/"],
    tag: "Microservice: mc_log",
  },
  {
    url: `${process.env.MC_RESTAURANT_URL}/swagger.json`,
    basePaths: ["/"],
    tag: "Microservice: mc_restaurant",
  },
];

let mergedSwagger = {
  openapi: "3.0.0",
  info: {
    title: "API Gateway",
    version: "1.0.0",
    description: "Centralized API documentation for all microservices",
  },
  paths: {},
  components: {
    schemas: {},
  },
  tags: [],
};

async function fetchSwaggerFile(url) {
  try {
    const response = await axios.get(url);
    console.log(`Successfully fetched ${url}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error.message);
    return null;
  }
}

function normalizePath(basePath, specificPath) {
  if (basePath.endsWith("/")) {
    basePath = basePath.slice(0, -1);
  }
  if (!specificPath.startsWith("/")) {
    specificPath = `/${specificPath}`;
  }
  return `${basePath}${specificPath}`;
}

async function mergeSwaggerFiles() {
  for (const { url, basePaths, tag } of swaggerFiles) {
    const swaggerDoc = await fetchSwaggerFile(url);
    if (swaggerDoc) {
      for (const basePath of basePaths) {
        if (swaggerDoc.paths) {
          Object.keys(swaggerDoc.paths).forEach((path) => {
            const fullPath = normalizePath(basePath, path);
            mergedSwagger.paths[fullPath] = mergedSwagger.paths[fullPath] || {};
            Object.keys(swaggerDoc.paths[path]).forEach((method) => {
              mergedSwagger.paths[fullPath][method] =
                mergedSwagger.paths[fullPath][method] || {};
              mergedSwagger.paths[fullPath][method] =
                swaggerDoc.paths[path][method];
              mergedSwagger.paths[fullPath][method].tags =
                mergedSwagger.paths[fullPath][method].tags || [];
              mergedSwagger.paths[fullPath][method].tags.push(tag);
            });
          });
        }
      }
      if (swaggerDoc.components && swaggerDoc.components.schemas) {
        Object.assign(
          mergedSwagger.components.schemas,
          swaggerDoc.components.schemas
        );
      }
      mergedSwagger.tags.push({ name: tag });
    } else {
      console.error(`Failed to fetch or parse Swagger file from ${url}`);
    }
  }
  return mergedSwagger;
}

module.exports = { mergeSwaggerFiles };
