# Projeto Fullstack: Quarkus & React

Este projeto é uma aplicação fullstack moderna que utiliza **Quarkus** para o backend e **React (Vite)** para o frontend, com um banco de dados **PostgreSQL**. O ambiente de desenvolvimento é totalmente conteinerizado usando Docker Compose.

## 🚀 Tecnologias

### Backend

- **Java**: Linguagem principal.
- **Quarkus**: Framework Java Supersônico e Subatômico.
- **PostgreSQL**: Banco de dados relacional.
- **Hibernate ORM / Panache**: Camada de persistência de dados.

### Frontend

- **React**: Biblioteca para construção de interfaces.
- **Vite**: Build tool rápida e leve.
- **TypeScript**: Superset JavaScript tipado.
- **Tailwind CSS**: Framework de CSS utilitário.
- **Shadcn/UI**: Componentes de interface reutilizáveis.
- **TanStack Router**: Roteamento para SPAs.
- **TanStack Query**: Gerenciamento de estado assíncrono.

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/)
- [Make](https://www.gnu.org/software/make/) (Opcional, mas recomendado para facilitar o uso dos comandos)

## 🛠️ Como Rodar o Projeto

A maneira mais fácil de iniciar o ambiente de desenvolvimento é utilizando o `Makefile` incluído na raiz do projeto.

### 1. Iniciar o Ambiente

Execute o comando abaixo para subir os containers do Backend, Frontend e Banco de Dados:

```bash
make dev
```

Isso irá:

- Construir as imagens Docker do backend e frontend (se necessário).
- Iniciar o banco de dados PostgreSQL.
- Iniciar o backend Quarkus na porta `8080`.
- Iniciar o frontend Vite na porta `5173`.

### 2. Acessar a Aplicação

Após os containers iniciarem, você pode acessar:

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:8080](http://localhost:8080)
- **Swagger UI** (Documentação da API): [http://localhost:8080/q/swagger-ui](http://localhost:8080/q/swagger-ui) (Disponível no modo dev do Quarkus)

### 3. Parar o Ambiente

Para parar e remover os containers:

```bash
make dev-down
```

### 4. Visualizar Logs

Para acompanhar os logs dos containers em tempo real:

```bash
make dev-logs
```

## 📂 Estrutura do Projeto

- **/backend**: Código fonte da API em Java/Quarkus.
- **/frontend**: Código fonte da interface em React/Vite.
- **docker-compose.dev.yml**: Definição dos serviços para desenvolvimento (Hot Reload ativado conforme configuração).
- **makefile**: Atalhos para comandos Docker comuns.

## 🔧 Outros Comandos Úteis

| Comando      | Descrição                                                                |
| ------------ | ------------------------------------------------------------------------ |
| `make clean` | Remove containers, redes e volumes não utilizados (Docker system prune). |

## 📝 Desenvolvimento

- **Backend**: O Quarkus roda em modo dev dentro do container, permitindo _Live Coding_. Alterações no código Java são refletidas automaticamente.
- **Frontend**: O Vite também suporta _Hot Module Replacement (HMR)_. Alterações nos arquivos do frontend atualizam o navegador instantaneamente.
