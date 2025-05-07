const router = require('express').Router()
const messageCtrl = require('../controllers/messageCtrl')
const auth = require('../middleware/auth')

router.post('/message', auth, messageCtrl.createMessage)
router.get('/conversations', auth, messageCtrl.getConversations)
router.get('/numberNewMessage', auth, messageCtrl.getNumberNewMessage)
router.put('/accept-conversation', auth, messageCtrl.acceptConversation)
router.post('/readMessage/:id', auth, messageCtrl.readMessage)
router.get('/message/:id', auth, messageCtrl.getMessages)
router.delete('/conversation/:id', auth, messageCtrl.deleteConversation)


module.exports = router;