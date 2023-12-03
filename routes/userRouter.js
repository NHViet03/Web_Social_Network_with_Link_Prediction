const router = require('express').Router()
const auth = require("../middleware/auth")
const userCtrl = require("../controllers/userCtrl")


router.get('/search'/*,auth => phần middleware bị lỗi*/ , userCtrl.searchUser)
router.get('/user/:id', userCtrl.getUser)
router.patch('/user', auth, userCtrl.updateUser)




module.exports = router