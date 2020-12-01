import React, {useEffect, useState} from 'react';

import Product from './Product.js';
import OrderPage from "./OrderPage";
import ThankYouPage from './ThankYouPage';
import '../stylesheet.css';
import AdminPage from "./AdminPage";

var shoppingCart = [];
function ProductPage() {
    const [products, setProduct] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [page,setPage] = useState(0);
    //Page su nasledovne - 0 product page,1 order page,2 thank you page, 3 admin page

    useEffect(() => {
        fetch('/data')
            .then(res => res.json())
            .then(data => {
                setProduct(data);
                setIsLoaded(true);
            });
    }, []);

    function renderProducts() {
        return products.map((product, index) => {
            return <Product
                key={index}
                id={product.id}
                name={product.name}
                description={product.description}
                image={product.image}
                price={product.price}
                addItem={addItemToCart}/>
        });
    }

    function addItemToCart(product) {

        var found = false;

        for(var i=0;i<shoppingCart.length;i++)
        {
            if(shoppingCart[i].id === product.id) {
                shoppingCart[i].count++;
                found = true;
                break;
            }
        }

        if(!found) {
            shoppingCart.push(product);
        }
    }

    function removeItemFromCart(position,count) {
        console.log(position+" "+count);
        console.log('LEN '+shoppingCart.length);
        shoppingCart = shoppingCart.splice(position,count);
        console.log('AFTER '+shoppingCart.length);
    }

    function openOrderMenu()
    {
        if(shoppingCart.length<=0)
        {
            alert("Nakupny kosik je prazdny!");
        }
        else
        {
            setPage(1)
        }
    }

    switch (page) {
        case 0: {
            if (isLoaded) {
                return (
                    <div>
                        <button onClick={() => openOrderMenu()}>
                            Nakupny kosik
                        </button>
                        <button onClick={() => setPage(3)}>
                            Admin menu
                        </button>
                        <table className='productTable'>
                            <tbody>
                            {renderProducts()}
                            </tbody>
                        </table>
                    </div>
                );
            } else {
                return <div>Loading...</div>
            }
        }
        case 1: {
            return (
                <OrderPage
                    cart={shoppingCart}
                    setPage={setPage}
                    removeItem={removeItemFromCart}
                />
            );
        }
        case 2: {
            return <ThankYouPage
                setPage={setPage}
                />
        }
        case 3: {
            return <AdminPage
                setPage={setPage}
            />
        }
        default:
        {
            return <p>Nothing found!?</p>
        }
    }

}

export default ProductPage;