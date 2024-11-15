const { ValidatiosnError} = required('sequelize')
const boom = require('@hapi/boom');


function logErrors(err, req, res, next){
  console.error(err),
  next(err)
}

function errorHandler(err, req, res, next){
  res.status(500).json({
    message: err.mesage,
    stack: err.stack
  })
}

function boomErrorHandler(err, req, res, next){
  if ( err.isBoom){
    const { output } = err;
    res.status(output.status).json(output.payload);
  }
  next(err)
}

module.exports={logErrors,errorHandler,boomErrorHandler}


