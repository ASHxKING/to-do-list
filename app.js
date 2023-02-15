const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");

// const Date = require(__dirname + "/date.js");
const mongoose = require("mongoose");

mongoose.set("strictQuery", false);
// setting connection to mongo db
mongoose.connect("mongodb://127.0.0.1:27017/todolistDB");

const app = express();
const port = 3000;
// var items = [];
// var workListItem = [];

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

// creating schema for items
const itemSchema = new mongoose.Schema({
  name: String,
});
// creating item model
const ITEM = mongoose.model("item", itemSchema);

// default items creation
const item1 = new ITEM({
  name: "welcome to your to-do-list",
});
const item2 = new ITEM({
  name: "Hit + button to add items to your to-do-list",
});
const item3 = new ITEM({
  name: "<-- Hit to delete an item from your to-do-list",
});

const defaultitem = [item1, item2, item3];

// customlist schema
const customListSchema = new mongoose.Schema({
  name: String,
  items: [itemSchema],
});
// custom list model
const LIST = mongoose.model("list", customListSchema);

// ITEM.deleteMany({} , function(err){
//   console.log("successfully deleted");
// });

app.get("/", function (req, res) {
  // let day = Date.getDate();
  ITEM.find({}, function (err, result) {
    if (result.length === 0) {
      ITEM.insertMany(defaultitem, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("added successfully default items");
          res.redirect("/");
        }
      });
    } else {
      res.render("lists", { listTitle: "Today", newListItems: result });
      // console.log(result);
    }
  });
});

// get request for route parameters
app.get("/:customListName", function (req, res) {
  const customlistname = _.capitalize(req.params.customListName);

  LIST.findOne({ name: customlistname }, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      if (result) {
        // console.log("already exist");
        res.render("lists", {
          listTitle: result.name,
          newListItems: result.items,
        });
      } else {
        // console.log("does not exist");
        
        const list = new LIST({
          name: customlistname,
          items: defaultitem,
        });
        list.save();
        res.redirect("/" + customlistname);
      }
    }
  });
});

// post request to home route when submit is pressed
app.post("/", function (request, response) {
  const itemName = request.body.newitem;
  const listName = request.body.list;
  const itemx = new ITEM({
    name: itemName,
  });
  if (listName === "Today") {
    itemx.save();
    response.redirect("/");
  } else {
    LIST.findOne({ name: listName }, function (err, result) {
      // console.log(result);
      result.items.push(itemx);
      result.save();
      response.redirect("/" + listName);
    });
  }
});
// post request when checkbox is clicked to delete an item
app.post("/delete", function (req, res) {
  const checkeditemid = req.body.checkbox;
  const listname = req.body.listName;
  // console.log(listname);

  if (listname === "Today") {
    ITEM.findByIdAndRemove(req.body.checkbox, function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log("successfully removed the checked item");
        res.redirect("/");
      }
    });
  } else{
    LIST.findOneAndUpdate({name:listname},{$pull : {items :{_id : checkeditemid}}} , function(err,result){
      if(!err){
        res.redirect("/" + listname)
      }
    })
  }
});
// about page get route
app.get("/about", function (req, res) {
  res.render("about");
});
// port
app.listen(process.env.PORT || port, function () {
  console.log("app running on port 3000");
});
