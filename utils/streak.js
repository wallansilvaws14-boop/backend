function updateStreak(student, completedDate) {
  const today = new Date(`${completedDate}T00:00:00`);
  const last = student.lastCompletedDate
    ? new Date(`${student.lastCompletedDate}T00:00:00`)
    : null;

  if (!last) {
    student.streakDays = 1;
    student.lastCompletedDate = completedDate;
    return student.streakDays;
  }

  const diffMs = today - last;
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return student.streakDays;
  }

  if (diffDays === 1) {
    student.streakDays += 1;
  } else {
    student.streakDays = 1;
  }

  student.lastCompletedDate = completedDate;
  return student.streakDays;
}

module.exports = { updateStreak };