const express = require('express')
const router = express.Router();
const loginController = require('../controllers/loginController');

router.get('/',loginController.getAllLogin); //done
router.get('/:id',loginController.getLogin ); //done
router.post('/add',loginController.createLogin); //done
router.delete('/delete',loginController.deleteLogin); //done

module.exports = router;