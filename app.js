const express = require("express");
const app = express();
const port = 3000;
const expHbs = require("express-handlebars");
const methodOverride = require("method-override");
const routes = require("./routes");
const session = require("express-session");
require("./config/mongoose");
const usePassport = require("./config/passport");


app.engine("hbs", expHbs.engine({ defaultLayout: "main" }));
app.set("view engine", "hbs");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(
  session({
    secret: "FinancialFreedom!!",
    resave: false,
    saveUninitialized: true,
  })
);

usePassport(app);

app.use(routes);

app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`);
});
