import fs from 'fs/promises';

const shuffle = (array) => {
  return array.sort(() => Math.random() - 0.5);
};

const getQuestions = async () => {
  try {
    const response = await fetch('https://the-trivia-api.com/v2/questions?limit=10&category=general_knowledge&difficulty=easy');
    const data = await response.json();

    const formatted = data.map(q => ({
      question: q.question.text,
      correctAnswer: q.correctAnswer,
      options: shuffle([...q.incorrectAnswers, q.correctAnswer])
    }));

    await fs.writeFile('./src/assets/questions.json', JSON.stringify(formatted, null, 2), 'utf-8');
    console.log('✅ questions.json has been updated with fresh trivia!');
  } catch (err) {
    console.error('❌ Failed to fetch or save questions:', err);
  }
};

getQuestions();
