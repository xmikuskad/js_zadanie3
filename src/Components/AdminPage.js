import React, {useEffect, useState} from 'react';
import AdminTableItem from "./AdminTableItem";
import '../stylesheet.css';

function AdminPage(obj) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [count, setCount] = useState(-1);
    const [orders, setOrders] = useState([]);

    useEffect(()=>{
        fetch('/getIncrement')
            .then(res => res.json())
            .then(data => {
                setCount(data);
            });
    },[]);

    useEffect(()=>{
        fetch('/getOrders')
            .then(res => res.json())
            .then(data => {
                setOrders(data)
                setIsLoaded(true);
            });
    },[]);

    function getCount() {
        if (count >= 0) {
            return (<p>Pocet klikov na pocitadlo je: {count}</p>)
        } else {
            return (<p>Loading...</p>)
        }
    }

    function renderOrders() {
        return orders.map((order, index) => {
            return <AdminTableItem
                key={index}
                id={order.id}
                name={order.name}
                price={order.price}
                state={order.state}
            />
        });
    }

    if(isLoaded) {
        return (
            <div>
                <h1>Admin stranka</h1>
                <button onClick={()=>obj.setPage(0)}>Navrat na hlavnu stranku</button>
                <h3>Stav pocitadla</h3>
                {getCount()}
                <h3>Tabulka vsetkych objednavok</h3>
                <table className='adminTable'>
                    <thead>
                        <tr>
                            <th>Meno</th>
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
    }
    else {
        return (<div>Loading...</div>)
    }
}

export default AdminPage;