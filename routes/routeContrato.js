const router = require("express").Router();

const ContratoController = require("../controllers/ContratoController");

//create
router.post("/contrato", ContratoController.GenerateContrato);

module.exports = router;
