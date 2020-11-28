import React, {useEffect, useState} from 'react';

import Product from './Product.js';
import OrderPage from "./OrderPage";
import ThankYouPage from './ThankYouPage';
import '../stylesheet.css';
import AdminPage from "./AdminPage";

function ProductPage() {
    const [products, setProduct] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [page,setPage] = useState(0);
    //Page su nasledovne - 0 product page,1 order page,2 thank you page, 3 admin page

    var shoppingCart = [];

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
                test={addItemToCart}/>
        });
    }

    function addItemToCart(id) {
        shoppingCart.push(id);
        console.log(shoppingCart);
    }

    switch (page) {
        case 0: {
            if (isLoaded) {
                return (
                    <div>
                        <button onClick={() => setPage(1)}>
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
                    shoppingCart={shoppingCart}
                    setPage={setPage}
                />
            );
        }
        case 2: {
            return <ThankYouPage/>
        }
        case 3: {
            return <AdminPage/>
        }
        default:
        {
            return <p>Nothing found!?</p>
        }
    }

}

export default ProductPage;