const router = require("express").Router();
const userCtrl = require("../controllers/userCtrl");
const auth = require("../middleware/auth");

router.get('/suggestions',auth,userCtrl.getSuggestions)


module.exports = router;
