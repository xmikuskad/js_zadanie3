import React from 'react';

function Product(obj) {
    return (
        <tr>
            <td>
                <h2>{obj.name}</h2>
                <p>{obj.description}</p>
                <p><b>Cena: </b>{obj.price}</p>
                <button onClick={()=>obj.test(obj.id)}>Pridat do kosika</button>
            </td>
            <td>
                <img width="300" src={obj.image}/>
            </td>
        </tr>
    );

}


export default Product;