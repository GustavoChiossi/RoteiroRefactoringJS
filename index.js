const { readFileSync } = require('fs');

function gerarFaturaStr(fatura, pecas) {

  // funcao query
  function getPeca(apresentacao) {
    return pecas[apresentacao.id];
  }
  
  // funcao extraida
  // remocao do parametro peca, uso de getPeca(apre)
  function calcularTotalApresentacao(apre) {
    let total = 0;

    switch (getPeca(apre).tipo) {
      case "tragedia":
        total = 40000;
        if (apre.audiencia > 30) {
          total += 1000 * (apre.audiencia - 30);
        }
        break;

      case "comedia":
        total = 30000;
        if (apre.audiencia > 20) {
          total += 10000 + 500 * (apre.audiencia - 20);
        }
        total += 300 * apre.audiencia;
        break;

      default:
        throw new Error(`Peça desconhecia: ${getPeca(apre).tipo}`);
    }

    return total;
  }

  let totalFatura = 0;
  let creditos = 0;
  let faturaStr = `Fatura ${fatura.cliente}\n`;

  const formato = new Intl.NumberFormat("pt-BR",{ style: "currency", currency: "BRL", minimumFractionDigits: 2}).format;

  for (let apre of fatura.apresentacoes) {
    //const peca = pecas[apre.id];

    // o switch que estava aqui foi extraido p funcao acima
    let total = calcularTotalApresentacao(apre); // substituicao de peca por getPeca(apre) -> apenas um parametro de chaamda
    
    // creditos para proximas contratacoes
    creditos += Math.max(apre.audiencia - 30, 0);

    if (getPeca(apre).tipo === "comedia") {
      creditos += Math.floor(apre.audiencia / 5);
    }
    
    // mais uma linha da fatura
    faturaStr += `  ${getPeca(apre).nome}: ${formato(total / 100)} (${apre.audiencia} assentos)\n`;
    totalFatura += total;
  }

  faturaStr += `Valor total: ${formato(totalFatura / 100)}\n`;
  faturaStr += `Créditos acumulados: ${creditos} \n`;

  return faturaStr;
}

const faturas = JSON.parse(readFileSync('./faturas.json'));
const pecas = JSON.parse(readFileSync('./pecas.json'));

const faturaStr = gerarFaturaStr(faturas, pecas);

console.log(faturaStr);