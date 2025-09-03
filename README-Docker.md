# Docker para Estoque AI Chat

Este projeto inclui configurações Docker para desenvolvimento e produção.

## Arquivos Criados

- `Dockerfile` - Dockerfile multi-stage para build e produção
- `docker-compose.yml` - Orquestração de serviços
- `nginx.conf` - Configuração do nginx para produção
- `.dockerignore` - Arquivos ignorados no build
- `README-Docker.md` - Esta documentação

## Como Usar

### Desenvolvimento

Para iniciar o ambiente de desenvolvimento:

```bash
# Construir e iniciar apenas o frontend em modo desenvolvimento
docker-compose --profile dev up --build

# Ou especificamente o serviço de desenvolvimento
docker-compose up frontend-dev --build
```

O frontend estará disponível em `http://localhost:8080`

### Produção

Para build e deploy em produção:

```bash
# Construir e iniciar o frontend em modo produção
docker-compose --profile prod up --build

# Ou especificamente o serviço de produção
docker-compose up frontend-prod --build
```

O frontend estará disponível em `http://localhost:80`

### Backend Mock (Opcional)

Para desenvolvimento sem backend real:

```bash
# Iniciar com backend mock
docker-compose --profile dev --profile mock up --build
```

### Nginx Reverso (Opcional)

Para usar nginx como proxy reverso:

```bash
# Iniciar com nginx reverso
docker-compose --profile prod --profile reverse up --build
```

## Comandos Úteis

```bash
# Parar todos os serviços
docker-compose down

# Parar e remover volumes
docker-compose down -v

# Ver logs de um serviço específico
docker-compose logs frontend-dev

# Executar comandos dentro do container
docker-compose exec frontend-dev npm run lint

# Rebuild de um serviço específico
docker-compose up --build frontend-dev
```

## Estrutura dos Serviços

### Frontend Development
- **Porta**: 8080
- **Target**: development
- **Volumes**: Hot-reload para desenvolvimento
- **Comando**: `npm run dev`

### Frontend Production
- **Porta**: 80
- **Target**: production
- **Servidor**: Nginx otimizado
- **Build**: Otimizado para produção

### Backend Mock
- **Porta**: 8000
- **Propósito**: Simular APIs para desenvolvimento
- **Configuração**: Nginx simples

### Nginx Reverso
- **Portas**: 80, 443 (HTTPS)
- **Propósito**: Proxy reverso e SSL termination
- **Configuração**: Customizável via `nginx-reverse.conf`

## Configurações

### Variáveis de Ambiente

- `NODE_ENV`: Define o ambiente (development/production)
- `CHOKIDAR_USEPOLLING`: Habilita polling para hot-reload no Docker

### Volumes

- **Desenvolvimento**: Arquivos fonte montados para hot-reload
- **Produção**: Apenas arquivos buildados

### Redes

- **estoque-ai-network**: Rede bridge para comunicação entre serviços

## Otimizações

### Build Multi-stage
- **Stage 1**: Instalação de dependências e build
- **Stage 2**: Nginx otimizado para produção
- **Stage 3**: Ambiente de desenvolvimento

### Nginx
- Gzip compression
- Cache para assets estáticos
- Headers de segurança
- Proxy para APIs backend
- Suporte a SPA routing

### Docker
- `.dockerignore` otimizado
- Volumes para desenvolvimento
- Networks isoladas
- Profiles para diferentes cenários

## Troubleshooting

### Porta já em uso
```bash
# Verificar portas em uso
netstat -tulpn | grep :8080

# Parar serviços conflitantes
docker-compose down
```

### Problemas de permissão
```bash
# No Windows, pode ser necessário executar como administrador
# No Linux/Mac, pode ser necessário ajustar permissões
sudo chown -R $USER:$USER .
```

### Rebuild completo
```bash
# Remover todas as imagens e containers
docker-compose down --rmi all --volumes --remove-orphans

# Rebuild completo
docker-compose up --build
```

## Próximos Passos

1. Configure variáveis de ambiente específicas do seu projeto
2. Ajuste as configurações do nginx conforme necessário
3. Configure SSL/TLS para produção
4. Implemente CI/CD com Docker
5. Configure monitoramento e logs
