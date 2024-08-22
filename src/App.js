import React, { useState, useEffect } from 'react';
import './App.css';
import { Questionare } from './components';

const API_URL = 'https://opentdb.com/api.php?amount=10&category=18';

function App() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showAnswers, setShowAnswers] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const formattedQuestions = data.results.map(question => ({
          ...question,
          answers: [question.correct_answer, ...question.incorrect_answers].sort(() => Math.random() - 0.5)
        }));
        setQuestions(formattedQuestions);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleAnswer = (ans) => {
    if (!showAnswers) {
      if (ans === questions[currentIndex].correct_answer) {
        setScore(prevScore => prevScore + 1);
      }
    }
    setShowAnswers(true);
  };

  const handleNextQuestion = () => {
    setShowAnswers(false);
    setCurrentIndex(prevIndex => prevIndex + 1);
  };

  if (loading) {
    return <h2 className="text-2xl text-white font-bold">Loading..</h2>;
  }

  if (error) {
    return <h2 className="text-2xl text-white font-bold">Error: {error}</h2>;
  }

  if (currentIndex >= questions.length) {
    return <h1 className='text-3xl text-white font-bold'>Game Ended! Your score is {score}.</h1>;
  }

  return (
    <div className="container">
      <Questionare
        handleNextQuestion={handleNextQuestion}
        showAnswers={showAnswers}
        data={questions[currentIndex]}
        handleAnswer={handleAnswer}
      />
    </div>
  );
}

export default App;
