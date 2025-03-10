import React, { useState, useEffect } from 'react';
import './Questions.css';
import { RANGE_QUESTIONS, FREE_QUESTIONS, BASIC_QUESTIONS, BINARY_QUESTIONS } from './config';
import landing from '../../assets/images/animals/landing.jpg';


function Questions() {
  const allQuestions = [
    ...RANGE_QUESTIONS.map((q, index) => ({
      type: 'range',
      id: q.name,
      question: q.rephrased_version,
      image: null
    })),
    ...BINARY_QUESTIONS.map((q, index) => ({
      type: 'binary',
      id: q.name,
      question: q.question,
      options: q.options,
      image: null
    })),
    ...FREE_QUESTIONS.map((q, index) => ({
      type: 'free',
      id: q.name,
      question: q.question,
      image: null
    })),
    ...BASIC_QUESTIONS.map((q, index) => ({
      type: 'basic',
      id: q.name,
      question: q.question,
      image: null
    })),
    {
      type: 'email',
      id: 'email',
      question: 'Please enter your email address',
      image: null
    }
  ];

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(
    allQuestions.reduce((acc, q) => {
      acc[q.id] = q.type === 'range' ? 5 : '';
      return acc;
    }, {})
  );
  const [message, setMessage] = useState('');
  const [questionsWithImages, setQuestionsWithImages] = useState(allQuestions);

  useEffect(() => {
    const loadRandomImages = async () => {
      try {
        const animalImages = [landing];
        const updatedQuestions = allQuestions.map(q => {
          const randomIndex = Math.floor(Math.random() * animalImages.length);
          return {
            ...q,
            image: animalImages[randomIndex]
          };
        });
        setQuestionsWithImages(updatedQuestions);
      } catch (error) {
        console.error('Failed to load animal images:', error);
      }
    };

    loadRandomImages();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const isAgeValid = (age) => {
    const ageInt = parseInt(age, 10);
    return ageInt >= 15 && ageInt <= 100;
  };

  const isEmailValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isNicknameValid = (nickname) => {
    return nickname.length > 0 && nickname.length <= 20;
  };

  const handleButtonClick = (value, questionId) => {
    
    setFormData(prevData => ({
      ...prevData,
      [questionId]: value
    }));
    handleNext();
  };

  const handleNext = () => {
    const currentQuestion = questionsWithImages[currentStep];
    
    if (currentQuestion.type === 'basic' && currentQuestion.id === 'enter_your_age') {
      if (!isAgeValid(formData[currentQuestion.id])) {
        alert('Please enter a valid age between 15 and 100.');
        return;
      }
    }
    
    if (currentQuestion.type === 'basic' && currentQuestion.id === 'enter_your_nickname') {
      if (!isNicknameValid(formData[currentQuestion.id])) {
        alert('Please enter a nickname between 1 and 20 characters.');
        return;
      }
    }
    
    if (currentQuestion.type === 'email') {
      if (!isEmailValid(formData[currentQuestion.id])) {
        alert('Please enter a valid email address.');
        return;
      }
    }
    
    if (currentStep < questionsWithImages.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    
    // Final email validation before submission
    if (!isEmailValid(formData.email)) {
      alert('Please enter a valid email address before submitting.');
      return;
    }
    
    try {
      const response = await fetch('http://localhost:5000/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body:  JSON.stringify({ profile: formData })
      });
      const result = await response.json();
      if (response.ok) {
        setMessage('Thank you for answering. We will send you the results via email.');
      } else {
        setMessage(`Error: ${result.error}`);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  const renderQuestion = () => {
    const currentQuestion = questionsWithImages[currentStep];
    if (!currentQuestion) return null;

    return (
      <div className="question">
        <div className="progress-indicator">
          Question {currentStep + 1}/{questionsWithImages.length}
        </div>
        <label className="question-label" htmlFor={currentQuestion.id}>
          {currentQuestion.question}
        </label>
        <div className="input-container">
          {currentQuestion.type === 'range' ? (
            <div className="button-group">
              <button
                type="button"
                onClick={() => handleButtonClick(0, currentQuestion.id)}
              >
                Not true at all
              </button>
              <button
                type="button"
                onClick={() => handleButtonClick(3.3, currentQuestion.id)}
              >
                Meh
              </button>
              <button
                type="button"
                onClick={() => handleButtonClick(6.6, currentQuestion.id)}
              >
                Kind of true
              </button>
              <button
                type="button"
                onClick={() => handleButtonClick(10, currentQuestion.id)}
              >
                Yes! That is me
              </button>
            </div>
          ) : currentQuestion.type === 'binary' ? (
            <div className="button-group">
              {currentQuestion.options.map((option, index) => (
                <button
                  type="button"
                  key={index}
                  onClick={() => handleButtonClick(option, currentQuestion.id)}
                >
                  {option}
                </button>
              ))}
            </div>
          ) : currentQuestion.type === 'free' ? (
            <textarea
              id={currentQuestion.id}
              name={currentQuestion.id}
              value={formData[currentQuestion.id]}
              onChange={handleChange}
              rows={5}
              cols={40}
              placeholder="Write as much as you want"
              required
            />
          ) : currentQuestion.type === 'email' ? (
            <input
              type="email"
              id={currentQuestion.id}
              name={currentQuestion.id}
              value={formData[currentQuestion.id]}
              onChange={handleChange}
              required
            />
          ) : (
            <input
              type="text"
              id={currentQuestion.id}
              name={currentQuestion.id}
              value={formData[currentQuestion.id]}
              onChange={handleChange}
              required
            />
          )}
        </div>
      </div>
    );
  };

  const currentQuestion = questionsWithImages[currentStep];
  const appStyle = currentQuestion && currentQuestion.image ? {
    backgroundImage: `url(${currentQuestion.image})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  } : {};

  return (
    <div className="Questions" style={appStyle}>
      <label className="app-title">2Genders - Find Your Match</label>
      <div className="progress-indicator">
        Question {currentStep + 1}/{questionsWithImages.length}
      </div>
      {message ? (
        <p>{message}</p>
      ) : (
        <form onSubmit={currentStep === questionsWithImages.length - 1 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
          {renderQuestion()}
          <div className="buttons">
            <div>
              {currentStep === questionsWithImages.length - 1 ? (
                <button
                  type="submit"
                  className="submit-button"
                  onClick={handleSubmit}
                >
                  Submit
                </button>
              ) : (
                (currentQuestion &&
                  (currentQuestion.type === 'basic' ||
                    currentQuestion.type === 'free' ||
                    currentQuestion.type === 'email')) && (
                  <button
                    type="button"
                    className="next-button"
                    onClick={handleNext}
                  >
                    Next
                  </button>
                )
              )}
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

export default Questions;