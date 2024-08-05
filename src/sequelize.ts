import { Sequelize, Error as SequelizeError } from "sequelize";

type Config = {
  host: string;
  port: string;
  database: string;
  username: string;
  password: string;
};

let host = process.env.PG_Host;
let port = process.env.PG_Port;
let database = process.env.PG_Database;
let username = process.env.PG_Username;
let password = process.env.PG_Password;

if (!host || !port || !database || !username || !password) {
  throw new Error("Invalid database config!");
}

const config: Config = {
  host,
  port,
  database,
  username,
  password,
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
    logging: (sql, timing) => {
      if (
        timing &&
        timing > parseInt(process.env.Sequelize_Query_TimeLimit ?? "1000", 10)
      ) {
        console.log(`Slow query (execution time ${timing} ms): ${sql}`);
      } else {
        if (process.env.NODE_ENV !== "production") {
          console.log(`RAW Query:\n${sql}`);
        }
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

    synchronizeSequelize();
  })
  .catch((err: SequelizeError) => {
    console.error(`Unable to connect to the database ${config.database}:`, err); // eslint-disable-line no-console
  });

const synchronizeSequelize = () => {
  sequelize
    .sync()
    .then(() => {
      console.log("Table synchronized successfully!");
    })
    .catch((error) => {
      console.error("Unable to create table : ", error);
    });
};

export default sequelize;
