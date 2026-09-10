const boom = require('@hapi/boom')

function validatorHandleer(schemas, property){
  return(req, res, next)=>{
    const data = req[property]
    const { error }=schemas.validate(data, {abortEarly: false});
    if (error){
      return next(boom.badRequest(error));
    }
    next();
  }
}

module.exports=validatorHandleer
