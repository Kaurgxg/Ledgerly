const User = require('../models/User');
const crypto = require('crypto');
const generateToken = require('../utils/generateToken');
const { sendPasswordResetEmail } = require('../utils/sendEmail');

// @route POST /api/auth/register
// @desc  Register a user or admin account (admin requires ADMIN_ACCESS_CODE)
async function register(req, res, next) {
  try {
    const { name, username, email, password, role = 'user', adminCode } = req.body;

    if (!name || !username || !email || !password) {
      return res.status(400).json({ message: 'Name, username, email, and password are required.' });
    }
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
      return res.status(400).json({ message: 'Username must be 3-20 characters (letters, numbers, underscore).' });
    }

    const desiredRole = role === 'admin' ? 'admin' : 'user';
    if (desiredRole === 'admin') {
      if (!adminCode || adminCode !== process.env.ADMIN_ACCESS_CODE) {
        return res.status(403).json({ message: 'Invalid admin access code.' });
      }
    }

    const existing = await User.findOne({ username: username.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: 'That username is already taken.' });
    }

    const user = await User.create({
      name,
      username: username.toLowerCase(),
      email,
      password,
      role: desiredRole,
    });

    const token = generateToken(user);
    res.status(201).json({ token, user: user.toSafeObject() });
  } catch (err) {
    next(err);
  }
}

// @route POST /api/auth/login
// @desc  Log in; portal must match the account's role
async function login(req, res, next) {
  try {
    const { username, password, portal = 'user' } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
    }

    const user = await User.findOne({ username: username.toLowerCase() });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Incorrect username or password.' });
    }

    if (user.role !== portal) {
      const msg = portal === 'admin'
        ? "This account isn't an admin account. Switch to the User Portal to log in."
        : 'This is an admin account. Switch to the Admin Portal to log in.';
      return res.status(403).json({ message: msg });
    }

    const token = generateToken(user);
    res.json({ token, user: user.toSafeObject() });
  } catch (err) {
    next(err);
  }
}

// @route GET /api/auth/me
async function me(req, res) {
  res.json({ user: req.user.toSafeObject() });
}

// @route POST /api/auth/forgot-password
// @desc  Send a one-time password reset link without revealing whether an email exists.
async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;
    const response = { message: 'If an account matches that email, a password reset link has been sent.' };
    if (!email) return res.status(400).json({ message: 'Email is required.' });

    const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+resetPasswordToken +resetPasswordExpires');
    if (!user) return res.json(response);

    const rawToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(rawToken).digest('hex');
    user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);
    await user.save({ validateBeforeSave: false });

    const clientUrl = (process.env.CLIENT_URL || 'http://localhost:5173').split(',')[0].trim();
    const resetUrl = `${clientUrl}/reset-password/${rawToken}`;
    try {
      await sendPasswordResetEmail({ to: user.email, name: user.name, resetUrl });
    } catch (emailError) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save({ validateBeforeSave: false });
      throw emailError;
    }

    res.json(response);
  } catch (err) {
    next(err);
  }
}

// @route PUT /api/auth/reset-password/:token
// @desc  Set a new password using a valid one-time reset token.
async function resetPassword(req, res, next) {
  try {
    const { password, confirmPassword } = req.body;
    if (!password || !confirmPassword) return res.status(400).json({ message: 'New password and confirmation are required.' });
    if (password !== confirmPassword) return res.status(400).json({ message: 'Passwords do not match.' });

    const tokenHash = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken: tokenHash,
      resetPasswordExpires: { $gt: new Date() },
    }).select('+resetPasswordToken +resetPasswordExpires');
    if (!user) return res.status(400).json({ message: 'This reset link is invalid or has expired. Request a new one.' });

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.json({ message: 'Password updated. You can now log in.' });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, me, forgotPassword, resetPassword };
