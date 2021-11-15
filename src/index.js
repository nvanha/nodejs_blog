const path = require("path");
const express = require("express");
const morgan = require("morgan");
const methodOverride = require("method-override");
const handlebars = require("express-handlebars");

const SortMiddleware = require("./app/middlewares/SortMiddleware");

const route = require("./routes/index");
const db = require("./config/db/index");

// Connect to DB
db.connect();

const app = express();
const port = 3000;

// Use static folder
app.use(express.static(path.join(__dirname, "public")));

// Middleware
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

app.use(methodOverride("_method"));

// Custom middlewares
app.use(SortMiddleware);

/**
 * XMLHttpRequest, fetch, axios
 */

// HTTP logger
app.use(morgan("combined"));

// Template engine
app.engine(
  "hbs",
  handlebars({
    extname: ".hbs",
    helpers: {
      sum: (a, b) => a + b,
      sortable: (field, sort) => {
        const sortType = field === sort.column ? sort.type : "default";

        const icons = {
          default: "oi oi-elevator",
          desc: "oi oi-sort-descending",
          asc: "oi oi-sort-ascending",
        };
        const types = {
          default: "desc",
          asc: "desc",
          desc: "asc",
        };

        const icon = icons[sortType];
        const type = types[sortType];

        return `
          <a href="?_sort&column=${field}&type=${type}">
            <span class="${icon}"></span>
          </a>
        `;
      },
    },
  })
);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "resources", "views"));

// Route init
route(app);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
