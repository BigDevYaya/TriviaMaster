import checkImg from '../assets/resources/Check_round_fill.svg'
import WrongImg from '../assets/resources/Close_round_fill.svg'
// import questions from '../assets/questions.json'
import toast from 'react-hot-toast'
import { useState, useEffect } from 'react'

const CountryQuiz = () => {
  // UseState hooks

    const [questions, setQuestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch questions from API
  const fetchQuestions = async () => {
    console.log('fetching questions.....')
    setIsLoading(true);
    try {
      const res = await fetch('https://the-trivia-api.com/v2/questions?limit=10&category=general_knowledge&difficulty=easy');
      if (!res.ok){
        throw new Error(`HTTP error! status: ${res.status}`)
      }
      const data = await res.json();
      console.log('Raw data: ', data)
      const formatted = data.map(q => ({
        question: q.question.text,
        correctAnswer: q.correctAnswer,
        options: [...q.incorrectAnswers, q.correctAnswer].sort(() => Math.random() - 0.5)
      }));
      console.log('Formatted data: ', formatted)
      setQuestions(formatted);
      setStartQuiz(true);
    } catch (err) {
      console.error('Failed to fetch questions:', err);
      toast.error('Failed to fetch questions. Check your internet connection')
    } finally {
      setIsLoading(false);
    }
  };

    const [currentIndex, setCurrentIndex] = useState(() => {
      const saved = sessionStorage.getItem('currentIndex')
      return saved ? JSON.parse(saved) : 0

      // return 0
    });
    const [selectedOption, setSelectedOption] = useState(() => {
      const saved = sessionStorage.getItem('selectedOption')

      return saved ? JSON.parse(saved) : null

      // return null
    });
    const [showAnswer, setShowAnswer] = useState(() => {
      const saved = sessionStorage.getItem('showAnswer')
      return saved ? JSON.parse(saved) : false

      // return false
    });
    const [score, setScore] = useState(
      () => {
        const saved = sessionStorage.getItem('score')
        return saved ? JSON.parse(saved) : 0

        // return 0
      }
    )
    const [answeredQuestions, setAnsweredQuestions] = useState(() => {
      const saved = sessionStorage.getItem('answeredQuestions')

      return saved ? JSON.parse(saved) : {}
      // return {}
    })

    const [startQuiz, setStartQuiz] = useState(() => {
      const saved = sessionStorage.getItem('startQuiz')

      return saved ? JSON.parse(saved) : false

    });

    const currentQuestion = questions[currentIndex]
    // console.log(currentQuestion)

    const isQuizComplete = Object.keys(answeredQuestions).length === questions.length

    // Functions

    function resetQuiz() {
    setCurrentIndex(0)
    setSelectedOption(null)
    setShowAnswer(false)
    setScore(0)
    setAnsweredQuestions({})
    setStartQuiz(false)
    sessionStorage.clear()
  }

    function handleOptionClick(option) {
        if(!showAnswer && !answeredQuestions[currentIndex]){
          setSelectedOption(option);
          setShowAnswer(prev => !prev)
            if(option === currentQuestion.correctAnswer){
              setScore(prev => prev + 1)
            }
        }
        setAnsweredQuestions(
          prev => ({
            ...prev,
            [currentIndex] : true
          })
        )
    }


    function handleNext() {
        if(currentIndex < (questions.length - 1)){
          const nextIndex = currentIndex + 1
          setCurrentIndex(nextIndex)
          // setShowAnswer(false)
          setShowAnswer(!!answeredQuestions[nextIndex]);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            return
        }
    }

    function handlePrev() {
      if(currentIndex > 0 ){
        const prevIndex = currentIndex - 1;
        setCurrentIndex(prevIndex);
        // console.log(prevIndex)
        setShowAnswer(!!answeredQuestions[prevIndex]);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        return
      }
    }

    // Useeffects

    useEffect(() => {
      sessionStorage.setItem('currentIndex', JSON.stringify(currentIndex))

      sessionStorage.setItem('score', JSON.stringify(score))

      sessionStorage.setItem('showAnswer', JSON.stringify(showAnswer))

      sessionStorage.setItem('answeredQuestions', JSON.stringify(answeredQuestions))

      sessionStorage.setItem('selectedOption', JSON.stringify(selectedOption))

      sessionStorage.setItem('startQuiz', JSON.stringify(startQuiz))
    }, [
      currentIndex,
      score,
      showAnswer,
      answeredQuestions,
      selectedOption,
      startQuiz
    ])


    useEffect(() => {
  function handleKeyDown(e) {
    if (e.key === 'ArrowRight') {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1)
        setShowAnswer(false)
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else if (e.key === 'ArrowLeft') {
      if (currentIndex > 0) {
        const prevIndex = currentIndex - 1;
        setCurrentIndex(prevIndex);
        setShowAnswer(!!answeredQuestions[prevIndex]);
        window.scrollTo({ top: 0, behavior: 'smooth' });

      }
    }
  }

  document.addEventListener('keydown', handleKeyDown)
  return () => {
    document.removeEventListener('keydown', handleKeyDown)
  }
}, [currentIndex, questions.length])


  return (
    
    !startQuiz ? 
    <div className='text-center'>
      <h1 className="text-4xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent">
            Trivia Master
      </h1>
      <p className="text-gray-300 text-lg mb-8">
            Challenge yourself with fascinating questions from general knowledge
          </p>
      <button 
      className='px-5 py-3 bg-gradient-to-br from-pink-400 to-violet-400 rounded-xl text-gray-300 cursor-pointer font-bold text-2xl hover:tracking-widest hover:transition-all hover:ease-in-out hover:duration-200 hover:shadow'
      onClick={fetchQuestions}
      disabled={isLoading}>{isLoading ? 'Loading...' : 'Start Quiz'}</button> 
    </div>
    :
    <div className='flex flex-col text-gray-200 ld:w-2/3 font-bold text-xl items-center w-3/4'>

        {/* {Score div} */}

        <div className='flex items-center mb-6 justify-between w-full'>
            <h2 className='font-bold text-2xl md:text-3xl bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent'>
              Trivia Master
            </h2>
            <div className="flex items-center gap-4">
              <p className='bg-gradient-to-r from-pink-400 to-violet-400 px-4 py-2 text-sm md:text-xl rounded-full text-white animate-pulse'>
                🏆 {score} / {questions.length}
              </p>
              {isQuizComplete && (
                <button
                  onClick={resetQuiz}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg text-sm transition-colors"
                >
                  Reset Quiz
                </button>
              )}
            </div>
          </div>

        {/* Questions and answer Container */}

        <div className='grid grid-cols-1 place-items-center my-6 bg-gray-400/10 lg:py-12 lg:px-16 md:py-10 md:px-12 px-6 py-8 rounded-2xl gap-6 mx-auto w-full overflow-hidden animate-slideLeft'>
        {/* Questions dots container */}
            <ul className='flex justify-center mb-6 items-center gap-2 flex-wrap'>
          {questions.map((_, idx) => (
            <li
              key={idx}
              className={`w-10 h-10 rounded-full cursor-pointer flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    answeredQuestions[idx]
                      ? 'bg-gradient-to-br from-green-400 to-green-600 text-white'
                      : idx === currentIndex
                      ? 'bg-gradient-to-br from-pink-400 to-violet-400 text-white'
                      : 'bg-gray-600/50 text-gray-400 hover:bg-gray-500/50'
                  }`}
              onClick={() => {
                setCurrentIndex(idx)
                setShowAnswer(false)
                window.scrollTo({ top: 0, behavior: 'smooth' });  
              }}
            >
              {idx + 1}
            </li>
          ))}
        </ul>


            <p className='transition-all duration-300 ease-in'>{currentQuestion.question}</p>
            <ul className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 w-full max-w-2xl'>
        {currentQuestion.options.map((opt, i) => {
            let bg = 'bg-gray-800'
            let icon = null

            if (showAnswer) {
              if (opt === currentQuestion.correctAnswer) {
                bg = 'bg-green-700'
                icon = checkImg
              } else if (opt === selectedOption && opt !== currentQuestion.correctAnswer) {
                bg = 'bg-red-700'
                icon = WrongImg
              }
            }

            return (
              <li
                className={`${bg} px-6 py-4 rounded-xl flex items-center gap-3 cursor-pointer transition-all duration-300 border border-gray-600/30 ${showAnswer ? 'pointer-events-none opacity-70' : ''}`}
                key={i}
                onClick={() => {
                  handleOptionClick(opt)
                }}
              >
                {icon && <img src={icon} alt='' className='w-5 h-5 ' />}
                <span className='font-medium'>{opt}</span>
              </li>
            )
          })}
            </ul>

            {isQuizComplete && (
              <div className="mt-8 text-center">
                <h3 className="text-2xl font-bold mb-2 text-white">Quiz Complete!</h3>
                <p className="text-lg text-gray-300">
                  Your final score: <span className="text-pink-400 font-bold">{score}</span> out of <span className="text-violet-400 font-bold">{questions.length}</span>
                </p>
                <p className="text-md text-gray-400 mt-2">
                  {score === questions.length ? "Perfect! 🎉" : 
                   score >= questions.length * 0.8 ? "Great job! 👏" :
                   score >= questions.length * 0.6 ? "Good effort! 👍" : "Keep practicing! 📚"}
                </p>
              </div>
            )}
        </div>

          {/* Navigate Buttons */}

        <div className='flex justify-between w-full'>
          <button 
          disabled={currentIndex === 0}
          className={`px-5 py-3 rounded-xl ${
                            currentIndex === 0
                              ? 'bg-gray-500 cursor-not-allowed'
                              : 'bg-gradient-to-br from-pink-400 to-violet-400'
                          }`}
          onClick={() => handlePrev()} >Previous</button>
          <button 
          disabled={currentIndex >= questions.length - 1}
          className={`px-5 py-3 rounded-xl ${
                            currentIndex >= questions.length - 1
                              ? 'bg-gray-500 cursor-not-allowed'
                              : 'bg-gradient-to-br from-pink-400 to-violet-400'
                          }`}
          onClick={() => {
            handleNext()
          }}>Next</button>
        </div>
    </div>
  )
}

export default CountryQuiz