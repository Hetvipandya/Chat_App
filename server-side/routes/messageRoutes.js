const express = require('express')
const router = express.Router();
const messageController = require('../controllers/messageController');

router.get('/',messageController.getAllMessage); //done
router.get('/:id',messageController.getMessage); //done
router.post('/add',messageController.createMessage); //done
router.delete('/delete', messageController.deleteMessage); //done

module.exports = router;