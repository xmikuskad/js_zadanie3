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
        if(obj.state ===0)
            return 'Nezaplatene'
        else
            return 'Zaplatene'
    }

    function setAsPaid()
    {
        return;

        if(paidBtn.current)
            paidBtn.current.parentNode.removeChild(paidBtn)

        fetch('https://mywebsite.com/endpoint/', {
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
                console.log('DONE')
            })
    }

    function createPaidButton()
    {
        if(obj.state === 0)
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