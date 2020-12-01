import React, {useEffect, useState} from 'react';

import Product from './Product.js';
import OrderPage from "./OrderPage";
import ThankYouPage from './ThankYouPage';
import '../stylesheet.css';
import AdminPage from "./AdminPage";

//Tu sa ukladaju vsetky aktualne polozky v kosiku
var shoppingCart = [];

//Hlavna stranka so vsetkymi produktami
function ProductPage() {
    const [products, setProduct] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    //Page su nasledovne - 0 product page,1 order page,2 thank you page, 3 admin page
    const [page, setPage] = useState(0);

    //Ziskanie produktov z DB
    useEffect(() => {
        fetch('/data')
            .then(res => res.json())
            .then(data => {
                setProduct(data);
                setIsLoaded(true);
            });
    }, []);

    //Namapovanie ziskanych produktov
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

    //Pridanie polozky do nakupneho kosiku
    function addItemToCart(product) {
        let found = false;

        for (let i = 0; i < shoppingCart.length; i++) {
            if (shoppingCart[i].id === product.id) {
                shoppingCart[i].count++;
                found = true;
                break;
            }
        }

        if (!found) {
            shoppingCart.push(product);
        }
    }

    //Otvorenie stranku objednavky ak nie je kosik prazdny
    function openOrderMenu() {
        if (shoppingCart.length <= 0) {
            alert("Nakupny kosik je prazdny!");
        } else {
            setPage(1)
        }
    }

    //Otvorenie stranky na zaklade aktualnej premennej
    //Page su nasledovne - 0 product page,1 order page,2 thank you page, 3 admin page
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
        default: {
            return <p>Page not found. Try refreshing the page!</p>
        }
    }

}

export default ProductPage;