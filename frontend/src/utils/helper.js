export const validateEmail = (email) => {
  const resgex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return resgex.test(email);
};

export const validateDate = (dueDate) => {
  const now = new Date();
  const inputDate = new Date(dueDate);

  return inputDate > now;
};

export const getInitials = (str) => {
  if (!str || typeof str !== "string") return "";
  const words = str.trim().split(/\s+/);
  const initials = words
    .slice(0, 2)
    .map((word) => (word[0] ? word[0].toUpperCase() : ""));

  return initials.join("");
};

// Format date from utc to datetime local
export const formatDate = (utcString) => {
  if (!utcString) return "";
  const date = new Date(utcString);
  const localISO = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);

  return localISO;
};
