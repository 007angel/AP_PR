const express = require ('express')
const userTr = require('./user.router')
const companyTr = require('./company.router')
const ingresoTr = require('./ingreso.router')
const correlativoTr = require('./correlativo.router')
const ingresoDetalleTr = require('./ingreso-detalle.router')
const moduloTr = require('./modulo.router')
const anulacionTr = require('./anulacion.router')
const chatTr = require('./chat.router')
const ingresoExcelTr = require('./ingreso-excel.router')
const solicitudTr = require('./solicitud.router')
const clienteTr = require('./cliente.router')
const articuloTr = require('./articulo.router')

function routerApi(app){
  const router = express.Router();
  app.use('/api/v1', router)

  router.use('/user',userTr )
  router.use('/company',companyTr )
  router.use('/ingreso',ingresoTr )
  router.use('/correlativo',correlativoTr )
  router.use('/ingreso-detalle',ingresoDetalleTr )
  router.use('/modulo',moduloTr )
  router.use('/anulacion',anulacionTr )
  router.use('/chat',chatTr )
  router.use('/ingreso-excel',ingresoExcelTr )
  router.use('/solicitud',solicitudTr )
  router.use('/cliente',clienteTr )
  router.use('/articulo',articuloTr )

}


module.exports=routerApi;
