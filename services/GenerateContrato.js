const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");

async function generatePDF(html) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"], // recomendado em produção
  });

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' }); // Aguarda o carregamento total
  await page.emulateMediaType('screen'); // Usa estilo de tela ao invés do print

  const pdf = await page.pdf({
    format: "A4",
    printBackground: true,
  });

  await browser.close();
  return pdf;
}


/*
const pdf = require("html-pdf");

function generatePDF(html) {
  return new Promise((resolve, reject) => {
    pdf.create(html, { format: "A4" }).toBuffer((err, buffer) => {
      if (err) return reject(err);
      resolve(buffer);
    });
  });
}
*/


function generateHTML(data) {
  console.log("data", data);
  let templatePath = "";
  
  const planoSelecionado1 = data.formData.planoSelecionado.nome.toLowerCase();
  if (planoSelecionado1.includes("bronze")) {
    templatePath = path.join(__dirname, "modelo12.html");
  } else if (["ouro", "classic", "prata"].some(valor => planoSelecionado1.includes(valor))) {
    templatePath = path.join(__dirname, "modelo24.html");
  } else if (planoSelecionado1.includes("cortesia")) {
    templatePath = path.join(__dirname, "modeloCortesia.html");
  }


  // Verifica o tipo de contrato e define o caminho do template correspondente
  //templatePath = path.join(__dirname, "modelo12.html"); // Caminho do modelo HTML


  const html = fs.readFileSync(templatePath, "utf-8"); // Carrega o HTML como string

  // Substitui os placeholders pelos valores fornecidos
  const updatedHTML = html
    .replace("{{marca}}", data.formData.marca)
    .replace("{{modelo}}", data.formData.veiculoModelo)
    .replace("{{combustivel}}", data.formData.combustivel)
    .replace("{{anoFabricacao}}", data.formData.anoFabricacao)
    .replace("{{anoModelo}}", data.formData.anoModelo)
    .replace("{{placa}}", data.formData.placa)
    .replace("{{renavam}}", data.formData.renavam)
    .replace("{{chassi}}", data.formData.chassi)
    .replace("{{cor}}", data.formData.cor)
    .replace("{{numeroMotor}}", data.formData.numMotor)
    .replace("{{versaoCarro}}", data.formData.versaoModelo)
    .replace("{{kmSaida}}", data.formData.kmRodados)
    .replace("{{dataProxRev}}", data.formData.proximaTrocaOleoData)
    .replace("{{kmProxRev}}", data.formData.proximaTrocaOleo)
    .replace("{{nomeCliente}}", data.formData.fullName)
    .replace("{{cpfCnpj}}", data.formData.cnpj)
    .replace("{{cpfCnpj1}}", data.formData.cnpj)
    .replace("{{dataNasc}}", data.formData.dataNascimento)
    .replace("{{endereco}}", data.formData.endereco)
    .replace("{{numero}}", data.formData.numero)
    .replace("{{bairro}}", data.formData.bairro)
    .replace("{{cidade}}", data.formData.cidade)
    .replace("{{estado}}", data.formData.estado)
    .replace("{{cep}}", data.formData.cep)
    .replace("{{telefone}}", data.formData.telefone)
    .replace("{{emailCliente}}", data.formData.email)
    .replace("{{plano}}", data.formData.planoSelecionado.nome)
    .replace("{{pagm}}", data.formData.formPagto)
    .replace("{{vmr}}", data.formData.valorReparo)
    .replace("{{vmr1}}", data.formData.valorReparo)
    .replace("{{dataGarantia}}", data.formData.DataGarantia)
    .replace("{{dataAssistencia}}", data.formData.DataAssistencia)
    .replace("{{Data_assinatura}}", data.formData.DataAtual)
    .replace("{{Nome}}", data.formData.fullName)
    .replace("{{razaoSocial}}", data.formData.razaoSocialRevenda)
    .replace("{{razaoSocial1}}", data.formData.razaoSocialRevenda)
    .replace("{{cnpjRevenda}}", data.formData.cnpjRevenda)
    .replace("{{nomeConsultor}}", data.formData.nomeConsultor)
    .replace("{{cpfConsultor}}", data.formData.cpfConsultor)
    .replace("{{emailConsultor}}", data.formData.emailConsultor)

  return updatedHTML; // Retorna o HTML atualizado
}

const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");

function generateContrato(data) {
  const templatePath = path.join(
    __dirname,
    "../templates/doc-model-12-meses-garantia.docx"
  ); // Caminho para o arquivo local

  try {
    const content = fs.readFileSync(templatePath); // Lê o arquivo .docx como um buffer
    const zip = new PizZip(content); // Carrega o arquivo como ZIP
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    doc.setData(data); // Substitui os placeholders no documento

    doc.render(); // Renderiza o documento
    const buffer = doc.getZip().generate({ type: "nodebuffer" }); // Gera o arquivo como buffer

    // Retorna o buffer para salvar ou enviar ao cliente
    return buffer;
  } catch (error) {
    console.error("Erro ao renderizar o documento:", error);
    throw error; // Propaga o erro para ser tratado no controller
  }
}

module.exports = { generateHTML, generatePDF, generateContrato };
