const boom = require('@hapi/boom');

function logErrors(err, req, res, next){
  console.error(err);
  next(err);
}

function errorHandler(err, req, res, next){
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).json({
    message: err.message,
    stack: err.stack
  });
}

function boomErrorHandler(err, req, res, next){
  if (err.isBoom){
    const { output } = err;
    return res.status(output.status).json(output.payload);
  }
  next(err);
}

module.exports={logErrors,errorHandler,boomErrorHandler}
