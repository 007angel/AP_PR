const express = require ('express')
//const productsRouter = require('./productosRouter')
const userTr = require('./user.router')
const companyTr = require('./company.router')



function routerApi(app){
  const router = express.Router();
  app.use('/api/v1', router)

 // router.use('/productos',productsRouter  )
  router.use('/user',userTr )
  router.use('/company',companyTr )

}


module.exports=routerApi;
