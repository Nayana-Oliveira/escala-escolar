const API_URL = import.meta.env.VITE_API_URL?.trim();

function validarAPI() {
  if (!API_URL) {
    throw new Error("A URL da API não foi configurada.");
  }
}

async function lerResposta(response) {
  const texto = await response.text();

  let dados;

  try {
    dados = JSON.parse(texto);
  } catch {
    throw new Error(
      "O Apps Script não retornou um JSON válido. Verifique a implantação da API.",
    );
  }

  if (!response.ok) {
    throw new Error(
      dados.mensagem || dados.message || `Erro HTTP ${response.status}.`,
    );
  }

  return dados;
}

export async function consultarEscala(nome, dia) {
  validarAPI();

  try {
    const url = new URL(API_URL);
    url.searchParams.set("acao", "consulta");
    url.searchParams.set("nome", nome);
    url.searchParams.set("dia", dia);

    const response = await fetch(url.toString());
    const dados = await lerResposta(response);

    if (dados.sucesso === false) {
      throw new Error(dados.mensagem || "Não foi possível consultar a escala.");
    }

    return dados;
  } catch (error) {
    console.error("Erro na consulta da escala:", error);
    throw error;
  }
}

export async function consultarOcorrencias(nome, codigo) {
  validarAPI();

  if (!/^\d{3}$/.test(String(codigo))) {
    throw new Error("Digite os três primeiros dígitos do seu CPF.");
  }

  const resposta = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    body: JSON.stringify({
      acao: "ocorrencias",
      nome: nome.trim(),
      codigo: String(codigo),
    }),
  });

  return lerResposta(resposta);
}
