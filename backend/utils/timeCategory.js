function getTimeCategory(startTime) {
  if (!startTime) return "unknown";

  const hour = new Date(startTime).getHours(); // ✅ FIX

  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  if (hour < 21) return "evening";
  return "night";
}

module.exports = { getTimeCategory };