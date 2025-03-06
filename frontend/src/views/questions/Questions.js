import React, { useState } from 'react';
import './Questions.css';
import { BINARY_QUESTIONS, FREE_QUESTIONS, BASIC_QUESTIONS } from './config';
import { Button } from '@material-ui/core';

function Questions() {
  // Combine all questions in the desired order
  const allQuestions = [
    ...BINARY_QUESTIONS.map((q, index) => ({
      type: 'binary',
      id: `binary_${index + 1}`,
      question: q["Rephrased Version"]
    })),
    ...FREE_QUESTIONS.map((q, index) => ({
      type: 'free',
      id: `free_${index + 1}`,
      question: q
    })),
    ...BASIC_QUESTIONS.map((q, index) => ({
      type: 'basic',
      id: `basic_${index + 1}`,
      question: q
    }))
  ];

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(
    allQuestions.reduce((acc, q) => {
      acc[q.id] = q.type === 'binary' ? 5 : ''; // Default value for binary questions is 5
      return acc;
    }, {})
  );
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < allQuestions.length - 1) {
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
      // const response = await fetch('http://marcus-mini.is-very-nice.org:3005/api/profile', {
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
    const currentQuestion = allQuestions[currentStep];
    if (!currentQuestion) return null;

    return (
      <div className="question">
        <label htmlFor={currentQuestion.id}>{currentQuestion.question}</label>
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
    );
  };

  return (
    <div className="Questions">
      <h1>2Genders - find your match</h1>
      {message ? (
        <p>{message}</p>
      ) : (
        <form onSubmit={currentStep === allQuestions.length - 1 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
          {renderQuestion()}
          <div className="buttons">
            {currentStep > 0 && <Button variant="contained" color="primary" onClick={handleBack}>Back</Button>}
            {currentStep < allQuestions.length - 1 && <Button variant="contained" color="primary" onClick={handleNext}>Next</Button>}
            {currentStep === allQuestions.length - 1 && <Button variant="contained" color="primary" onClick={handleSubmit}>Submit</Button>}
          </div>
        </form>
      )}
    </div>
  );
}

export default Questions;