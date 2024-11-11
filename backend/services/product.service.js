const { faker } = require('@faker-js/faker');

//const getConection = require('../libs/postgres');
//const Pool = require('../libs/postgres.pool2')
const sequelize = require('../libs/sequelize')
class ProductsService {

    constructor() {
        this.products = [];
        this.generate()
/*         this.pool=Pool;
        this.pool.on('err',(err)=>{
          console.error(err)
        }) */
    }


    generate() {
        const limit = 100
        for (let index = 0; index < limit; index++) {
            this.products.push({
                id: faker.datatype.uuid(),
                name: faker.commerce.productName(),
                price: parseInt(faker.commerce.price(), 10),
                image: faker.image.imageUrl(),
            });
        }
    }

    create(data) {
        const newProduct = {
            id: faker.datatype.uuid(),
            ...data
        }
        this.products.push(newProduct);
        return newProduct;
    }

    async updateArticulo(data) {
 //       const client = await getConection();
       // const articulo = await this.pool.query('update public.articulos set nombre=$2, proveedor=$3 where articuloid=$1 returning*',[data.articuloid,data.nombre, data.proveedor]);
       const articulo = await this.pool.query('update public.articulos set nombre=$2, proveedor=$3 where articuloid=$1 returning*',[data.articuloid,data.nombre, data.proveedor]);
        return articulo.rows                    //UPDATE public.articulos SET articuloid=0, nombre='', proveedor='';

    }

    async deleteArticulo(id) {
        //const client = await getConection();
        const articulo =  await this.pool.query('delete from public.articulos where articuloid=$1 returning*', [id]);
        return articulo.rows;
    }

    async find() {
       // const client = await getConection();
        const [data, metadata] = await sequelize.query('Select * from Articulos')
        return {
          data,
          metadata
        }
    }

    async insertArticulos(data) {
        //const client = await getConection();
        const articulo = await this.pool.query('insert into public.articulos (articuloid, nombre, proveedor)values($1,$2,$3) returning*', [data.articuloid, data.nombre, data.proveedor]);
        return articulo.rows
    }

    findOne() {
        return this.products.find(item => item.id === id)

    }
    async findOneArticulo(id) {
       // const client = await getConection();
        const articulo = await this.pool.query('Select * from Articulos where articuloid=$1',[id])
        return articulo.rows

    }
    update(id, changes) {
        const index = this.findIndex(item => item.id === id)

        if (index === -1) {
            throw new error('product not found')
        }

        const product = this.products[index]
        this.products[index] = [
            ...product,
            ...changes,
        ]
        return this.products[index];

    }
    delete(id) {
        const index = this.products.findIndex(item => item.id === id)
        if (index === -1) {
            throw new Error('Product not Foud')
        }
        this.productos.splice(index, 1)
        return [id]
    }

}
module.exports = ProductsService
