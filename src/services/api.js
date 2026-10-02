const API_URL = import.meta.env.VITE_API_URL;

export async function consultarEscala(nome, dia) {
  if (!API_URL) {
    throw new Error("A URL da API não foi configurada.");
  }

  try {
    const url = `${API_URL}?acao=consulta&nome=${encodeURIComponent(nome)}&dia=${encodeURIComponent(dia)}`;

    const response = await fetch(url);
    const texto = await response.text();

    let dados;

    try {
      dados = JSON.parse(texto);
    } catch {
      throw new Error("O Apps Script não retornou um JSON válido: " + texto);
    }

    if (!response.ok) {
      throw new Error(
        dados.mensagem || `Erro HTTP ${response.status}`
      );
    }

    return dados;
  } catch (error) {
    console.error("Erro na consulta:", error);
    throw error;
  }
}

export async function consultarOcorrencias(nome, codigo) {
  if (!API_URL) {
    throw new Error("A URL da API não foi configurada.");
  }

  const resposta = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    body: JSON.stringify({
      acao: "ocorrencias",
      nome,
      codigo,
    }),
  });

  if (!resposta.ok) {
    throw new Error("Erro ao consultar ocorrências.");
  }

  return resposta.json();
}
