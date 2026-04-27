function getAvailability(total, booked) {
  if (!total) return "available";

  const percent = (booked / total) * 100;

  if (percent < 50) {
    return {
      status: "available",
      label: "Available",
      color: "green",
    };
  }

  if (percent < 80) {
    return {
      status: "filling-fast",
      label: "Filling Fast",
      color: "orange",
    };
  }

  return {
    status: "almost-full",
    label: "Almost Full",
    color: "red",
  };
}

module.exports = { getAvailability }; 