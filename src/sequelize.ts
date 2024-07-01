import { Sequelize, Error } from "sequelize";

type Config = {
  host: string;
  port: string;
  database: string;
  username: string;
  password: string;
};

const config: Config = {
  host: process.env.PG_Host!,
  port: process.env.PG_Port!,
  database: process.env.PG_Database!,
  username: process.env.PG_Username!,
  password: process.env.PG_Password!,
};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    port: parseInt(config.port, 10),
    dialect: "postgres",
    pool: {
      max: parseInt(process.env.Sequelize_Pool_Max ?? "5", 10),
      min: 0,
      acquire: parseInt(process.env.Sequelize_Pool_Acquire ?? "30000", 10),
      idle: 10000,
    },
    logging(sql, timing) {
      if (
        timing &&
        timing > parseInt(process.env.Sequelize_Query_TimeLimit ?? "1000", 10)
      ) {
        console.log(`Slow query (execution time ${timing} ms): ${sql}`);
      }
    },
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log(
      `Connection has been established successfully to,\nDatabase Name: ${config.database}\nUser Name: ${config.username}`
    ); // eslint-disable-line no-console
  })
  .catch((err: Error) => {
    console.error(`Unable to connect to the database ${config.database}:`, err); // eslint-disable-line no-console
  });

sequelize
  .sync()
  .then(() => {
    console.log("Table synchronized successfully!");
  })
  .catch((error) => {
    console.error("Unable to create table : ", error);
  });

export default sequelize;
