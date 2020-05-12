const jwt = require("jsonwebtoken");
const config = require("../config/jwt-secret.config");

exports.createUserToken = (info) => {
  const token = jwt.sign({ ...info }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn
  });
  return token;
};

exports.createActiveEmailTokenWithId = (userId) => {
  const token = jwt.sign({ userId }, jwtSecretConfig.jwtSecretForActiveEmail, {
    expiresIn: "2 days",
  });
  return token;
};

exports.decodeActiveEmailToken = async (token) => {
  try {
    const result = await jwt.verify(
      token,
      jwtSecretConfig.jwtSecretForActiveEmail
    );
    return result;
  } catch {
    return null;
  }
};

exports.createResetPasswordTokenWithId = async (userId) => {
  const token = await jwt.sign(
    { userId },
    jwtSecretConfig.jwtSecretForResetPassword,
    { expiresIn: "2 days" }
  );
  return token;
};

exports.decodeResetPasswordToken = async (token) => {
  try {
    const result = await jwt.verify(
      token,
      jwtSecretConfig.jwtSecretForResetPassword
    );
    return result;
  } catch {
    return null;
  }
};

exports.checkRole = (role) => (req, res, next) => {
  if (!req.user) {
    return res
      .status(400)
      .send({ isSuccess: false, message: "Bạn cần đăng nhập để tiếp tục." });
  } else if (req.user.typeID !== role) {
    return res
      .status(400)
      .send({ isSuccess: false, message: "Bạn không có quyền truy cập." });
  }

  return next();
};
