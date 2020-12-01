import React, {useEffect, useState} from 'react';
import AdminTableItem from "./AdminTableItem";
import '../stylesheet.css';

//Stranka pre pouzivatela odmin
function AdminPage(obj) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [count, setCount] = useState(-1);
    const [orders, setOrders] = useState([]);

    //Ziskanie stavu pocitadla z DB
    useEffect(() => {
        fetch('/getIncrement')
            .then(res => res.json())
            .then(data => {
                setCount(data);
            });
    }, []);

    //Ziskanie vsetkych objednavok z DB
    useEffect(() => {
        fetch('/getOrders')
            .then(res => res.json())
            .then(data => {
                setOrders(data)
                setIsLoaded(true);
            });
    }, []);

    //Cakanie na data z pocitadla
    function getCount() {
        if (count >= 0) {
            return (<p>Pocet klikov na pocitadlo je: {count}</p>)
        } else {
            return (<p>Loading...</p>)
        }
    }

    //Namapovanie objednavok na triedu AdminTableItem
    function renderOrders() {
        return orders.map((order, index) => {
            return <AdminTableItem
                key={index}
                id={order.order_id}
                name={order.name}
                price={order.price}
                state={order.state}
            />
        });
    }

    //Zobrazenie html
    if (isLoaded) {
        return (
            <div>
                <h1>Admin stranka</h1>
                <button onClick={() => obj.setPage(0)}>Navrat na hlavnu stranku</button>
                <h3>Stav pocitadla</h3>
                {getCount()}
                <h3>Tabulka vsetkych objednavok</h3>
                <table className='adminTable'>
                    <thead>
                    <tr>
                        <th>ID objednavky</th>
                        <th>Zakaznik</th>
                        <th>Cena</th>
                        <th>Status</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {renderOrders()}
                    </tbody>
                </table>

            </div>)
    } else {
        return (<div>Loading...</div>)
    }
}

export default AdminPage;