const userController = require("../controllers/user.controller");

app.get("/:limit/:offset", userController.findAll)
app.get("/:name", userController.findByName)

app.post('/register', userController.register);
app.post('/update', userController.update);