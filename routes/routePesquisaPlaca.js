const router = require("express").Router();

const PesquisaPlacaController = require("../controllers/PesquisaPlacaController");

//create
router.post("/pesquisaPlaca", PesquisaPlacaController.pesquisaPlaca);

module.exports = router;
