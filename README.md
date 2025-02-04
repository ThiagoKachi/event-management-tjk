### Funcionalidades Core:

1. Criação de eventos simples
2. Venda de ingressos
3. Geração de ingresso (QR Code)
4. Validação de ingresso

**. Fluxo Principal:**

1. Cliente seleciona evento e quantidade
2. Sistema faz reserva temporária (Redis)
3. Cliente faz pagamento
4. Pagamento vai para fila SQS
5. Após confirmação:
    - Gera QR Code (Lambda)
    - Salva no S3
    - Envia email

**. API Endpoints Básicos:**

```jsx
// Eventos
GET /events
GET /events/:id
POST /events (TODO: only admin can create)

// Pedidos
POST /orders
GET /orders/:id
GET /orders/:id/ticket

// Validação
POST /tickets/validate (Valida e Registra o uso do ingresso)

```

### Fluxo principal da aplicação de forma simples:

1. **Reserva Inicial**
- Cliente seleciona evento e quantidade
- Sistema verifica disponibilidade no (Redis)
- Cria reserva temporária (15 minutos) (Redis)
- Decrementa temporariamente a quantidade disponível (Redis)
1. **Confirmação de Pagamento**
- Cliente envia confirmação de pagamento (simulado)
- Sistema valida se a reserva ainda existe (Redis)
- Cria uma mensagem com dados do pedido e pagamento
- Envia essa mensagem para fila SQS
1. **Processamento (Lambda)**
- Lambda recebe mensagem da fila
- Atualiza status do pedido para "pago"
- Gera QR Code único para o ingresso
- Salva QR Code no S3
- Atualiza pedido com código do ingresso
- Confirma a venda no evento (banco de dados)
- Envio de email para o cliente (SES)
1. **Controle de Erros**
- Se pagamento falha: devolve ingressos para disponibilidade
- Se processamento falha: mensagem volta para fila
- Se reserva expira: libera automaticamente os ingressos
1. **Pontos Importantes**
- Redis controla disponibilidade em tempo real
- Fila garante processamento mesmo com falhas
- Sistema é assíncrono para melhor performance
- Reserva temporária evita overselling
- Sem integração real com gateway de pagamento

### Aplicação Node (API Principal)

1. **Endpoints de Evento**
- Listar eventos disponíveis
- Detalhes do evento
- Criar evento (admin)
- Atualizar evento (admin)
1. **Endpoints de Pedido**
- Criar reserva
- Consultar status do pedido
- Confirmar pagamento (simulado)
- Consultar ingresso
1. **Gerenciamento de Cache**
- Controle de disponibilidade no Redis
- Gestão de reservas temporárias
- Invalidação de cache quando necessário
1. **Comunicação com SQS**
- Envio de mensagens para processamento
- Monitoramento de status

### Lambda Functions (Serverless)

1. **Processador de Pagamentos**
- Recebe mensagens da fila SQS
- Atualiza status do pedido
- Gera QR Code
- Salva no S3
- Confirma venda no evento
1. **Limpeza de Reservas**
- Roda periodicamente (ex: a cada hora)
- Remove reservas expiradas
- Ajusta contadores de disponibilidade
1. **Validador de Ingressos**
- Endpoint separado para validação
- Verifica autenticidade do QR Code
- Registra uso do ingresso

### Tecnologias utilizadas:
- Node.js + Express
- TypeScript
- Prisma
- Redis (ioredis)
- Docker
- ESLint + Prettier
- Zod
- AWS (SQS, SES, Lambda, S3)
