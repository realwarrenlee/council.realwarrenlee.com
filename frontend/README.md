# LLM Council

**Production-grade multi-model deliberation system.** Get diverse perspectives through structured LLM discussions, peer review, and weighted synthesis.

## ✨ Features

### 🎯 Core Capabilities

- **Model-Based Roles**: Define roles purely by Name, System Prompt, and Model ID.

- **Parallel Execution**: All roles generate responses simultaneously for maximum speed.

- **Peer Review System**: Roles critique each other's responses to find the best answer.

- **Aggregation Methods**:
    - **Borda Count**: Rank-based voting.
    - **Bradley-Terry**: Pairwise comparison model.
    - **ELO Rating**: Chess-style rating system.

- **Chairman Synthesis**: A dedicated "Chairman" model synthesizes all perspectives and peer reviews into a final verdict.

### 🏗️ Architecture

- **`CouncilConfig`**: Type-safe configuration for all deliberation parameters.
- **`PeerReviewOrchestrator`**: robust logic for managing cross-model critiques.
- **`RoleRegistry`**: Simple management of active roles.

## 📝 License

MIT License. Inspired by the "Language Model Council: Democratically Benchmarking Foundation Models on Highly Subjective Tasks" paper and Karpathy's implementation of LLM Council.