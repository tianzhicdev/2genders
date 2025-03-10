import React, { useState, useEffect } from 'react';
import './Questions.css';
import { RANGE_QUESTIONS, FREE_QUESTIONS, BASIC_QUESTIONS, BINARY_QUESTIONS } from './config';
import landing from '../../assets/images/landing.jpg';


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
      <div className="question md:py-8">
        <div className="progress-indicator md:text-xl lg:text-2xl">
          Question {currentStep + 1}/{questionsWithImages.length}
        </div>
        <label className="question-label md:w-3/4 md:max-w-2xl md:text-2xl lg:text-3xl" htmlFor={currentQuestion.id}>
          {currentQuestion.question}
        </label>
        <div className="input-container md:my-12">
          {currentQuestion.type === 'range' ? (
            <div className="button-group md:gap-4 md:max-w-md lg:max-w-lg">
              <button
                type="button"
                onClick={() => handleButtonClick(0, currentQuestion.id)}
                className="bg-green-500 hover:opacity-80 md:py-4 md:text-xl touch-manipulation"
              >
                Not true at all
              </button>
              <button
                type="button"
                onClick={() => handleButtonClick(3.3, currentQuestion.id)}
                className="bg-green-600 hover:opacity-80 md:py-4 md:text-xl touch-manipulation"
              >
                Meh
              </button>
              <button
                type="button"
                onClick={() => handleButtonClick(6.6, currentQuestion.id)}
                className="bg-green-700 hover:opacity-80 md:py-4 md:text-xl touch-manipulation"
              >
                Kind of true
              </button>
              <button
                type="button"
                onClick={() => handleButtonClick(10, currentQuestion.id)}
                className="bg-green-800 hover:opacity-80 md:py-4 md:text-xl touch-manipulation"
              >
                Yes! That is me
              </button>
            </div>
          ) : currentQuestion.type === 'binary' ? (
            <div className="button-group md:gap-4 md:max-w-md lg:max-w-lg">
              {currentQuestion.options.map((option, index) => (
                <button
                  type="button"
                  key={index}
                  onClick={() => handleButtonClick(option, currentQuestion.id)}
                  className="bg-blue-500 hover:opacity-80 md:py-4 md:text-xl touch-manipulation"
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
              className="w-full p-2.5 mb-5 text-base md:p-4 md:text-lg lg:text-xl md:w-3/4 md:max-w-2xl"
            />
          ) : currentQuestion.type === 'email' ? (
            <input
              type="email"
              id={currentQuestion.id}
              name={currentQuestion.id}
              value={formData[currentQuestion.id]}
              onChange={handleChange}
              required
              className="w-full p-2.5 mb-5 text-base md:p-4 md:text-lg lg:text-xl md:w-3/4 md:max-w-2xl"
            />
          ) : (
            <input
              type="text"
              id={currentQuestion.id}
              name={currentQuestion.id}
              value={formData[currentQuestion.id]}
              onChange={handleChange}
              required
              className="w-full p-2.5 mb-5 text-base md:p-4 md:text-lg lg:text-xl md:w-3/4 md:max-w-2xl"
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
    backgroundRepeat: 'no-repeat',
    minHeight: '100vh',
    height: 'auto'
  } : {};

  return (
    <div className="Questions md:py-6 lg:py-8" style={appStyle}>
      <label className="app-title md:text-3xl lg:text-4xl">2Genders - Find Your Match</label>
      <div className="progress-indicator md:text-xl lg:text-2xl">
        Question {currentStep + 1}/{questionsWithImages.length}
      </div>
      {message ? (
        <p className="md:text-xl lg:text-2xl md:p-6 text-center bg-white bg-opacity-80 rounded-lg mx-auto max-w-2xl">{message}</p>
      ) : (
        <form onSubmit={currentStep === questionsWithImages.length - 1 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}
              className="md:h-auto flex flex-col justify-between">
          {renderQuestion()}
          <div className="buttons md:my-6">
            <div>
              {currentStep === questionsWithImages.length - 1 ? (
                <button
                  type="submit"
                  className="submit-button md:py-4 md:px-8 md:text-xl touch-manipulation"
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
                    className="next-button md:py-4 md:px-8 md:text-xl touch-manipulation"
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