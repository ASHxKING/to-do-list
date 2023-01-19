const express = require("express");
const bodyParser = require("body-parser");
const Date = require(__dirname + "/date.js");

// console.log(Date());

const app = express();
const port = 3000;
var items = [];
var workListItem = [];

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/", function (req, res) {
  let day = Date.getDate();

  res.render("lists", { listTitle: day, newListItems: items });
});
app.post("/", function (request, response) {
  let add = request.body.newListItems;
  let item = request.body.newListItems;
  if (request.body.list === "Work List") {
    workListItem.push(item);
    response.redirect("/work");
  } else {
    items.push(add);
    response.redirect("/");
  }
});
app.get("/about", function (req, res) {
  res.render("about");
});
app.get("/work", function (req, res) {
  res.render("lists", { listTitle: "Work List", newListItems: workListItem });
});

app.listen(process.env.PORT || port, function () {
  console.log("app running on port 3000");
});
