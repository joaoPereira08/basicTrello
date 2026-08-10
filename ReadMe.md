

📝 Documentação do Projeto: Mini-Trello 

1. Visão Geral do Projeto

Uma aplicação web estilo Kanban (Trello) onde o utilizador pode criar Quadros
(Boards), adicionar Listas (Colunas como "A Fazer", "Em Progresso", "Concluído")
e criar Cartões (Cards/Tarefas) dentro dessas listas.

Objetivo de Aprendizagem: Perceber a fundo os verbos HTTP (GET, POST, PUT,
PATCH, DELETE) comunicando um frontend em Vue/Nuxt com uma API em
Python/FastAPI.

2. Arquitetura da Stack

  - Base de Dados: PostgreSQL (A correr localmente na porta 5432).
  - Backend: FastAPI + SQLAlchemy (ORM) (A correr na porta 8000).
  - Frontend: Nuxt 3 gerido pelo Bun (A correr na porta 3000).

3. Modelação da Base de Dados (PostgreSQL)
 
Para um clone do Trello, precisamos de 3 tabelas principais. Vamos focar-nos
nelas para manter tudo simples (sem sistema de login por enquanto).

1.  Board (Quadro)
      - id: UUID ou Integer (Chave Primária)
      - title: String (Ex: "Projeto de Estudos")
      - created_at: DateTime
2.  List (Coluna/Lista)
      - id: UUID ou Integer (Chave Primária)
      - title: String (Ex: "A Fazer")
      - board_id: Relacionamento (Chave Estrangeira -> Board)
      - position: Integer (Para saber a ordem das colunas)
3.  Card (Cartão/Tarefa)
      - id: UUID ou Integer (Chave Primária)
      - title: String (Ex: "Criar base de dados")
      - description: Text
      - list_id: Relacionamento (Chave Estrangeira -> List)
      - position: Integer (Para saber a ordem dos cartões na coluna)

4. Design da API (A perceber os Pedidos/Requests HTTP)

O FastAPI vai gerar uma documentação automática (Swagger) para poderes testar
isto. Aqui está como usaremos cada verbo HTTP, focado na entidade Card como
exemplo:

  - POST /cards/ (CRIAR)
      - Uso: Quando clicas em "Adicionar novo cartão".
      - O que faz: Envia dados (título, list_id) no corpo (Body) do pedido para
        guardar na base de dados.
  - GET /boards/{board_id}/cards/ (LER)
      - Uso: Quando abres a página do quadro.
      - O que faz: Pede ao servidor para devolver a lista de todos os cartões
        daquele quadro.
  - GET /cards/{card_id} (LER APENAS UM)
      - Uso: Quando clicas num cartão para abrir os detalhes do mesmo.
  - PUT /cards/{card_id} (ATUALIZAR TUDO)
      - Uso: Quando editas o cartão inteiro (título, descrição, etc.) e envias o
        objeto completo para substituir o antigo.
  - PATCH /cards/{card_id} (ATUALIZAR PARCIALMENTE)
      - Uso: Muito usado no Trello! Quando arrastas um cartão de "A Fazer" para
        "Em Progresso", só queres atualizar o list_id dele, sem mexer no resto.
        O PATCH serve para isto: atualizações parciais.
  - DELETE /cards/{card_id} (ELIMINAR/APAGAR)
      - Uso: Quando apagas um cartão.

5. Estrutura do Frontend (Nuxt 3)

O Nuxt trabalha com encaminhamento (routing) baseado em ficheiros.

  - Páginas (Pages):
      - pages/index.vue: Ecrã inicial a listar todos os teus Quadros (Boards).
      - pages/board/[id].vue: O ecrã do Kanban em si, onde as listas e os
        cartões aparecem.
  - Componentes (Components):
      - components/BoardCard.vue: O quadradinho no ecrã inicial.
      - components/KanbanList.vue: A coluna cinzenta.
      - components/KanbanTask.vue: O cartãozinho branco que se pode arrastar.

6. Plano de Ação (Como começar a programar)

Não tentes fazer tudo de uma vez. Segue este passo a passo:

Fase 1: O Alicerce (Base de Dados e Backend)

1.  Instala o PostgreSQL e cria uma base de dados vazia chamada minitrello.
2.  Cria uma pasta para o backend (mkdir backend), inicia um ambiente virtual
    Python (python -m venv venv) e instala o FastAPI, Uvicorn e SQLAlchemy.
3.  Cria a ligação com a base de dados.

Fase 2: O CRUD (FastAPI)

1.  Cria os "Models" (as classes em Python que representam as tuas tabelas na
    base de dados).
2.  Cria as rotas (Endpoints) para os Boards primeiro (GET, POST, DELETE).
3.  Testa essas rotas no browser acedendo a http://localhost:8000/docs (O
    FastAPI gera este ecrã excelente de testes automaticamente).
4.  Faz o mesmo para as Lists e Cards.

Fase 3: A Interface (Nuxt 3)

1.  Cria o projeto frontend com o Bun: bunx nuxi@latest init frontend.
2.  Instala o TailwindCSS (vai ajudar-te imenso a desenhar os cartões e as
    colunas rapidamente).
3.  Cria a página inicial (estática por agora, sem ligar à API).
4.  Cria a página do Quadro (desenha as colunas e os cartões falsos (mock data),
    apenas com HTML/CSS).

Fase 4: A Integração

1.  Usa o useFetch do Nuxt para chamar a tua API FastAPI.
2.  Substitui os dados falsos do frontend pelos dados que vêm da tua base de
    dados (GET).
3.  Põe os botões de "Criar" a funcionar (POST).
4.  Põe o botão de eliminar a funcionar (DELETE).
5.  Desafio final: Fazer um cartão mudar de coluna atualizando o list_id do
    mesmo (PATCH).


Com certeza! É fundamental teres o ambiente bem configurado e perceberes como as
peças encaixam antes de começares a escrever código.

Aqui tens o guia de preparação e a arquitetura do projeto (em PT-PT).

1. Ambiente de Desenvolvimento (O que tens de instalar no PC)

Para que tudo funcione corretamente, precisas de ter estas ferramentas
instaladas na tua máquina:

Essenciais:

1.  Editor de Código: Visual Studio Code (VS Code). É o padrão da indústria.
      - Extensões recomendadas no VS Code: Vue - Official (para o Nuxt), Python,
        e Thunder Client (para testar APIs dentro do editor, se quiseres).
2.  Para o Frontend: Bun. Como pediste, vamos usar o Bun em vez do NPM/Node. O
    Bun é um runtime e gestor de pacotes extremamente rápido.
      - Nota: Para instalar o Bun no Windows, convém teres o WSL (Windows
        Subsystem for Linux) instalado, ou usar o comando PowerShell recomendado
        no site deles. No Mac/Linux é só correr o script do site.
3.  Para o Backend: Python (versão 3.10 ou superior). Durante a instalação (se
    estiveres no Windows), não te esqueças de marcar a caixa "Add Python to
    PATH".
4.  Para a Base de Dados: PostgreSQL. Podes instalar diretamente no teu sistema
    operativo. Durante a instalação, ele vai pedir-te para criar uma password
    para o utilizador postgres. Guarda bem essa password, vais precisar dela
    para ligar o teu backend!

Ferramenta Extra (Muito recomendada):

  - DBeaver ou pgAdmin: São programas com interface gráfica para veres a tua
    base de dados PostgreSQL. Em vez de usares a linha de comandos, podes ver as
    tuas tabelas, linhas e colunas tal como verias num ficheiro Excel. O DBeaver
    Community é excelente.

2. A Arquitetura do Sistema (Como tudo comunica)

A tua aplicação vai funcionar em 3 camadas separadas. É assim que elas "falam"
umas com as outras:

1.  O Nuxt (Frontend) pede os dados ao backend (ex: "Dá-me os cartões do
    Quadro 1").
2.  O FastAPI (Backend) recebe o pedido, processa, e traduz isso para SQL.
3.  O PostgreSQL devolve os dados gravados ao FastAPI.
4.  O FastAPI converte esses dados para JSON e envia para o Nuxt.
5.  O Nuxt desenha os cartões no teu ecrã.


Direção visual (para não ficar "genérico")

Em vez do clássico fundo cinza-claro + cartões brancos genéricos que a maioria dos clones de Trello têm, sugiro:

Paleta: fundo slate-950/quase-preto para o quadro, colunas em slate-900 com contorno subtil, cartões em slate-800 com hover a clarear ligeiramente. Um único accent color por quadro (ex: indigo-500) usado só em pontos de ação (botão "+", badge de contagem) — não espalhado por todo o lado.
Tipografia: título dos quadros/cartões num peso mais forte (font-semibold), texto secundário (descrição, contagem de cards) mais pequeno e text-slate-400 — cria hierarquia clara sem precisares de cores extra.
Elemento de assinatura: em vez de uma barra colorida genérica no topo de cada coluna (como o Trello faz), experimenta um contador de cards discreto ao lado do título da lista (À Fazer  3) e uma barra de progresso fininha no rodapé de cada Board na página inicial (ex: "2/5 listas com cards") — dá uma sensação mais "GitHub Projects" (orientado a estado/progresso) do que "Trello" (orientado a cor).