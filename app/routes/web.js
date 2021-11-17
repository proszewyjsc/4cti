const express = require('express');
const router = new express.Router();
const ShopController = require('../controllers/company-controller');
const UserController = require('../controllers/user-controller');
const PageController = require('../controllers/page-controller');
const CardController = require('../controllers/card-controller');
const upload = require('../services/uploader');

router.get('/', PageController.showHome);
router.get('/sklep', ShopController.showShop);
router.get('/sklep/:name', ShopController.showCompany);
router.get('/koszyk', CardController.addCard);
router.post('/koszyk', CardController.sendEmail);

router.get('/zarejestruj', UserController.showRegister);
router.post('/zarejestruj', UserController.register);
router.get('/zaloguj', UserController.showLogin);
router.post('/zaloguj', UserController.login);
router.get('/wyloguj', UserController.logout);

router.get('/admin/profil', UserController.showProfile);
router.post('/admin/profil', UserController.update);

router.get('/admin/sklep/dodaj', ShopController.showCreateCompanyForm);
router.post('/admin/sklep/dodaj', upload.single('image'), ShopController.createCompany);
router.get('/admin/sklep/:name/edytuj', ShopController.showEditCompanyForm);
router.post('/admin/sklep/:name/edytuj', upload.single('image'), ShopController.editCompany);
router.get('/admin/sklep/:name/usun', ShopController.deleteCompany);
router.get('/admin/sklep/:name/usun-zdjecie', ShopController.deleteImage);

router.get('/csv', ShopController.getCSV);

router.get('*', PageController.showNotFound);

module.exports = router;