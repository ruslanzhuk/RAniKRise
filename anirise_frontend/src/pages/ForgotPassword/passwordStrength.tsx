export const getPasswordStrength = (password: string) => {
  if (password.length < 8) return "Weak";
  if (/[A-Z]/.test(password) && /\d/.test(password)) return "Strong";
  return "Medium";
};
