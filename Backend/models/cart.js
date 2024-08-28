const fs=require('fs');
const path=require('path')

const DataFolder = path.join(path.dirname(process.mainModule.filename), 'data');
if (!fs.existsSync(DataFolder)){
    fs.mkdirSync(DataFolder);
}

const p = path.join(DataFolder, 'cart.json');

module.exports=class Cart{

    static addCartProduct(productId,productPrice){
        fs.readFile(p,(err,fileContent)=>{
            let cart={products:[],totalCartPrice:0}
            if(!err){
                cart=JSON.parse(fileContent);
            }
            let existingProductIndex=cart.products.findIndex(p=>p.id===productId);
            let existingProduct=cart.products[existingProductIndex];
            let updatedProduct;
            if(existingProduct){
                updatedProduct={...existingProduct};
                updatedProduct.qty=updatedProduct.qty+1;
                cart.products[existingProductIndex]=[updatedProduct];
                cart.totalCartPrice=cart.totalCartPrice+ +productPrice;
            }
            else{
                cart.products=[...cart.products,{id:productId,qty:1}]
                cart.totalCartPrice=cart.totalCartPrice+ +productPrice;
            }
            fs.writeFile(p,JSON.stringify(cart),err=>console.log(err));
            
        })
    }

}

