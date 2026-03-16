const express = require('express');
const Pool = require("pg-pool");
const app = express();
const port = 5002

const pool = new Pool({
    connectionString: "postgresql://postgres:password@db_product/docker_products"
})
app.use(express.json());

app.get('/products', async (req, res) => {
    try{
        const result = await pool.query(`SELECT * FROM products`)

        const allProducts = result.rows

        res.status(200).json(allProducts)
    }catch(err){
        console.error(err)
        res.status(500).json({message:"Something went wrong"})
    }
})

app.get('/products/:id', async (req, res) => {
    try{
        const productId = req.params.id
        const result = await pool.query(`SELECT * FROM products WHERE id=$1`, [productId])

        const product = result.rows[0]

        res.status(200).json(product)
    }catch(err){
        console.error(err)
        res.status(500).json({message:"Something went wrong"})
    }
})

app.post('/products', async (req, res) => {
    try{
        const productData = req.body

        const result = await pool.query(`
        INSERT INTO products(name, price, stock) VALUES ($1, $2, $3)`, [productData.name, productData.price, productData.stock])

        const product = result.rows[0]

        res.status(200).json({message:"Product Added", data: product})
    }catch(err){
        console.error(err)
        res.status(500).json({message:"Something went wrong"})
    }
})

app.put('/products/:id', async (req, res) => {
    try{
        const productId = req.params.id
        const {name, price, stock} = req.body

        const result = await pool.query(`
        UPDATE products SET name=$1, price=$2, stock=$3 WHERE id=$4`, [name, price, stock, productId])

        const product = result.rows[0]
        res.status(200).json({message:"Product Updated", data: product})
    }catch(err){
        console.error(err)
        res.status(500).json({message:"Something went wrong"})
    }
})

app.delete('/products/:id', async (req, res) => {
    try{
        const productId = req.params.id

        const result = await pool.query(`DELETE FROM products WHERE id=$1`, [productId])

        res.status(200).json({message: "Product Removed"})
    }catch(err){
        console.error(err)
        res.status(500).json({message:"Something went wrong"})
    }
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})