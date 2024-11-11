const express = require('express');
const userService = require('../serices/user.service');
const validatorHandleer = require('../middlewares/validator.handler');
const { getUserSchema, createUserSchema } = require('../schemas/user.schema');

const router = express.Router();
const service = new userService();


router.get('/',(req,res)=>{
  res.json([{
    name:'producto 1',
    precio:1000
  },{
    name:'Producto 2',
    precio: 2222
  }])
})


router.get('/:id',validatorHandleer(getUserSchema,'params'),
async(req, res, next)=>{
  try{
    const{ id }= req.params;
    const user= await service.findOne(id);
    res.json({user})
  }catch(error){
    next(error)
  }
}
)

router.post('/',validatorHandleer(createUserSchema,'body'),
async(req, res, next)=>{
  try{
    const body = req.body;
    const user = await service.create(body);
    res.json({user})
  }catch(error){
    next(error)
  }
}
)

module.exports=router;
