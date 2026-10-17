# SOURCES · `tokens-explained` ("the dark reality of tokens")

| Beat | Claim / Number | Primary Source |
|---|---|---|
| t01 | `"strawberry"` tokenizes into 2 tiles (`straw` + `berry`), hiding individual letters | OpenAI `tiktoken` (`cl100k_base` / `o200k_base`) |
| t02 | Subword Byte-Pair Encoding (BPE); 1 token ≈ 4 chars / 0.75 words | Sennrich et al. (ACL 2016); OpenAI Tokenizer Documentation |
| t03 | Output tokens billed 4x–5x higher than input tokens | 2026 Frontier API Pricing Docs (Anthropic / OpenAI) |
| t04 | 128k context ≈ 300 pages; 1M context ≈ 750,000 words | Anthropic / OpenAI Context Window Documentation (2026) |
| t05 | Non-English languages require 1.5x to 3x+ more tokens for identical meaning | Petrov et al. (NeurIPS / Oxford): *"Language Model Tokenizers Introduce Unfairness Between Languages"* |
