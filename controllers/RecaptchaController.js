const axios = require('axios');
exports.validRecaptcha = async (req, res) => {
  const { token } = req.body;
  //console.log(token); // Token do reCAPTCHA enviado pelo cliente
  const secretKey = process.env.GOOGLE_SECRET; // Substitua pela chave secreta
  //console.log(secretKey); // Chave secreta do reCAPTCHA
  const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify`, null, {
    params: {
      secret: secretKey,
      response: token,
    },
  });

  //console.log(response.data); // Retorna se o token é válido
  if (response.data.success) {
    return res.status(200).json({ message: 'sucesso' });
  } else {
    return res.status(400).json({ message: 'failure' });
  }
};
