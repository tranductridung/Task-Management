const constants = require("../Constant");

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;

  switch (statusCode) {
    case constants.BAD_REQUEST:
      res.json({
        success: "false",
        message: err.message,
        errorCode: res.statusCode,
      });
      break;

    case constants.NOT_FOUND:
      res.json({
        success: "false",
        message: err.message,
        errorCode: res.statusCode,
      });
      break;

    case constants.UNAUTHORIZED:
      res.json({
        success: "false",
        message: err.message,
        errorCode: res.statusCode,
      });
      break;
    case constants.FORBIDDEN:
      res.json({
        success: "false",
        message: err.message,
        errorCode: res.statusCode,
      });
      break;
    case constants.SERVER_ERROR:
      res.json({
        success: "false",
        message: err.message,
        errorCode: res.statusCode,
      });
      break;
    default:
      res.json({
        success: "false",
        message: err.message,
        errorCode: res.statusCode,
      });
      break;
  }
};

module.exports = errorHandler;
