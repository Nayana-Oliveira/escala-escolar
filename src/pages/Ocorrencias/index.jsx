import { useState } from "react";
import "./index.css";
import { consultarOcorrencias as buscarOcorrenciasAPI } from "../../services/api";

function formatarData(data) {
  if (!data) return "Data não informada";

  const partes = data.split("T")[0].split("-");

  if (partes.length !== 3) return data;

  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function CartaoOcorrencia({ ocorrencia }) {
  const atividade = ocorrencia.atividade;

  return (
    <article className="ocorrencia-card">
      <div className="ocorrencia-header">
        <span className="ocorrencia-data">{formatarData(ocorrencia.data)}</span>

        <span className="ocorrencia-horario">
          {ocorrencia.horario || "Horário não informado"}
        </span>
      </div>

      <div className="ocorrencia-conteudo">
        <h3>Descrição da ocorrência</h3>
        <p>{ocorrencia.descricao || "Sem descrição."}</p>
      </div>

      {atividade && (
        <div className="ocorrencia-atividade">
          <h3>Atividade relacionada</h3>

          <p>{atividade.descricao || "Sem descrição da atividade."}</p>

          {atividade.inicio && atividade.fim && (
            <span>
              Horário da atividade: {atividade.inicio} - {atividade.fim}
            </span>
          )}
        </div>
      )}
    </article>
  );
}

export default function Ocorrencias() {
  const [nome, setNome] = useState("");
  const [codigo, setCodigo] = useState("");
  const [ocorrencias, setOcorrencias] = useState([]);
  const [dataInicial, setDataInicial] = useState("");
  const [dataFinal, setDataFinal] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [consultou, setConsultou] = useState(false);
  const [erro, setErro] = useState("");

  async function handleConsultar(event) {
    event.preventDefault();

    if (!nome.trim()) {
      setErro("Informe seu nome completo.");
      setOcorrencias([]);
      setConsultou(false);
      return;
    }

    if (!/^\d{6}$/.test(codigo)) {
      setErro("Digite seu código de acesso de 6 dígitos.");
      setOcorrencias([]);
      setConsultou(false);
      return;
    }

    setCarregando(true);
    setErro("");
    setConsultou(false);
    setOcorrencias([]);
    setDataInicial("");
    setDataFinal("");

    try {
      const dados = await buscarOcorrenciasAPI(nome.trim(), codigo);

      if (dados?.sucesso === false) {
        setErro(dados.mensagem || "Nome ou código inválido.");
        return;
      }

      const lista = Array.isArray(dados) ? dados : dados?.ocorrencias;

      if (!Array.isArray(lista)) {
        throw new Error("Resposta inesperada do servidor.");
      }

      setOcorrencias(lista);
      setConsultou(true);
      setCodigo("");
    } catch (error) {
      setErro(error.message || "Não foi possível consultar as ocorrências.");
    } finally {
      setCarregando(false);
    }
  }

  const periodoInvalido = dataInicial && dataFinal && dataInicial > dataFinal;

  const ocorrenciasFiltradas = ocorrencias.filter((ocorrencia) => {
    if (!ocorrencia.data || periodoInvalido) {
      return false;
    }

    const dataOcorrencia = ocorrencia.data.split("T")[0];

    if (dataInicial && dataOcorrencia < dataInicial) {
      return false;
    }

    if (dataFinal && dataOcorrencia > dataFinal) {
      return false;
    }

    return true;
  });

  function limparFiltros() {
    setDataInicial("");
    setDataFinal("");
  }

  return (
    <main className="ocorrencias-container">
      <section className="ocorrencias-content">
        <div className="ocorrencias-intro">
          <span className="ocorrencias-label">CONSULTA</span>
          <h1>Minhas ocorrências</h1>
          <p>Consulte os registros associados ao seu cadastro.</p>
        </div>

        <form className="ocorrencias-form" onSubmit={handleConsultar}>
          <div className="ocorrencias-form-group">
            <label htmlFor="nome">Nome completo</label>

            <input
              id="nome"
              type="text"
              value={nome}
              onChange={(event) => setNome(event.target.value)}
              placeholder="Digite seu nome completo"
              autoComplete="name"
              required
            />
          </div>

          <div className="ocorrencias-form-group">
            <label htmlFor="codigo">Código de acesso</label>

            <input
              id="codigo"
              type="password"
              inputMode="numeric"
              pattern="[0-9]{6}"
              maxLength={6}
              value={codigo}
              onChange={(event) =>
                setCodigo(event.target.value.replace(/\D/g, ""))
              }
              placeholder="Digite seu código de 6 dígitos"
              autoComplete="off"
              required
            />
          </div>

          <button type="submit" disabled={carregando}>
            {carregando ? "Consultando..." : "Consultar ocorrências"}
          </button>
        </form>

        {erro && (
          <div className="ocorrencias-mensagem erro" role="alert">
            {erro}
          </div>
        )}

        {consultou && (
          <section className="ocorrencias-resultados">
            <div className="ocorrencias-resultados-header">
              <div>
                <h2>Resultado da consulta</h2>
                <p>
                  {ocorrencias.length === 1
                    ? "1 ocorrência encontrada no total"
                    : `${ocorrencias.length} ocorrências encontradas no total`}
                </p>
              </div>
            </div>

            <div className="ocorrencias-filtros">
              <div className="ocorrencias-filtros-titulo">
                <div>
                  <h3>Filtrar por período</h3>
                  <p>Selecione as datas para restringir os resultados.</p>
                </div>

                <button
                  type="button"
                  className="limpar-filtros"
                  onClick={limparFiltros}
                  disabled={!dataInicial && !dataFinal}
                >
                  Limpar filtros
                </button>
              </div>

              <div className="ocorrencias-filtros-campos">
                <div className="ocorrencias-form-group">
                  <label htmlFor="dataInicial">Data inicial</label>

                  <input
                    id="dataInicial"
                    type="date"
                    value={dataInicial}
                    onChange={(event) => setDataInicial(event.target.value)}
                  />
                </div>

                <div className="ocorrencias-form-group">
                  <label htmlFor="dataFinal">Data final</label>

                  <input
                    id="dataFinal"
                    type="date"
                    value={dataFinal}
                    onChange={(event) => setDataFinal(event.target.value)}
                  />
                </div>
              </div>

              {periodoInvalido && (
                <p className="filtro-erro">
                  A data inicial não pode ser posterior à data final.
                </p>
              )}
            </div>

            <div className="ocorrencias-contagem">
              {periodoInvalido
                ? "Período inválido"
                : ocorrenciasFiltradas.length === 1
                  ? "1 ocorrência neste período"
                  : `${ocorrenciasFiltradas.length} ocorrências neste período`}
            </div>

            {ocorrenciasFiltradas.length > 0 ? (
              <div className="ocorrencias-lista">
                {ocorrenciasFiltradas.map((ocorrencia) => (
                  <CartaoOcorrencia
                    key={ocorrencia.id}
                    ocorrencia={ocorrencia}
                  />
                ))}
              </div>
            ) : (
              <div className="ocorrencias-vazio">
                <h3>
                  {periodoInvalido
                    ? "Período inválido"
                    : "Nenhuma ocorrência encontrada"}
                </h3>

                <p>
                  {periodoInvalido
                    ? "Revise as datas selecionadas."
                    : "Não há registros para o período selecionado."}
                </p>
              </div>
            )}
          </section>
        )}
      </section>
    </main>
  );
}
