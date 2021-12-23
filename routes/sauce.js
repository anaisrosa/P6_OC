const express = require("express");
const router = express.Router();

const sauceCtrl = require("../controllers/sauceController");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

router.get("/", auth, sauceCtrl.getAllSauces); // Récupère TOUTES les sauces
router.get("/:id", auth, sauceCtrl.getOneSauce); // Récupère UNE seule sauce
router.post("/", auth, multer, sauceCtrl.createSauce); // Création d'une sauce
router.put("/:id", auth, multer, sauceCtrl.modifySauce); // Modification d'une sauce
router.delete("/:id", auth, sauceCtrl.deleteSauce); //Suppréssion d'une Sauce + son id
router.post("/:id/like", auth, sauceCtrl.likeSauce); // création d'un avis pour la sauce

module.exports = router;
