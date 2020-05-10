const express = require("express");
const app = express();
const documentController = require("../controllers/document.controller");

app.get("/", documentController.findAll)
app.get("/info/:_id", documentController.getInforUser)
app.get("/create",documentController.create)
