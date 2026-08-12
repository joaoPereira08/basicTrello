# Basic Trello

Uma aplicação web estilo **Kanban/Trello**, desenvolvida como projeto de aprendizagem para explorar **Bun, Nuxt 3, FastAPI, SQLAlchemy e PostgreSQL**.

O principal objetivo é perceber como funciona a comunicação entre **Frontend → API → Base de Dados**, enquanto se pratica CRUD e os diferentes métodos HTTP.

---

## Stack

| Parte    | Tecnologia       |
| -------- | ---------------- |
| Frontend | Nuxt 3 / Vue     |
| Runtime  | Bun              |
| Backend  | FastAPI / Python |
| ORM      | SQLAlchemy       |
| Database | PostgreSQL       |
| Styling  | Tailwind CSS     |

---

##  Arquitetura

```text
┌─────────────┐
│   Nuxt 3    │
│  Frontend   │
└──────┬──────┘
       │ HTTP / JSON
       ▼
┌─────────────┐
│   FastAPI   │
│   Backend   │
└──────┬──────┘
       │ SQLAlchemy
       ▼
┌─────────────┐
│ PostgreSQL  │
└─────────────┘
```

---

## Modelo

A aplicação tem três entidades principais:

```text
Board
  │
  ├── List
  │     ├── Card
  │     ├── Card
  │     └── Card
  │
  └── List
        └── Card
```

### Board

* `id`
* `title`
* `created_at`

### List

* `id`
* `title`
* `board_id`
* `position`

### Card

* `id`
* `title`
* `description`
* `list_id`
* `position`

---

## API

O projeto pretende utilizar os principais métodos HTTP:

| Método   | Utilização                           |
| -------- | ------------------------------------ |
| `GET`    | Obter Boards, Lists e Cards          |
| `POST`   | Criar recursos                       |
| `PUT`    | Atualizar um recurso completo        |
| `PATCH`  | Atualizar apenas parte de um recurso |
| `DELETE` | Eliminar recursos                    |

Um dos objetivos principais é perceber a diferença entre **PUT e PATCH**.

Por exemplo, ao mover um Card para outra List:

```http
PATCH /cards/{card_id}
```

```json
{
  "list_id": 2
}
```

---

## Frontend

Estrutura inicial:

```text
frontend/
├── pages/
│   ├── index.vue
│   └── board/
│       └── [id].vue
│
└── components/
    ├── board-card.vue
    ├── list-column.vue
    └── task-card.vue
```

* `index.vue` → lista de Boards
* `[id].vue` → página da Board
* `board-card.vue` → representação de um Board
* `list-column.vue` → coluna de uma Lista
* `task-card.vue` → Card/Tarefa

---

##  Design

A interface seguirá uma estética **minimalista**:


A inspiração visual será mais próxima de **GitHub Projects e Trello**.

---

##  Roadmap

### 1. Backend

* [X] Configurar PostgreSQL
* [X] Criar Models com SQLAlchemy
* [x] Criar CRUD de Boards
* [X] Criar CRUD de Lists
* [x] Criar CRUD de Cards
* [x] Testes

### 2. Frontend

* [X] Criar projeto Nuxt
* [x] Criar interface das Boards
* [x] Criar Lists e Cards
* [X] Adicionar Tailwind CSS

### 3. Integração

* [X] Ligar Nuxt à API
* [x] Implementar `GET`
* [x] Implementar `POST`
* [x] Implementar `PUT`
* [x] Implementar `PATCH`
* [x] Implementar `DELETE`
* [x] Implementar Drag & Drop

---

## Objetivo

No final, o projeto deverá permitir compreender o fluxo completo:

```text
Utilizador
    ↓
Nuxt / Vue
    ↓
HTTP Request
    ↓
FastAPI
    ↓
SQLAlchemy
    ↓
PostgreSQL
    ↓
FastAPI
    ↓
JSON Response
    ↓
Nuxt
```

