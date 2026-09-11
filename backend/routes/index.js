const express = require ('express')
//const productsRouter = require('./productosRouter')
const userTr = require('./user.router')
const companyTr = require('./company.router')
const ingresoTr = require('./ingreso.router')
const correlativoTr = require('./correlativo.router')



function routerApi(app){
  const router = express.Router();
  app.use('/api/v1', router)

 // router.use('/productos',productsRouter  )
  router.use('/user',userTr )
  router.use('/company',companyTr )
  router.use('/ingreso',ingresoTr )
  router.use('/correlativo',correlativoTr )

}


module.exports=routerApi;
