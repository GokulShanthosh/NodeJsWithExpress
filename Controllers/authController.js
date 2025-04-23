const User = require("./../models/userModel");
const catchAsync = require("./../Utils/catchAsync");
const jwt = require("jsonwebtoken");
const CustomerError = require("./../Utils/CustomError");
const { log } = require("console");
const { promisify } = require("util");

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECERT_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  //helps to store only the required data by mentioning by field
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    passwordChangedAt: req.body.passwordChangedAt,
  });

  const token = signToken(newUser._id);

  res.status(201).json({
    status: "success",
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //1. Check if the email and password exists
  if (!email || !password) {
    return next(new CustomerError("Please enter email and password!", 400));
  }
  //2. Check if the user exists && password is correct
  const user = await User.findOne({ email }).select("+password");
  console.log(user);

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new CustomerError("Incorrect Username or Password", 401));
  }
  //3. If everything is ok, then send the token
  const token = signToken(user._id);
  res.status(201).json({
    status: "success",
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  //1. Getting token and check if it's there
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  // console.log(token);

  if (!token) {
    return next(new CustomerError("You are not logged in! please login", 401));
  }
  //2. Verification token
  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECERT_KEY
  );
  // console.log(decoded);

  //3. Check if the user still exists
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(
      new CustomerError(
        "The user belonging for this token no longer exsist",
        401
      )
    );
  }
  //4. Check if user changed password after the token was issued
  if (freshUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new CustomerError(
        "User changed password recently! Please log in again.",
        401
      )
    );
  }

  //Grand Access to protected route
  req.user = freshUser;
  next();
});
