# Sistema de Agenda Médica

Visão Geral
Este é um sistema completo de uma agenda médica para controle de compromissos, 
desenvolvendo com HTML5, CSS3 e JavaScript, que permite agendamento de consultas, 
exames e tratamentos de pacientes em clínicas ou hospitais.

Informações do Aluno
Nome: Caroline Saraiva Diniz
Matrícula: 01813666
Curso: Análise e Desenvolvimento de Sistemas
Turno: Manhã
Instituição: Centro Universitário Maurício de Nassau - Aguanambi

Estrutura do projeto
index.html - Estrutura HTML principal com formulários.
style.css - Estilos CSS responsivos e acessíveis.
script.js - Lógica JavaScript (classe MedicalScheduler).
readme.md - Documentação do projeto.

Funcionalidades Principais
1. Formulário de Agendamento
⦁	Campos: Nome do paciente, telefone, e-mail, endereço, tipo de atendimento, data, horário, 
médico/especialidade, status, observações.
⦁	Validação front-end completa com HTML5 (required, minlength, maxlength, pattern, type).
⦁	Suporte para criar e editar agendamentos
2. Dashboard de Agendamentos
⦁	Lista todos os agendamentos com informações completas
⦁	Ordenação automática por data e horário
3. Operações CRUD
⦁	Create: Criar novos agendamentos
⦁	Read: Visualizar lista de agendamentos com filtros
⦁	Update: Editar agendamentos existentes
⦁	Delete: Excluir agendamentos com confirmação
4. Persistência de Dados
Armazenamento local usando LocalStorage
Dados mantidos entre sessões do navegador
Serialização/desserialização JSON automáti
