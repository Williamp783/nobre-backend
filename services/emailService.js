const nodemailer = require("nodemailer");

async function enviarEmailComPDF(toDestinatarios, bccDestinatarios, pdfBuffer, formData) {
  console.log("📧 Enviando como:", process.env.EMAIL_LOGIN);

  const nomeCliente = formData.fullName
    .trim()
    .replace(/[^\w\sÀ-ÿ]/gi, "")
    .replace(/\s+/g, " ");

  const placa = formData.placa
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "");

  const nomeArquivo = `Contrato ${nomeCliente} - Placa ${placa}.pdf`;

  const transporter = nodemailer.createTransport({
    host: "br.lando3070.com.br",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_LOGIN,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: { rejectUnauthorized: false },
  });

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; font-size: 15px; color: #333;">
      <p>Olá,</p>
      <p>Segue em anexo o contrato gerado para o cliente <strong>${formData.fullName}</strong>, referente ao veículo com placa <strong>${formData.placa}</strong>.</p>
      <p>Atenciosamente,<br/>Equipe Nobre Automotive</p>
      <hr style="border: none; border-top: 1px solid #ccc; margin-top: 20px;" />
      <small style="color: #888;">Este e-mail foi gerado automaticamente. Em caso de dúvidas, entre em contato conosco.</small>
    </div>
  `;

  const mailOptions = {
    from: `"Nobre Automotive" <${process.env.EMAIL_LOGIN}>`,
    to: toDestinatarios,
    bcc: bccDestinatarios,
    replyTo: process.env.EMAIL_LOGIN,
    subject: `Contrato em PDF - ${formData.fullName}`,
    html: htmlContent,
    text: `Olá,\n\nSegue o contrato em PDF para o cliente ${formData.fullName}, referente ao veículo de placa ${formData.placa}.\n\nAtenciosamente,\nNobre Automotive`,
    attachments: [
      {
        filename: nomeArquivo,
        content: pdfBuffer,
      },
    ],
    headers: {
      "X-Priority": "3",
      "X-Mailer": "NobreMailer",
    },
  };

  await transporter.sendMail(mailOptions);
}

module.exports = { enviarEmailComPDF };