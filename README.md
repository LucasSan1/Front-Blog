# Projeto Blog - Frontend em React + Vite

## Descrição

Este é o **frontend** do Projeto Blog, desenvolvido com **React** e **Vite**. Ele consome a API criada em Spring Boot (Java 17) e permite ao usuário visualizar posts, criar posts (quando autenticado), comentar, editar e deletar seus próprios conteúdos.

---

## Funcionalidades

* **Listagem de Posts:** Exibe todos os posts do blog.
* **Autenticação:** Login e registro de usuários utilizando JWT da API.
* **Criação de Posts:** Usuários autenticados podem criar posts com título, conteúdo e Imagens.
* **Comentários:** Usuários autenticados podem comentar nos posts.
* **Edição e Deleção:** O usuário pode editar e deletar **somente seus próprios** posts e comentários.

---

## ️ Tecnologias Utilizadas

* **React**
* **Vite**
* **Axios**
* **Tailwind CSS**
* **Sweetalert2** 

---

## Passos para rodar o projeto

### 1. Clone o repositório

```bash
git clone https://github.com/LucasSan1/Front-Blog.git
cd Front-Blog
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure a URL da API

Edite o arquivo de serviço:

```javascript
import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8080", // Colocar o link de sua api
});
```

## 4. Executando o projeto

Rode o projeto com: 

```bash
npm run dev
```

Acesse em:

```
http://localhost:5173
```


