/**********************************************
 * STARTER CODE
 **********************************************/

/**
 * shuffle()
 * Shuffle the contents of an array
 *   depending the datatype of the source
 * Makes a copy. Does NOT shuffle the original.
 * Based on Steve Griffith's array shuffle prototype
 * @Parameters: Array or string
 * @Return: Scrambled Array or string, based on the provided parameter
 */
function shuffle (src) {
  const copy = [...src]

  const length = copy.length
  for (let i = 0; i < length; i++) {
    const x = copy[i]
    const y = Math.floor(Math.random() * length)
    const z = copy[y]
    copy[i] = z
    copy[y] = x
  }

  if (typeof src === 'string') {
    return copy.join('')
  }

  return copy
}

/**********************************************
 * YOUR CODE BELOW
 **********************************************/

const words = [
  'react',
  'javascript',
  'browser',
  'function',
  'variable',
  'component',
  'computer',
  'keyboard',
  'internet',
  'student'
]

const savedGame = JSON.parse(localStorage.getItem('scrambleGame')) || null

function createWord (word) {
  return {
    answer: word,
    scrambled: shuffle(word)
  }
}

function getNewGame () {
  const shuffledWords = shuffle(words)
  const firstWord = shuffledWords[0]
  const remainingWords = shuffledWords.slice(1)

  return {
    points: 0,
    strikes: 0,
    passes: 3,
    userInput: '',
    currentWord: createWord(firstWord),
    remainingWords
  }
}

function App () {
  const startingGame = savedGame || getNewGame()

  const [points, setPoints] = React.useState(startingGame.points)
  const [strikes, setStrikes] = React.useState(startingGame.strikes)
  const [passes, setPasses] = React.useState(startingGame.passes)
  const [userInput, setUserInput] = React.useState(startingGame.userInput)
  const [currentWord, setCurrentWord] = React.useState(startingGame.currentWord)
  const [remainingWords, setRemainingWords] = React.useState(startingGame.remainingWords)

  const gameOver = !currentWord || strikes >= 3

  React.useEffect(() => {
    const gameState = {
      points,
      strikes,
      passes,
      userInput,
      currentWord,
      remainingWords
    }

    localStorage.setItem('scrambleGame', JSON.stringify(gameState))
  }, [points, strikes, passes, userInput, currentWord, remainingWords])

  function goToNextWord () {
    const nextWord = remainingWords[0]
    const newRemainingWords = remainingWords.slice(1)

    if (nextWord) {
      setCurrentWord(createWord(nextWord))
    } else {
      setCurrentWord(null)
    }

    setRemainingWords(newRemainingWords)
    setUserInput('')
  }

  function handleGuess (event) {
    event.preventDefault()

    if (gameOver) {
      return
    }

    if (userInput.trim().toLowerCase() === currentWord.answer.toLowerCase()) {
      setPoints(points + 1)
      goToNextWord()
    } else {
      setStrikes(strikes + 1)
      setUserInput('')
    }
  }

  function handlePass () {
    if (passes > 0 && !gameOver) {
      setPasses(passes - 1)
      goToNextWord()
    }
  }

  function handleRestart () {
    const newGame = getNewGame()

    setPoints(newGame.points)
    setStrikes(newGame.strikes)
    setPasses(newGame.passes)
    setUserInput(newGame.userInput)
    setCurrentWord(newGame.currentWord)
    setRemainingWords(newGame.remainingWords)
  }

  return (
    <main>
      <h1>Scramble</h1>

      <p>Points: {points}</p>
      <p>Strikes: {strikes} / 3</p>
      <p>Passes: {passes}</p>

      {gameOver ? (
        <section>
          <h2>Game Over</h2>
          <p>Your final score is {points}.</p>
          <button onClick={handleRestart}>Restart</button>
        </section>
      ) : (
        <section>
          <h2>{currentWord.scrambled}</h2>

          <form onSubmit={handleGuess}>
            <label htmlFor="guess">Your guess:</label>
            <input
              id="guess"
              type="text"
              value={userInput}
              onChange={(event) => setUserInput(event.target.value)}
            />

            <button type="submit">Submit</button>
            <button type="button" onClick={handlePass} disabled={passes === 0}>
              Pass
            </button>
          </form>
        </section>
      )}
    </main>
  )
}

const rootElement = document.createElement('div')
document.body.appendChild(rootElement)

const root = ReactDOM.createRoot(rootElement)
root.render(<App />)
