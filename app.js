const express = require("express");
const sequelize = require("./config/connection.js");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser")
const FileUpload = require("express-fileupload");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const app = express();
const port = 3001;
dotenv.config();

app.use(
  cors({
    credentials: true,
    origin: (origin, callback) => {
      // Check if the origin is allowed
      const allowedOrigins = [
        `http://10.10.102.111:${port}`,
        `http://10.10.102.113:${port}`,
        `http://10.10.102.209:${port}`,
        `http://localhost:${port}`,
        "http://10.10.102.209:8000",
        "http://10.10.102.111:8000",
        "http://10.10.102.113:8000",
        "http://localhost:8000",
        "http://localhost:8080",
      ];

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true); // Allow the request
      } else {
        callback(new Error("Not allowed by CORS")); // Deny the request
      }
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    optionsSuccessStatus: 204,
    allowedHeaders: "Content-Type, Authorization",
  })
);

app.use(cookieParser())
app.use(express.json());
app.use(express.static("public"));
app.use(FileUpload());

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Express API with Sequelize",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://10.10.102.111:3001/api",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT", // Adjust according to your token format
        },
      },
    },
  },
  apis: ["./routes/**.js"], // files containing annotations as above
};

const openapiSpecification = swaggerJsdoc(options);

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(openapiSpecification));

// Import and use BatchRoutes
const batchRoutes = require("./routes/BatchRoute.js");
app.use("/api", batchRoutes);

const pengajarRoutes = require("./routes/PengajarRoute.js");
app.use("/api", pengajarRoutes);

const pesertaRoute = require("./routes/PesertaRoute.js");
app.use("/api", pesertaRoute);

const materiRouter = require("./routes/MateriRouter.js");
app.use("/api", materiRouter);

const userRouter = require("./routes/UserRoute.js");
app.use("/api", userRouter);

const authRouter = require("./routes/AuthRoute.js");
app.use("/api", authRouter);

const settingRouter = require('./routes/SettingRoute.js')
app.use("/api", settingRouter)

app.listen(port, "0.0.0.0", async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected to PostgreSQL");
  } catch (error) {
    console.error("Error connecting to PostgreSQL:", error.message);
  }
  console.log("Server Running . . .");
});
