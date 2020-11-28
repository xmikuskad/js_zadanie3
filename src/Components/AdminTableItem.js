import React, {useRef,useState} from 'react';

function AdminTableItem(obj) {
    const [isPaid, setPaid] = useState(obj.state);

    const paidBtn = useRef(null);

    return (
        <tr>
            <td>
                <p>{obj.name}</p>
            </td>
            <td>
                <p>{obj.price}</p>
            </td>
            <td>
                <p>{formatState()}</p>
            </td>
            {createPaidButton()}
        </tr>
    );

    function formatState()
    {
        if(isPaid ===0)
            return 'Nezaplatene'
        else
            return 'Zaplatene'
    }

    function setAsPaid() {
        fetch('/payOrder', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: obj.id
            })
        })
            .then(data => {
                setPaid(1);
            })
    }

    function createPaidButton()
    {
        if(isPaid === 0)
        {
            return (
                <td>
                    <button ref={paidBtn} onClick={()=>{setAsPaid()}}>Oznacit ako zaplatenu</button>
                </td>
            )
        }
    }
}


export default AdminTableItem;