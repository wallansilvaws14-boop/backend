function normalizeText(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

function calculateResult(activity, answersMap) {
  let correctCount = 0;
  let score = 0;

  const answers = activity.questions.map((q) => {
    const userAnswer = String(answersMap[q._id] || "").trim();
    const isCorrect = normalizeText(q.correctAnswer) === normalizeText(userAnswer);
    const pointsEarned = isCorrect ? (q.points || 10) : 0;

    if (isCorrect) {
      correctCount += 1;
      score += pointsEarned;
    }

    return {
      questionId: String(q._id),
      answer: userAnswer,
      isCorrect,
      pointsEarned
    };
  });

  score += 20;

  const totalQuestions = activity.questions.length || 1;
  const accuracy = Math.round((correctCount / totalQuestions) * 100);

  let starsEarned = 1;
  if (accuracy >= 70) starsEarned = 2;
  if (accuracy >= 90) starsEarned = 3;

  return {
    answers,
    score,
    accuracy,
    starsEarned
  };
}

module.exports = { calculateResult };