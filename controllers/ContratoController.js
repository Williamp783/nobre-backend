const {
  generateContrato,
  generateHTML,
  generatePDF,
} = require("../services/GenerateContrato"); // Função para gerar o contrato

exports.GenerateContrato = async (req, res) => {
  const { decodificadorPrecificador, formData } = req.body;

  /*if (!marca) {
    return res.status(400).json({ error: "TC-GTN-01:  marca is mandatory" });
  }*/

  console.log("formData", formData);

  try {
    console.log("decodificadorPrecificador", decodificadorPrecificador);

    const marca = decodificadorPrecificador.marca;
    const html = generateHTML({
      formData,
      //veiculoModelo,
      //combustivel,
      //anoFabricacao,
      //placa,
    });
    const pdfBuffer = await generatePDF(html);
    const nomeCliente = formData.fullName
      .trim()
      .replace(/[^\w\sÀ-ÿ]/gi, "") // remove caracteres especiais
      .replace(/\s+/g, " "); // mantém espaços visíveis no nome

    const placa = formData.placa.trim().toUpperCase().replace(/\s+/g, "");

    const nomeArquivo = `Contrato ${nomeCliente} - Placa ${placa}.pdf`;
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="Contrato ${nomeCliente} - Placa ${placa}.pdf"; filename*=UTF-8''${encodeURIComponent(`Contrato ${nomeCliente} - Placa ${placa}.pdf`)}`,
    });
    /*
    const buffer = generateContrato(marca);

    // Define o arquivo para download
    // DOCX FUNCIONA, MAS NAO SUBSTITUI OS VALORES NO DOCX
    res.set({
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": "attachment; filename=contrato.docx",
    });
    */
    res.send(pdfBuffer); // Envia o arquivo gerado
    //if (result) {
    //console.log('result', result);
    //res.json(result);
    //} else {
    //res.status(404).json({ error: "Phrases não encontradas" });
    //}
  } catch (error) {
    console.log("Erro:", error);
    res.status(500).json({ error: "PC-GC-01: Error try genarete contract" + error });
  }
};
