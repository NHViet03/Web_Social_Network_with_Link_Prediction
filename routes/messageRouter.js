const router = require('express').Router()
const messageCtrl = require('../controllers/messageCtrl')
const auth = require('../middleware/auth')

router.post('/message', auth, messageCtrl.createMessage)
router.post('/create-group-chat', auth, messageCtrl.createGroupChat)
router.get('/conversations', auth, messageCtrl.getConversations)
router.get('/conversation/:id', auth, messageCtrl.getConversation)
router.get('/numberNewMessage', auth, messageCtrl.getNumberNewMessage)
router.put('/remove-admin-group/:id', auth, messageCtrl.removeAdminGroup)
router.put('/leave-group/:id', auth, messageCtrl.leaveGroup)
router.post('/add-member-group-chat', auth, messageCtrl.addMemberGroupChat)
router.put('/delete-user-group/:id', auth, messageCtrl.deleteUserGroup)
router.put('/set-admin-group/:id', auth, messageCtrl.setAdminGroup)
router.put('/accept-conversation', auth, messageCtrl.acceptConversation)
router.put('/revokeMessage/:id', auth, messageCtrl.revokeMessage)
router.put('/editMessage/:id', auth, messageCtrl.editMessage)
router.post('/readMessage/:id', auth, messageCtrl.readMessage)
router.get('/message/:id', auth, messageCtrl.getMessages)
router.delete('/conversation/:id', auth, messageCtrl.deleteConversation)


module.exports = router;