# Desafio Flugo — Frontend

Projeto de frontend desenvolvido em React com TypeScript, utilizando Material UI e Firebase para persistência dos dados.  
A aplicação consiste em um painel de gestão de colaboradores, com listagem e cadastro multi-step.

---

## Tecnologias utilizadas

- React (Create React App)
- TypeScript
- Material UI (MUI)
- React Router DOM
- Firebase (Firestore)

---

## Pré-requisitos

Antes de iniciar, certifique-se de ter instalado:

- Node.js (versão LTS recomendada)
- npm
- Git

Verificação:
node -v  
npm -v  
git --version  

Como rodar o projeto localmente:

1. Clonar o repositório:
git clone https://github.com/Gabriel-Santos-Fatec/desafio-flugo.git  
cd desafio-flugo  

2. Instalar dependências:
npm install  

3. Executar a aplicação:
npm start  

A aplicação será iniciada em:
http://localhost:3000  

Rotas principais:
  Colaboradores
  - /employees → listagem de colaboradores  
  - /employees/new → cadastro de colaborador
  - /employees/:id/edit → edição de colaborador

  Departamentos
  - /departments → listagem de departamentos  
  - /departments/new → cadastro de departamento  
  - /employees/:id/edit → edição de departamento  

Coleção utilizada no Firestore:
employees  

Estrutura dos documentos:
{
  name: string;
  email: string;
  departmentId: string;
  avatar: string;
  status: "Ativo" | "Inativo";
  role: string;
  admissionDate: string;
  level: "Junior" | "Pleno" | "Senior" | "Gestor";
  managerId: string;
  baseSalary: number;
}

Estrutura dos departamentos:
{
  name: string;
  managerId: string;
  employeeIds: string[];
}

Build de produção:
npm run build  

Observações:
- O arquivo .env está versionado propositalmente para facilitar a avaliação.
- As credenciais do Firebase referem-se apenas a este desafio.
- Em projetos reais, o .env não deve ser versionado.

Autor:
Projeto desenvolvido por Gabriel dos Santos Silva para fins de avaliação técnica.
