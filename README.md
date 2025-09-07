# Mastermind Solver (Next.js + Tailwind)

Single-page Mastermind solver acting as the codebreaker. Uses deterministic filtering to narrow down possibilities.

- 4 pegs, symbols: U, D, R, L (repeats allowed)
- First guess: U D R L
- Feedback input: black (correct pos+symbol), white (correct symbol wrong pos)

## Run locally

1. Install deps
2. Start dev server

```sh
npm install
npm run dev
```

Then open the printed localhost URL.

## Notes
- Entire UI and logic live in `app/page.jsx` per requirements.
- Tailwind is set up via `app/globals.css`.
- Filtering retains only codes that would yield the same feedback vs the guess.