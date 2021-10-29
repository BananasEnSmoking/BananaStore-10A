import * as React from 'react';
import { urlApi } from "../../API";
import { message, Table } from "antd";

export const Pedidos:React.FC =()=>{
    const token=sessionStorage.token
    const [pedidos,setPedidos]=React.useState<any>();


    const formatter = new Intl.NumberFormat('en-US',{
        style: 'currency',
        currency: 'MXN',
        minimumFractionDigits:2
    }); 

    //Agregar "Key" a cada pedido para evitar warning y preparar table
    const addKeyPedido=(pedidos:any)=>{
        const arr:any =[]
        pedidos.map((ped:any,index:number)=>{
            arr.push({
                "key":index + 1,
                "idpaypal":ped.idpaypal,
                "amount": formatter.format(ped.amount),
                "date": new Date(ped.date).toLocaleDateString(),
            })
            return null
        })
        return arr
    }

    async function getPedidos() {
        try {
              const response = await fetch(`${urlApi}/getPedidos`,{ method:'Get', mode:'cors', headers:{ 
                'Accept': 'application/json',
                'x-access-token': token
              }});
              const res = await response.json();
              console.log(res)
              if( res.msg === 'success'){
                  setPedidos(addKeyPedido(res.pedidos))   
              }else{
                  message.error('Fail to Load!!')
              }
        } catch (error) {
              console.log(error)
          }
      }


    const columsPedido = [
        {
            title:'Paypal Order',
            dataIndex:'idpaypal',
            width:'auto'
        },
        {
            title:'Amount',
            dataIndex:'amount',
            width:'auto'
        },
        {
            title:'Date',
            dataIndex:'date',
            width:'date'
        }
    ];

    React.useEffect(()=>{
        getPedidos()
    },[])// eslint-disable-line react-hooks/exhaustive-deps

    //Add table

    return(
        <React.Fragment>
            
            <Table columns={columsPedido} dataSource={pedidos} style={{ marginTop:'1rem' }}/>
        </React.Fragment>
    )
}