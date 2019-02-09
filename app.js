const keys = require("./config/keys");
const express = require("express");
const stripe = require("stripe")(keys.stripeSecretKey);
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const path = require("path");

const app = express();

/* --------------------Middlewares------------------------- */
// Handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Static folder
app.use(express.static(path.join(__dirname, "public")));

/* ---------------------- Routes ------------------------ */
// Index Route
app.get("/", (req, res) => {
  res.render("index", { stripePublishableKey: keys.stripePublishableKey });
});

// Charge Route
app.post("/charge", (req, res) => {
  const amount = 2500;

  stripe.customers
    .create({
      email: req.body.stripeEmail,
      source: req.body.stripeToken
    })
    .then(customer =>
      stripe.charges.create({
        amount,
        description: "Nodejs Ebook",
        currency: "usd",
        customer: customer.id
      })
    )
    .then(charge => res.render("success"));
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server started at port ${port}...`));
