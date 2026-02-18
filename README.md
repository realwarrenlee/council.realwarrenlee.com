# LLM Council

**Production-grade multi-model deliberation system.** Get diverse perspectives through structured LLM discussions, peer review, and weighted synthesis.

[![Python 3.10+](https://img.shields.io/badge/python-3.10+-blue.svg)](https://www.python.org/downloads/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🚀 Quick Start

### Web Application (Recommended)

**Windows:**
```bash
start.bat
```

**Mac/Linux:**
```bash
./start.sh
```

This starts:
- Backend API on `http://localhost:8000`
- Frontend UI on `http://localhost:3000`

### Python Package

```bash
# Install
pip install -e .

# Run with python
```

```python
import asyncio
from llm_council import Council, RoleRegistry, Role, CouncilConfig
from llm_council.providers import OpenRouterProvider

async def main():
    # 1. Define Roles (Model-Based)
    registry = RoleRegistry()
    
    registry.add(Role(
        name="Advocate",
        prompt="You are an optimistic advocate. Focus on strengths and potential.",
        model="anthropic/claude-sonnet-4"
    ))
    
    registry.add(Role(
        name="Critic",
        prompt="You are a critical thinker. Focus on risks and flaws.",
        model="gpt-4"
    ))

    # 2. Configure Council
    config = CouncilConfig(
        output_mode="synthesis",    # options: "perspectives", "synthesis", "both"
        enable_peer_review=True,    # Enable cross-model evaluation
        aggregation_method="borda"  # options: "borda", "bradley_terry", "elo"
    )
    
    # 3. Initialize & Run
    provider = OpenRouterProvider(api_key="your_key_here")
    council = Council(registry, provider=provider, config=config)
    
    output = await council.deliberate("Should we migrate to microservices?")
    
    print(f"Synthesis:\n{output.synthesis}")

if __name__ == "__main__":
    asyncio.run(main())
```

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

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```bash
# Required for live LLM calls
OPENROUTER_API_KEY=your_key_here

# Optional: Custom OpenRouter base URL
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
```

## 🤝 Contributing

Contributions are welcome! Please submit a Pull Request.

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.
