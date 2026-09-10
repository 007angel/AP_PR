const boom = require('@hapi/boom')

function validatorHandleer(schemas, property){
  return(req, res, next)=>{
    const data = req[property]
    const { error }=schemas.validate(data, {abortEarly: false});
    if (error){
      const message = error.details.map(d => d.message).join(', ');
      return next(boom.badRequest(message));
    }
    next();
  }
}

module.exports=validatorHandleer
