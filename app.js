const express = require("express");
const app = express();
const port = 3000;
const expHbs = require("express-handlebars");
const methodOverride = require("method-override");
const routes = require("./routes");
const session = require("express-session");
require("./config/mongoose");
const usePassport = require("./config/passport");
const flash = require("connect-flash");

// const hbs = expHbs.create({
//   helpers: {
//     select: function (value1, value2) {
//       return value1 === value2 ? "selected" : "";
//     },
//   },
// });

app.engine("handlebars", expHbs.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

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
app.use(flash());
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated();
  res.locals.user = req.user;
  res.locals.success_msg = req.flash("success_msg");
  res.locals.warning_msg = req.flash("warning_msg");
  res.locals.error = req.flash("error");
  next();
});

app.use(routes);

app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`);
});
