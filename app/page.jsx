
export default function Page() {
  // State variables
  const [guessNumber, setGuessNumber] = useState(1)
  const [possibleCodes, setPossibleCodes] = useState(() => generateAllCodes())
  const [currentGuess, setCurrentGuess] = useState(['U', 'D', 'R', 'L'])
  const [history, setHistory] = useState([])
  const [blackInput, setBlackInput] = useState('0')
  const [whiteInput, setWhiteInput] = useState('0')
  const [message, setMessage] = useState('Enter feedback for the current guess.')

  // Utility: render pegs nicely
  function Pegs({ code }) {
    return (
      <div className="flex gap-2">
        {code.map((p, i) => (
          <span
            key={i}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border bg-white text-xl shadow-sm"
            title={p}
          >
            {SYMBOLS[p] || p}
          </span>
        ))}
      </div>
    )
  }

"use client"
import { useState, useMemo } from "react"

const PEGS = ["U", "D", "R", "L"]
const SYMBOLS = { U: "↑", D: "↓", R: "→", L: "←" }

function generateAllCodes() {
  const res = []
  for (const a of PEGS)
    for (const b of PEGS)
      for (const c of PEGS)
        for (const d of PEGS)
          res.push([a, b, c, d])
  return res
}

function calculateFeedback(guess, secret) {
  let black = 0
  const guessCounts = { U: 0, D: 0, R: 0, L: 0 }
  const secretCounts = { U: 0, D: 0, R: 0, L: 0 }
  for (let i = 0; i < 4; i++) {
    if (guess[i] === secret[i]) black++
    else {
      guessCounts[guess[i]]++
      secretCounts[secret[i]]++
    }
  }
  let white = 0
  for (const p of PEGS) white += Math.min(guessCounts[p], secretCounts[p])
  return [black, white]
}

function pickNextGuess(possibleCodes) {
  return possibleCodes.length ? possibleCodes[0] : null
}

function Pegs({ code }) {
  return (
    <div className="flex gap-2">
      {code.map((p, i) => (
        <span
          key={i}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border bg-white text-xl shadow-sm"
          title={p}
        >
          {SYMBOLS[p] || p}
        </span>
      ))}
    </div>
  )
}

export default function Page() {
    const [guessNumber, setGuessNumber] = useState(1)
    const [possibleCodes, setPossibleCodes] = useState(() => generateAllCodes())
    const [currentGuess, setCurrentGuess] = useState(["U", "D", "R", "L"])
    const [history, setHistory] = useState([])
    const [blackInput, setBlackInput] = useState("0")
    const [whiteInput, setWhiteInput] = useState("0")
    const [message, setMessage] = useState("Enter feedback for the current guess.")

    function handleReset() {
      setGuessNumber(1)
      setPossibleCodes(generateAllCodes())
      setCurrentGuess(["U", "D", "R", "L"])
      setHistory([])
      setBlackInput("0")
      setWhiteInput("0")
      setMessage("Enter feedback for the current guess.")
    }

    function handleFeedback(e) {
      e?.preventDefault?.()
      const black = Number(blackInput)
      const white = Number(whiteInput)
      if (Number.isNaN(black) || Number.isNaN(white)) {
        setMessage("Invalid input. Please enter numbers for black and white pegs.")
        return
      }
      if (black < 0 || black > 4 || white < 0 || white > 4 || black + white > 4) {
        setMessage("Invalid feedback. Each value must be 0-4 and their sum ≤ 4.")
        return
      }
      if (black === 4) {
        const newEntry = { guess: currentGuess, black, white }
        setHistory((h) => [...h, newEntry])
        setMessage("Correct! 🎉 The solver found your code.")
        return
      }
      const filtered = possibleCodes.filter((code) => {
        const [b, w] = calculateFeedback(currentGuess, code)
        return b === black && w === white
      })
      const newEntry = { guess: currentGuess, black, white }
      setHistory((h) => [...h, newEntry])
      setPossibleCodes(filtered)
      if (filtered.length === 0) {
        setMessage("No codes match that feedback. Please re-check and try again.")
        return
      }
      const next = pickNextGuess(filtered)
      setCurrentGuess(next)
      setGuessNumber((n) => n + 1)
      setBlackInput("0")
      setWhiteInput("0")
      setMessage(
        filtered.length === 1
          ? "Only one possibility remains—enter feedback to confirm."
          : `Filtered to ${filtered.length} possible codes. Enter feedback for the next guess.`
      )
    }

    const remainingEstimate = useMemo(() => {
      const n = possibleCodes.length
      if (n <= 1) return 1
      if (n <= 4) return 2
      if (n <= 16) return 3
      return 4
    }, [possibleCodes.length])

    const optimalGuess = useMemo(() => {
      if (possibleCodes.length === 0) return null
      return possibleCodes[0]
    }, [possibleCodes])

    return (
      <main className="mx-auto max-w-3xl px-4 py-8">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">Mastermind Solver</h1>
          <span className="text-sm text-gray-600">Deterministic codebreaker (4 pegs, U/D/R/L)</span>
        </header>

        <section className="mb-6 rounded-lg border bg-white p-5 shadow-sm">
          <div className="mb-4 flex justify-end">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center rounded-md bg-gray-200 px-3 py-1 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Reset Game
            </button>
          </div>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Guess number</div>
              <div className="text-xl font-medium">{guessNumber}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Remaining possibilities</div>
              <div className="text-xl font-medium">{possibleCodes.length}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Best-case remaining turns</div>
              <div className="text-xl font-medium">≤ {remainingEstimate}</div>
            </div>
          </div>

          {/* Show all possible codes and optimal suggestion if 4th guess and <=4 possibilities */}
          {guessNumber === 4 && possibleCodes.length > 0 && possibleCodes.length <= 4 && (
            <div className="mb-4 rounded-md border border-yellow-300 bg-yellow-50 p-4">
              <div className="mb-2 text-sm font-semibold text-yellow-800">Possible codes remaining:</div>
              <div className="flex flex-wrap gap-3 mb-2">
                {possibleCodes.map((code, idx) => (
                  <div key={idx} className="flex items-center gap-2 rounded-md border bg-white px-3 py-2 shadow-sm">
                    <Pegs code={code} />
                    {optimalGuess && code.join('') === optimalGuess.join('') && (
                      <span className="ml-2 rounded bg-indigo-100 px-2 py-1 text-xs font-semibold text-indigo-700">Optimal</span>
                    )}
                  </div>
                ))}
              </div>
              <div className="text-sm text-yellow-700 flex items-center gap-2">
                Suggestion: Try <span className="font-bold"><Pegs code={optimalGuess} /></span> for highest probability.
              </div>
            </div>
          )}

          <div className="mb-4">
            <div className="mb-2 text-sm text-gray-600">Current guess</div>
            <Pegs code={currentGuess} />
          </div>

          <form onSubmit={handleFeedback} className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <label className="flex flex-col">
              <span className="mb-1 text-sm text-gray-700">Black pegs</span>
              <input
                type="number"
                min={0}
                max={4}
                value={blackInput}
                onChange={(e) => setBlackInput(e.target.value)}
                className="rounded-md border px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </label>
            <label className="flex flex-col">
              <span className="mb-1 text-sm text-gray-700">White pegs</span>
              <input
                type="number"
                min={0}
                max={4}
                value={whiteInput}
                onChange={(e) => setWhiteInput(e.target.value)}
                className="rounded-md border px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </label>
            <div className="flex items-end">
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-md bg-indigo-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Submit Feedback
              </button>
            </div>
          </form>

          <div className="mt-4 rounded-md border border-indigo-200 bg-indigo-50 p-3 text-sm text-indigo-800">
            {message}
          </div>
        </section>

        <section className="rounded-lg border bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-lg font-medium">History</h2>
          {history.length === 0 ? (
            <div className="text-sm text-gray-600">No guesses yet. First guess is U D R L.</div>
          ) : (
            <ul className="space-y-3">
              {history.map((h, idx) => (
                <li key={idx} className="flex items-center justify-between rounded-md border p-3">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">#{idx + 1}</span>
                    <Pegs code={h.guess} />
                  </div>
                  <div className="text-sm text-gray-700">
                    <span className="mr-3">Black: {h.black}</span>
                    <span>White: {h.white}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <footer className="mt-8 text-center text-xs text-gray-500">
          Tip: Provide consistent feedback. The solver filters to codes that produce the same feedback vs each guess.
        </footer>
      </main>
    )
  }
    const n = possibleCodes.length
    if (n <= 1) return 1
    if (n <= 4) return 2
    if (n <= 16) return 3
    return 4
  }, [possibleCodes.length])

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Mastermind Solver</h1>
        <span className="text-sm text-gray-600">Deterministic codebreaker (4 pegs, U/D/R/L)</span>
      </header>

      <section className="mb-6 rounded-lg border bg-white p-5 shadow-sm">
        <div className="mb-4 flex justify-end">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center rounded-md bg-gray-200 px-3 py-1 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Reset Game
          </button>
        </div>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-600">Guess number</div>
            <div className="text-xl font-medium">{guessNumber}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Remaining possibilities</div>
            <div className="text-xl font-medium">{possibleCodes.length}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Best-case remaining turns</div>
            <div className="text-xl font-medium">≤ {remainingEstimate}</div>
          </div>
        </div>

        <div className="mb-4">
          <div className="mb-2 text-sm text-gray-600">Current guess</div>
          <Pegs code={currentGuess} />
        </div>

        <form onSubmit={handleFeedback} className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <label className="flex flex-col">
            <span className="mb-1 text-sm text-gray-700">Black pegs</span>
            <input
              type="number"
              min={0}
              max={4}
              value={blackInput}
              onChange={(e) => setBlackInput(e.target.value)}
              className="rounded-md border px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </label>
          <label className="flex flex-col">
            <span className="mb-1 text-sm text-gray-700">White pegs</span>
            <input
              type="number"
              min={0}
              max={4}
              value={whiteInput}
              onChange={(e) => setWhiteInput(e.target.value)}
              className="rounded-md border px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </label>
          <div className="flex items-end">
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-md bg-indigo-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Submit Feedback
            </button>
          </div>
        </form>

        <div className="mt-4 rounded-md border border-indigo-200 bg-indigo-50 p-3 text-sm text-indigo-800">
          {message}
        </div>
      </section>

      <section className="rounded-lg border bg-white p-5 shadow-sm">
        <h2 className="mb-3 text-lg font-medium">History</h2>
        {history.length === 0 ? (
          <div className="text-sm text-gray-600">No guesses yet. First guess is U D R L.</div>
        ) : (
          <ul className="space-y-3">
            {history.map((h, idx) => (
              <li key={idx} className="flex items-center justify-between rounded-md border p-3">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">#{idx + 1}</span>
                  <Pegs code={h.guess} />
                </div>
                <div className="text-sm text-gray-700">
                  <span className="mr-3">Black: {h.black}</span>
                  <span>White: {h.white}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <footer className="mt-8 text-center text-xs text-gray-500">
        Tip: Provide consistent feedback. The solver filters to codes that produce the same feedback vs each guess.
      </footer>
    </main>
  )
}
// trigger redeploy
