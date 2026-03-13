const express = require('express')
const Pool = require('pg-pool')


const app = express()
const pool = new Pool({
    connectionString: "postgresql://postgres:Shogaro59!@localhost/docker_products",
})

port = 5002

app.get('/', (req, res) => {
    res.status(200).json({message: 'Welcome to the Products'})
})

app.get('/products', async (req, res) => {
    try{
        const response = await pool.query('SELECT * FROM products')

        const allProducts = response.rows

        res.status(200).json(allProducts)
    }catch(err){
        console.error(err)
        res.status(500).json({message: 'Something went wrong'})
    }
})

app.get('/products/:id', async (req, res) => {
    try{
        const productID = req.params.id
        const response = await pool.query('SELECT * FROM products WHERE id=$1', [productID])

        const product = response.rows[0]

        res.status(200).json(product)
    }catch(err){
        console.error(err)
        res.status(500).json({message: 'Something went wrong'})
    }
})

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})