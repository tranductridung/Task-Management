const moment = require("moment");
require("dotenv").config();

const calculateExpirationTime = () => {
  const expiredTime = process.env.EXPIRED_REFRESH_TOKEN;

  if (!expiredTime) {
    throw new Error("EXPIRED_REFRESH_TOKEN is not defined in .env");
  }

  const currentTime = moment();

  const match = expiredTime.match(/^(\d+)([a-zA-Z]+)$/);

  if (!match) {
    throw new Error("Invalid EXPIRED_REFRESH_TOKEN format in .env");
  }

  const value = parseInt(match[1], 10);
  const unit = match[2];

  if (!["d", "h", "m", "s"].includes(unit)) {
    throw new Error("Invalid time unit in EXPIRED_REFRESH_TOKEN");
  }

  const expirationTime = currentTime.add(value, unit);
  return expirationTime;
};

module.exports = calculateExpirationTime;
