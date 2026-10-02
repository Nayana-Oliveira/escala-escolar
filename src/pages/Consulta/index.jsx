import { useState } from "react";
import "./index.css";
import { consultarEscala as buscarEscalaAPI } from "../../services/api";

const dias = [
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
];

function formatarHorario(horario) {
  if (!horario) return "--:--";
  return horario.slice(0, 5);
}

function CartaoEscala({ escala }) {
  return (
    <div className="escala-item">
      <div className="horario-resumo">
        <span>Período: {escala.periodo}</span>

        <strong>
          {formatarHorario(escala.entrada)} às {formatarHorario(escala.saida)}
        </strong>

        {escala.retorno && escala.saida2 && (
          <p>
            Retorno: {formatarHorario(escala.retorno)}
            {" — "}
            Saída: {formatarHorario(escala.saida2)}
          </p>
        )}
      </div>

      <h3>Atividades</h3>

      <div className="atividades-lista">
        {(escala.atividades || []).map((atividade) => (
          <article className="atividade" key={atividade.id}>
            <div className="atividade-horario">
              {formatarHorario(atividade.inicio)}
              {" - "}
              {formatarHorario(atividade.fim)}
            </div>

            <div className="atividade-info">
              <h4>{atividade.descricao}</h4>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function Consulta() {
  const [nome, setNome] = useState("");
  const [dia, setDia] = useState("Segunda-feira");
  const [modo, setModo] = useState("dia");
  const [resultado, setResultado] = useState(null);
  const [resultadoSemana, setResultadoSemana] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  async function buscarFuncionario(event) {
    event.preventDefault();

    if (!nome.trim()) {
      setErro("Digite o nome do funcionário.");
      setResultado(null);
      setResultadoSemana([]);
      return;
    }

    setCarregando(true);
    setErro("");
    setResultado(null);
    setResultadoSemana([]);

    try {
      if (modo === "dia") {
        const resposta = await buscarEscalaAPI(nome.trim(), dia);

        if (!resposta.sucesso || !resposta.funcionario) {
          setErro(
            resposta.mensagem ||
              "Funcionário não encontrado. Confira o nome digitado.",
          );
          return;
        }

        setResultado({
          ...resposta,
          dia,
        });
      } else {
        const respostas = await Promise.all(
          dias.map((diaSemana) => buscarEscalaAPI(nome.trim(), diaSemana)),
        );

        const respostaInvalida = respostas.find(
          (resposta) => !resposta.sucesso || !resposta.funcionario,
        );

        if (respostaInvalida) {
          setErro(
            respostaInvalida.mensagem ||
              "Funcionário não encontrado. Confira o nome digitado.",
          );
          return;
        }

        setResultadoSemana(
          dias.map((diaSemana, index) => ({
            dia: diaSemana,
            escalas: respostas[index].escalas || [],
          })),
        );

        setResultado({
          funcionario: respostas[0].funcionario,
        });
      }
    } catch (error) {
      console.error(error);

      setErro(
        "Erro ao consultar a escala. Verifique a conexão e tente novamente.",
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="consulta-container">
      <section className="consulta-content">
        <form className="consulta-card" onSubmit={buscarFuncionario}>
          <h2>Consultar escala</h2>

          <p className="card-description">
            Informe seu nome e escolha como deseja visualizar seus horários.
          </p>

          <div className="form-group">
            <label htmlFor="nome">Nome do funcionário</label>

            <input
              id="nome"
              type="text"
              placeholder="Digite seu nome completo"
              value={nome}
              onChange={(event) => setNome(event.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Visualização</label>

            <div className="modo-consulta">
              <button
                type="button"
                className={modo === "dia" ? "modo-ativo" : ""}
                onClick={() => setModo("dia")}
              >
                Escala do dia
              </button>

              <button
                type="button"
                className={modo === "semana" ? "modo-ativo" : ""}
                onClick={() => setModo("semana")}
              >
                Semana completa
              </button>
            </div>
          </div>

          {modo === "dia" && (
            <div className="form-group">
              <label htmlFor="dia">Dia da semana</label>

              <select
                id="dia"
                value={dia}
                onChange={(event) => setDia(event.target.value)}
              >
                {dias.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button type="submit" disabled={carregando}>
            {carregando ? "Consultando..." : "Consultar escala"}
          </button>
        </form>

        {erro && <div className="mensagem">{erro}</div>}

        {resultado?.funcionario && modo === "dia" && (
          <section className="resultado">
            <div className="resultado-header">
              <div>
                <span className="resultado-label">Funcionário</span>

                <h2>{resultado.funcionario.nome}</h2>

                <p>{resultado.dia}</p>
              </div>
            </div>

            {(resultado.escalas || []).length === 0 ? (
              <p className="mensagem">
                Não há escala cadastrada para esse funcionário nesse dia.
              </p>
            ) : (
              resultado.escalas.map((escala) => (
                <CartaoEscala key={escala.id} escala={escala} />
              ))
            )}
          </section>
        )}

        {resultado?.funcionario && modo === "semana" && (
          <section className="resultado">
            <div className="resultado-header">
              <div>
                <span className="resultado-label">Funcionário</span>

                <h2>{resultado.funcionario.nome}</h2>

                <p>Escala semanal</p>
              </div>
            </div>

            {resultadoSemana.map((item) => (
              <section className="dia-semana" key={item.dia}>
                <h3 className="dia-semana-titulo">{item.dia}</h3>

                {item.escalas.length === 0 ? (
                  <p className="dia-sem-escala">Nenhuma escala cadastrada.</p>
                ) : (
                  item.escalas.map((escala) => (
                    <CartaoEscala key={escala.id} escala={escala} />
                  ))
                )}
              </section>
            ))}
          </section>
        )}
      </section>
    </main>
  );
}

export default Consulta;
