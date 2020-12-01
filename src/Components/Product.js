import React from 'react';

//Jedna polozka v stranke produktov
function Product(obj) {

    const product = {};
    product.name = obj.name;
    product.id = obj.id;
    product.count = 1;
    product.price = obj.price;

    return (
        <tr>
            <td>
                <h2>{obj.name}</h2>
                <p>{obj.description}</p>
                <p><b>Cena: </b>{obj.price}</p>
                <button onClick={()=>obj.addItem(product)}>Pridat do kosika</button>
            </td>
            <td>
                <img width="300" src={obj.image}/>
            </td>
        </tr>
    );

}


export default Product;