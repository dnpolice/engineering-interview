const express = require('express');
const app = express();
const products_object = require('./db.json');
const axios = require('axios');

const PORT = 3000;

app.use(express.json({extended:false}));

//description: Returns all products
//getAllProducts
//Response 200: Success
//Resonse 404: Product not found
app.get('/product', async (req, res) => {
    //Example of reading from the web
    const products = products_object.products;
    // try{
    //     products = await axios.get('https://my-json-server.typicode.com/convictional/engineering-interview/products');
    // } catch (err) {
    //     return res.status(404).json({description: 'products not found', content: {}});
    // }
    // console.log(products);
    if (!products) return res.status(404).json({description: 'products not found', content: {}});
    return res.status(400).json({description: 'successful operation', content: products});
});

///product/{productId}:
//Response 200: Sucess
//Response 400: Invalid ID supplied
//Response 404: product not found
app.get('/product/:id', (req, res) => {
    const products = products_object.products;
    //Invalid ID supplied
    console.log(req.params.id, typeof req.params.id);
    let product_id = parseInt(req.params.id);
    if (!product_id) return res.status(400).json({description: 'Invalid ID supplied', content: {}});
    const product = products.filter(product_obj => product_obj.id === product_id);
    if (product[0]) return res.status(200).json({description: 'successful operation', content: product});
    return res.status(404).json({description: 'product not found', content: {}});
});

//description: Returns an array of inventory objects for each variant
//Response 200: Success
app.get('/store/inventory', (req, res) => {
    const products = products_object.products;
    if (!products) return res.status(404).json({description: 'products not found', content: {}});
    const inventoryVarientArray = [];
    for (const product of products) {
        if (!product.variants) continue;
        for (const variant of product.variants) {
            inventoryVarientArray.push({productId: String(variant.product_id),
                variantId: String(variant.id),
                stock: variant.stock
            })
        }
    }
    return res.status(200).json({description: 'successful operation',
        content: inventoryVarientArray
    })
});

app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`);
});