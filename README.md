# ⚡ MEDIÇÃO COLINAS

**MEDIÇÃO COLINAS** é um aplicativo móvel desenvolvido em **React Native com Expo**, projetado para realizar a coleta das medições de **energia, água e gás** diretamente nas lojas e unidades do complexo Colinas.

O app faz parte do ecossistema integrado com o sistema web **GESTÃO COLINAS**, que realiza o controle administrativo e analítico dos dados coletados.

---

## 🚀 Tecnologias Principais

- **React Native** — Framework para desenvolvimento mobile multiplataforma.  
- **Expo** — Ambiente otimizado para desenvolvimento e deploy.  
- **Supabase** — Backend completo (autenticação, banco de dados e storage).  
- **TypeScript** — Tipagem estática para maior segurança.  

---

## ⚙️ Funcionalidades Principais

- 🔐 **Login e autenticação** via Supabase.  
- 🧭 **Coleta de medições** de energia, água e gás por loja e tipo de relógio.  
- 🖼️ **Upload de fotos** das medições diretamente para o Supabase Storage.  
- 📅 **Validação automática** dos valores, garantindo que cada nova leitura seja superior à do mês anterior.  
- 🛰️ **Sincronização direta** com o sistema web **GESTÃO COLINAS**.  
- 📍 **Identificação da localidade** da medição.  
- 🚫 **Sem permissões de edição** — o app é destinado exclusivamente à coleta, mantendo a integridade dos dados.  

---

## 🔗 Integração com Sistema Web

O **MEDIÇÃO COLINAS** atua em conjunto com o sistema **GESTÃO COLINAS**, enviando as medições coletadas para a base central (Supabase).  
Esses dados são processados e exibidos no painel administrativo, permitindo análises, relatórios e visualização gráfica do consumo por loja e por período.

---

## 🧩 Objetivo

Facilitar e agilizar o processo de coleta de medições no complexo Colinas, garantindo precisão nos dados e integração em tempo real com o sistema administrativo.

---

## 🏢 Projeto Relacionado

🔗 [GESTÃO COLINAS (Web)](https://github.com/FernandoFerreira94/Gestao-Colinas)  
Aplicação Next.js voltada à administração, relatórios e controle de permissões do sistema.
