### Funcionalidades Core:

1. Criação de eventos simples
2. Venda de ingressos
3. Geração de ingresso (QR Code)
4. Validação de ingresso

### Estrutura Simplificada:

**1. Modelagem de Dados (Postgres)**

```jsx
events
- id
- name
- date
- location
- capacity
- available
- price
- status

orders
- id
- event_id (FK)
- customer_email
- quantity
- total_amount
- status
- ticket_code
- created_at

tickets
- id
- order_id (FK)
- qr_code
- status
- validation_date

```

**2. Serviços AWS**

- S3: Armazenar QR Codes dos ingressos
- SQS: Fila de processamento de pagamentos
- Lambda: Geração de QR Code após pagamento

**3. Cache (Redis)**
Apenas dois casos essenciais:

```jsx
// Disponibilidade de ingressos
key: `event:${eventId}:available`
value: number

// Reservas temporárias
key: `reservation:${orderId}`
value: {
  eventId,
  quantity,
  expiresAt
}

```

**4. Fluxo Principal:**

1. Cliente seleciona evento e quantidade
2. Sistema faz reserva temporária (Redis)
3. Cliente faz pagamento
4. Pagamento vai para fila SQS
5. Após confirmação:
    - Gera QR Code (Lambda)
    - Salva no S3
    - Envia email

**5. API Endpoints Básicos:**

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
POST /tickets/validate

```

**6. Tratamento de Erros Básico:**

- Evento lotado
- Pagamento recusado
- Reserva expirada

Esta versão reduzida:

- Mantém as funcionalidades essenciais
- Usa menos recursos AWS
- Tem menos complexidade
- É mais fácil de manter
- Pode ser expandida posteriormente

Quer que eu detalhe alguma parte específica desta versão simplificada?

### Fluxo principal da aplicação de forma simples:

1. **Reserva Inicial**
- Cliente seleciona evento e quantidade
- Sistema verifica disponibilidade no Redis
- Cria reserva temporária (15 minutos)
- Decrementa temporariamente a quantidade disponível
1. **Confirmação de Pagamento**
- Cliente envia confirmação de pagamento (simulado)
- Sistema valida se a reserva ainda existe
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

É um fluxo simplificado mas que permite entender e praticar:

- Uso de filas (SQS)
- Cache (Redis)
- Funções serverless (Lambda)
- Storage (S3)
- Processamento assíncrono

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

Esta separação permite:

- API principal lida com operações em tempo real
- Lambdas processam tarefas assíncronas/demoradas
- Melhor gestão de recursos
- Escalabilidade independente
- Isolamento de responsabilidades

<----------------------->
- Node.js + Express
- TypeScript
- Prisma
- Redis (ioredis)
- Jest
- Docker
- ESLint + Prettier
- Zod
