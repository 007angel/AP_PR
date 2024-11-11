const express = require('express');
const getConection = require('../libs/postgres');
const ProductsService = require('./../serices/product.service');
const userService = require('./../serices/user.service')

const router = express.Router();
const service = new ProductsService();


router.get('/buscarArticulo/:id',async (req, res)=>{
  const { id }= req.params
  const articulo= await service.findOneArticulo(parseInt(id));
  res.json({articulo})
})

router.get('/filter',(req, res)=>{
  res.send('soy un filtro')

});


router.get('/', async(req, res)=>{
  const product = await service.find();
  res.json({product})

})

router.get('/productosfakers',(req, res)=>{
  const productos=[]
  const {size}=req.query
  const limit = size || 10;

  for (let index = 0; index < limit; index++){
    productos.push({
      name:faker.commerce.productName(),
      //name1:faker.commerce.productName(),
      price: parseInt(faker.commerce.price(),10),
      image:faker.image.imageUrl()
  });
  }

res.json({productos})
})



router.post('/', (req, res)=>{
  const body = req.body
  const newProduct = service.create(body)
  res.json({newProduct})
})

router.post('/crearArticulo', async(req, res)=>{
  const body = req.body
  const newProduct = await  service.insertArticulos(body)
  res.json({newProduct})
})


router.patch('/actualizarArticulos',async(req, res)=>{
  const body= req.body
  const eliminado = await service.updateArticulo(body)
  res.json({eliminado})
})

router.delete('/eliminarArticulos/:id',async(req, res)=>{

  const { id }= req.params;
  console.log(id)
  const eliminado = await service.deleteArticulo(id);
  console.log(eliminado)
  res.json({eliminado})
})

router.patch('/:id',(req, res)=>{
  const {id}=req.params
  const body = req.body
  res.json({
    message: 'update',
    data:body
  })
})

router.delete('./:id',(req, res)=>{
  const {id}=req.params
  const idDelete = service.delete(id)

})

module.exports=router;
