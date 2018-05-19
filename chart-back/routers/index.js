const Router = require('koa-router');

const router = new Router();
const passport = require('passport');
const defaultController = require('../controllers/defaultController');
const authController = require('../controllers/authController');
const dataTypeController = require('../controllers/dataTypeController');
const dataController = require('../controllers/dataController');

// router.get('/', defaultController.index.get);

//ROUTES USER
router.post('/login', authController.login.post);
router.post('/registration', authController.registration.post);
router.get('/', authController.home.get);

//ROUTES TYPES DATA
router.get('/types', dataTypeController.dataTypes.get);
router.put('/types/:login', dataTypeController.dataTypes.put);
router.post('/types', dataTypeController.dataTypes.post);
router.delete('/types', dataTypeController.dataTypes.delete);

//ROUTES DATA
router.get('/data', dataController.data.get);
router.put('/data', dataController.data.put);
router.post('/data', dataController.data.post);
router.delete('/data', dataController.data.delete);



module.exports = router;