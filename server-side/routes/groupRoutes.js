const express = require('express')
const router = express.Router();
const groupController = require('../controllers/groupController');

router.get('/',groupController.getAllGroups); //done
router.get('/byid', groupController.getGroup);
router.post('/add',groupController.createGroup); //done
router.put('/update',groupController.updateGroup); //done
router.delete('/delete',groupController.deleteGroup); //done

module.exports = router;