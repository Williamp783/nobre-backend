const express = require("express");
const router = express.Router();
const fs = require("fs");
const { generateHTML, generatePDF } = require("../services/GenerateContrato");
const { enviarEmailComPDF } = require("../services/emailService");

router.post("/enviarContrato", async (req, res) => {
    try {
        const data = req.body;
        console.log("📥 Dados recebidos:", data);

        const html = generateHTML(data);
        console.log("✅ HTML gerado");

        const pdfBuffer = await generatePDF(html);
        console.log("✅ PDF gerado. Tamanho do buffer:", pdfBuffer.length);

        // 👇 Agora dentro do escopo certo
        const { emailConsultor, emailRevenda } = data.formData;

        const toDestinatarios = [
            emailConsultor,
            emailRevenda,
        ].filter(Boolean);
        console.log("📧 Destinatários:", toDestinatarios.join(", "));
        const bccDestinatarios = [
            "contato@nobreautomotive.com.br",
            "assistencia@nobreautomotive.com.br",
            "financeiro@nobreautomotive.com.br",
        ];



        await enviarEmailComPDF(toDestinatarios, bccDestinatarios, pdfBuffer, data.formData);
        console.log("📤 E-mail enviado com sucesso para:", toDestinatarios.join(", "));

        res.status(200).json({ message: "PDF enviado com sucesso!" });
    } catch (error) {
        console.error("❌ Erro detalhado:", error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;