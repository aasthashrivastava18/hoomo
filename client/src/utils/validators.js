export const isEmailValid = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const isPasswordValid = (password) => {
  // Minimum 6 characters, at least one uppercase, one lowercase and one number
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
  return regex.test(password);
};

export const isPhoneValid = (phone) => {
  // Indian phone number validation (10 digits)
  const regex = /^[6-9]\d{9}$/;
  return regex.test(phone);
};

export const isNotEmpty = (value) => {
  return value && value.trim() !== '';
};
