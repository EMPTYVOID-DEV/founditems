# FoundItems

A modern, intelligent platform that bridges the gap between individuals who have lost items and those who have found them. The system provides secure, automated matching capabilities while ensuring scam prevention through sophisticated verification mechanisms.

## Project Overview

FoundItems is designed to serve various use cases including hotels, cafeterias, universities, public transportation systems, and personal lost-and-found scenarios. The platform features an intelligent matching algorithm that automatically connects lost and found items based on multiple criteria including location, time, category, and item characteristics.

### Key Features

- **Automatic Item Matching**: AI-powered algorithm that matches lost and found items
- **Multi-language Support**: International platform with typesafe internationalization
- **Secure Authentication**: Robust user verification and session management
- **Flexible Address System**: Support for both general locations and transport routes
- **Real-time Notifications**: Email notifications for successful matches
- **Company & Individual Workflows**: Tailored interfaces for different user types
- **Scam Prevention**: Built-in verification mechanisms to prevent fraudulent claims

## 🛠 Tech Stack

### Frontend

- **SvelteKit**: Modern full-stack framework for reactive web applications
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Shadcn/UI**: High-quality, accessible UI component library
- **TypeScript**: Type-safe development with enhanced developer experience

### Backend

- **Hono**: Lightweight, fast web framework for the matching service API
- **Node.js**: Runtime environment for server-side JavaScript
- **@huggingface/transformers**: AI models for text similarity matching
- **Lucia Auth**: Secure session-based authentication

### Database & ORM

- **PostgreSQL**: Robust relational database for data persistence
- **Drizzle ORM**: Type-safe database toolkit with excellent TypeScript integration

### Infrastructure & Deployment

- **Docker**: Containerization for consistent deployments
- **Docker Compose**: Multi-service orchestration
- **Traefik**: Reverse proxy and load balancer
- **Ansible**: Infrastructure as Code for Azure deployment
- **Azure**: Cloud platform for production hosting

### Development Tools

- **pnpm**: Fast, disk space efficient package manager
- **TypeScript**: Static type checking across the entire stack
- **ESLint & Prettier**: Code quality and formatting tools
- **Vitest**: Fast unit testing framework

## Matching Algorithm

The matching system operates on a sophisticated multi-criteria approach that evaluates items across several dimensions:

### Matching Criteria

**Category Matching**: Items must belong to the same category as a fundamental prerequisite before any other matching criteria are evaluated (e.g:[electronics,computer]).

**Address Matching**: A radius-based approach using the Haversine formula to calculate the great-circle distance between two geographic coordinates. The radius size depends on latitude and longitude this logic also applies to transport start and finish points, while the transport type requires an exact match.

**Date Matching**: Items are matched within a configurable time window (default: 12 hours) from the reported date. This accounts for differences in when items are reported versus when they were actually lost or found.

**Metadata Matching**: Sophisticated text-similarity evaluation utilizing HuggingFace transformers, which provides highly accurate similarity checks while maintaining smaller model sizes compared to classic methods.

### Algorithm Workflow

1. **Cycle-Based Processing**: Operates in configurable blocks (default: 4 items per cycle)
2. **Lost Item Fetching**: Retrieves a block of oldest unmatched lost items first, ordered by creation date
3. **Found Item Matching**: For each lost item, attempts to find one eligible found item (same category, different user, not previously unmatched)
4. **Matching Pair Creation**: Creates pairs of lost and found items for evaluation
5. **Multi-Criteria Evaluation**: Runs the matching algorithm on each pair, applying date, address, and metadata matching rules
6. **Action Generation**: Creates match or unmatch actions based on evaluation results
7. **Conflict Resolution**: Removes duplicate matches to ensure each found item gets matched to only one lost item (first-come-first-served basis)
8. **State Management**: Updates item status to 'matched', stores unmatch records, and saves successful matches in database
9. **User Notification**: Sends email notifications to both finders and victims for successful matches

### Configurable Parameters

- `ADDRESS_MATCHING_THRESHOLD`: Geographic radius in meters (default: 100m)
- `DATE_MATCHING_THRESHOLD`: Time window in hours (default: 24h)
- `TEXT_SIMILARITY_THRESHOLD`: AI similarity score (default: 0.5)
- `ALGORITHM_BLOCK_SIZE`: Items processed per cycle (default: 4)
- `MATCHING_CYCLE_TIMEOUT`: Delay between cycles (default: 5s)

## Deployment

### Environment Configuration

Before deployment, create an `env` folder in the project root with the following structure:

```
env/
├── global.env      # Domain configuration
├── web.env         # Sveltekit environment
├── api.env         # Hono environment
├── migrator.env    # Database migrator environment
└── db.env          # PostgreSQL database environment
```

### Docker Deployment

The application uses Docker Compose for multi-service orchestration:

```bash
docker compose -f docker/docker-compose.yml --env-file=env/global.env up -d
```

### Local Testing

**For Local Development:**
Configure your `/etc/hosts` file to map the subdomains:

```bash
# Add these lines to /etc/hosts for local development
127.0.0.1 web.localhost
127.0.0.1 api.localhost
```

Then set `DOMAIN=localhost` in your `env/global.env` file and access:

- **Web App**: `http://web.localhost`
- **API**: `http://api.localhost`

**For Testing Production Environment:**
Since Azure provides a full domain name that cannot be configured with subdomains, configure your `/etc/hosts` to test the production environment locally:

```bash
# Add these lines to /etc/hosts for production testing
52.138.142.193 api.founditems.northeurope.cloudapp.azure.com
52.138.142.193 web.founditems.northeurope.cloudapp.azure.com
```

### Azure Cloud Deployment

Automated deployment to Azure using Ansible with encrypted credentials:

```bash
ansible-playbook ansible/playbook.yaml --ask-vault-pass
```

**Security**: Azure service principal credentials (OAuth client) are stored securely using Ansible Vault encryption, ensuring sensitive authentication information is protected in the repository.

**Infrastructure Components:**

- **VM Size**: Standard_B1s (cost-effective for small workloads)
- **OS**: Ubuntu 22.04 LTS
- **Network**: Virtual network with HTTP/HTTPS/SSH access
- **Storage**: 30GB managed disk
- **DNS**: Automatic FQDN assignment

**Automated Setup:**

- Docker and Docker Compose installation
- Application file synchronization
- Service orchestration with Traefik

## License

This project is licensed under the [MIT License](https://opensource.org/license/mit).
