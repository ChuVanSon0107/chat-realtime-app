function formatDateTime(dateString) {
  const date = new Date(dateString);
  const today = new Date();

  const isSameDay = (date.getDate() === today.getDate()
                  && date.getMonth() === today.getMonth()
                  && date.getFullYear() === today.getFullYear());

  if (isSameDay) {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }

  return date.toLocaleDateString([], {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export default formatDateTime;