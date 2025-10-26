# D.Buzz Client Documentation

Welcome to the comprehensive documentation for D.Buzz Client, a decentralized social media platform built on the Hive blockchain.

## What's New (2025 Updates)

### 🚀 100% Frontend Architecture
D.Buzz is now a completely client-side application with **no backend servers**:
- All data fetched directly from Hive blockchain
- No intermediary servers or custom APIs required
- Maximum privacy and decentralization
- Fully open-source and transparent

### ⚡ Automatic API Failover System
Enhanced reliability with intelligent failover:
- **3 Hive API nodes** with priority-based selection
- **Automatic switching** on API failures
- **5-minute cooldown** for failed nodes
- **Zero downtime** - seamless user experience

### 📸 Direct Hive Image Upload
Native integration with Hive's image hosting:
- **Direct upload to images.hive.blog** - No third-party servers
- **Cryptographic signing** - Secure authentication with posting key
- **Progress tracking** - Real-time upload progress
- **Automatic fallback** - Handles legacy image URLs
- **Full debugging** - Comprehensive logging for troubleshooting

### 🔧 Improved Error Handling
- JSON-RPC response format handling
- Data validation and normalization
- Smart retry logic with exponential backoff
- Detailed debug logging
- Fixed Immutable.js modal issues

[See full changelog →](./api/api-service.md#recent-improvements-2025)

---

## Table of Contents

### Getting Started
- [Development Setup Guide](./guides/development-setup.md)
- [Quick Start](./guides/quick-start.md)
- [Configuration Guide](./guides/configuration.md)

### Architecture
- [Project Overview](./architecture/overview.md)
- [Technology Stack](./architecture/tech-stack.md)
- [Application Architecture](./architecture/application-architecture.md)
- [Data Flow](./architecture/data-flow.md)
- [File Structure](./architecture/file-structure.md)

### Components
- [Component Overview](./components/overview.md)
- [Page Components](./components/pages.md)
- [Section Components](./components/sections.md)
- [Common Components](./components/common.md)
- [Modal Components](./components/modals.md)
- [Layout Components](./components/layouts.md)
- [Element Components](./components/elements.md)

### API & Services
- [API Service](./api/api-service.md)
- [Helper Service](./api/helper-service.md)
- [Ceramic Service](./api/ceramic-service.md)
- [Theme Service](./api/theme-service.md)
- [Hive Blockchain Integration](./api/hive-integration.md)

### State Management
- [Redux Store Structure](./architecture/redux-store.md)
- [Redux Sagas](./architecture/redux-sagas.md)
- [Actions and Reducers](./architecture/actions-reducers.md)

### Features
- [Core Features](./guides/features.md)
- [User Authentication](./guides/authentication.md)
- [Content Creation](./guides/content-creation.md)
- [Moderation System](./guides/moderation.md)
- [Wallet Integration](./guides/wallet.md)

### Deployment
- [Build Process](./deployment/build.md)
- [Docker Deployment](./deployment/docker.md)
- [CircleCI Configuration](./deployment/circleci.md)
- [Environment Configuration](./deployment/environment.md)

### Contributing
- [Contributing Guidelines](./guides/contributing.md)
- [Code Style Guide](./guides/code-style.md)
- [Testing](./guides/testing.md)

## Quick Links

- **Main Repository**: [d.buzz-client](https://github.com/d-buzz/d.buzz-client)
- **Live Application**: [https://d.buzz](https://d.buzz)
- **Hive Blockchain**: [https://hive.io](https://hive.io)

## Project Statistics

| Metric | Value |
|--------|-------|
| Total JS Files | 231 |
| Total Lines of Code | ~43,646 |
| Component Count | 100+ |
| Modal Count | 35 |
| Page Count | 18 |
| Dependencies | 90+ |
| React Version | 16.13.1 |
| Node Version | 18 |

## About D.Buzz

D.Buzz is a decentralized, censorship-resistant microblogging platform built on the Hive blockchain. It combines the familiar experience of Twitter-like social media with the benefits of blockchain technology:

- **Decentralized**: No central authority controls your content
- **Monetized**: Earn cryptocurrency rewards for your posts
- **Censorship-Resistant**: Content stored on blockchain
- **Transparent**: Open-source and auditable
- **Community-Governed**: Stakeholder voting on platform decisions

## Support

For questions, issues, or contributions, please visit our GitHub repository or join our community on Hive.

## License

This project is released into the public domain under the Unlicense. See [LICENSE](../license.txt) for details.
