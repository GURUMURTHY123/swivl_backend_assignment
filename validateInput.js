const validateInput = (req, res, next) => {
  const { firstName, lastName, phoneNumber, emailAddress } = req.body;

  // Check if fields are present
  if (!firstName || !lastName || !phoneNumber || !emailAddress) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Validation rules
  const nameRegex = /^[a-zA-Z\s]+$/;
  const phoneRegex = /^\+[0-9]{10,12}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
    return res.status(400).json({
      error: "First and Last names must be strings without special characters",
    });
  }

  if (
    !phoneRegex.test(phoneNumber) ||
    phoneNumber.length < 12 ||
    phoneNumber.length > 14
  ) {
    return res.status(400).json({
      error:
        'Phone number must start with "+" and be between 12 to 14 characters long',
    });
  }

  if (!emailRegex.test(emailAddress)) {
    return res.status(400).json({ error: "Invalid email address" });
  }

  next();
};

module.exports = validateInput;
