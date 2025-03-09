import React, { useState, useEffect } from 'react';
import './Questions.css';
import { BINARY_QUESTIONS, FREE_QUESTIONS, BASIC_QUESTIONS } from './config';
import { Button } from '@material-ui/core';
import as1 from '../../assets/images/animals/as1.png';
import as2 from '../../assets/images/animals/as2.jpg';
import as3 from '../../assets/images/animals/as3.webp';

function Questions() {
  const allQuestions = [
    ...BINARY_QUESTIONS.map((q, index) => ({
      type: 'binary',
      id: `binary_${index + 1}`,
      question: q["Rephrased Version"],
      image: null
    })),
    ...FREE_QUESTIONS.map((q, index) => ({
      type: 'free',
      id: `free_${index + 1}`,
      question: q,
      image: null
    })),
    ...BASIC_QUESTIONS.map((q, index) => ({
      type: 'basic',
      id: `basic_${index + 1}`,
      question: q,
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
      acc[q.id] = q.type === 'binary' ? 5 : '';
      return acc;
    }, {})
  );
  const [message, setMessage] = useState('');
  const [questionsWithImages, setQuestionsWithImages] = useState(allQuestions);

  useEffect(() => {
    const loadRandomImages = async () => {
      try {
        const animalImages = [as1, as2, as3];
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

  const handleNext = () => {
    if (currentStep < questionsWithImages.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    try {
      const response = await fetch('http://localhost:5000/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
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
        <label className="question-label" htmlFor={currentQuestion.id}>{currentQuestion.question}</label>
        <div className="input-container">
          {currentQuestion.type === 'binary' ? (
            <input
              type="range"
              id={currentQuestion.id}
              name={currentQuestion.id}
              min="0"
              max="10"
              value={formData[currentQuestion.id]}
              onChange={handleChange}
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
      <label className="app-title">2Genders - Find your match</label>
      {message ? (
        <p>{message}</p>
      ) : (
        <form onSubmit={currentStep === questionsWithImages.length - 1 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
          {renderQuestion()}
          <div className="buttons">
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <div>
                {currentStep > 0 && <Button variant="contained" color="primary" onClick={handleBack}>Back</Button>}
              </div>
              <div>
                {currentStep < questionsWithImages.length - 1 && <Button variant="contained" color="primary" onClick={handleNext}>Next</Button>}
                {currentStep === questionsWithImages.length - 1 && <Button variant="contained" color="primary" onClick={handleSubmit}>Submit</Button>}
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

export default Questions;