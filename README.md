# Escala Escolar

Sistema web desenvolvido para facilitar a consulta das escalas de funcionários da **Escola Estadual Eusébio de Paula Marcondes**.

O projeto oferece uma interface simples e intuitiva para que os funcionários consultem seus horários e atividades, com visualização diária ou semanal.

## Funcionalidades

* **Consulta diária:** permite consultar a escala de um dia específico.
* **Consulta semanal:** exibe as escalas de segunda a sexta-feira.
* **Busca por funcionário:** permite localizar funcionários pelo nome, sem diferenciar letras maiúsculas e minúsculas.
* **Visualização de horários:** apresenta os horários de entrada, saída e retorno, quando aplicável.
* **Visualização de atividades:** exibe as atividades vinculadas a cada escala.
* **Tratamento de erros:** apresenta mensagens para consultas inválidas e situações sem escalas cadastradas.

## Tecnologias utilizadas

* [React](https://react.dev/)
* [Vite](https://vite.dev/)
* [Google Apps Script](https://developers.google.com/apps-script)
* [Supabase](https://supabase.com/)
* JavaScript
* CSS

## Arquitetura

O projeto utiliza uma arquitetura separada em frontend, backend e banco de dados.

* **Frontend:** desenvolvido com React e Vite, responsável pela interface de consulta.
* **Backend:** Google Apps Script, responsável por receber as requisições e consultar os dados.
* **Banco de dados:** Supabase, utilizado para armazenar funcionários, escalas e atividades.

## Como executar localmente

### Pré-requisitos

* Node.js
* npm
* URL de uma implantação do Google Apps Script configurada para o sistema.

### Instalação

Clone o repositório:

```bash
git clone https://github.com/SEU-USUARIO/escala-escolar-usuario.git
```

Acesse a pasta:

```bash
cd escala-escolar-usuario
```

Instale as dependências:

```bash
npm install
```

### Configuração

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=SUA_URL_DO_GOOGLE_APPS_SCRIPT
```

Substitua o valor pela URL da implantação do Google Apps Script.

**Importante:** não armazene chaves privadas ou credenciais administrativas no frontend. Variáveis com prefixo `VITE_` ficam acessíveis no código entregue ao navegador.

### Executar

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

O Vite exibirá o endereço local para acessar a aplicação.

### Gerar versão de produção

```bash
npm run build
```

Os arquivos de produção serão gerados na pasta `dist`.

## Estrutura do projeto

```text
escala-escolar-usuario/
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   │   └── api.js
│   ├── App.jsx
│   └── main.jsx
├── .env
├── .gitignore
├── index.html
├── package.json
└── vite.config.js
```

A estrutura pode variar conforme a organização atual do projeto.

## Próximas etapas

* Desenvolver o frontend administrativo destinado à direção escolar.
* Implementar o gerenciamento de funcionários e escalas.
* Integrar os módulos administrativo e de consulta com controle de acesso.
* Ampliar os recursos de relatórios e acompanhamento.

## Status

**Frontend de consulta:** desenvolvido e testado nos cenários de consulta diária e semanal.

O sistema administrativo será desenvolvido separadamente.

## Autoria

Projeto desenvolvido como solução de apoio à organização e consulta de escalas de funcionários escolares.
