import * as React from 'react';
import { urlApi } from "../../API";
import { message,Input, Button,Table, Popconfirm } from "antd";
import { PayPalButton } from "react-paypal-button-v2";



export const Car:React.FC =()=>{
    const token = sessionStorage.token
    const [productsCar,setProductsCar]=React.useState<any>();
    const [tAmount,setTAmount]=React.useState<any>();
    const formatter = new Intl.NumberFormat('en-US',{
        style: 'currency',
        currency: 'MXN',
        minimumFractionDigits:2
    });

    async function getCar() {
        try {
              const response = await fetch(`${urlApi}/getCar`,{ method:'Get', mode:'cors', headers:{ 
                'Accept': 'application/json',
                'x-access-token': token
              }});
              const res = await response.json();
              console.log(res)
              if( res.msg === 'success'){
                  setProductsCar(addKeyCar(res.car))   
              }else{
                  message.error('Fail to Load!')
              }
        } catch (error) {
              console.log(error)
          }
      }


      async function cleanCar() {
        try {
              const response = await fetch(`${urlApi}/clearCar`,{ method:'Get', mode:'cors', headers:{ 
                'Accept': 'application/json',
                'x-access-token': token
              }});
              const res = await response.json();
              if( res.msg === 'success'){
                  message.info('Car empty!')
                  getCar()
              }else{
                  message.error('Fail to Load!')
              }
        } catch (error) {
              console.log(error)
          }
      }

      async function deleteProduct(data:any) {
        try {
            const body = JSON.stringify(data);
            const response = await fetch(`${urlApi}/deleteItemCar`,{ method:'post', mode:'cors', headers:{ 
            'Accept': 'application/json',
            "Content-Type": "application/json",
            'x-access-token': token
          },body:body});
          const res = await response.json();
          if(res.msg === 'success'){
              message.success('Element removed successfully')
              getCar()
          }
        } catch (error) {
          console.log(error)
        }
    }

    async function insertPedido(data:any) {
        try {
            const body = JSON.stringify(data);
            const response = await fetch(`${urlApi}/insertPedido`,{ method:'post', mode:'cors', headers:{ 
            'Accept': 'application/json',
            "Content-Type": "application/json",
            'x-access-token': token
          },body:body});
          const res = await response.json();
          if(res.msg === 'success'){
          }
        } catch (error) {
          console.log(error)
        }
    }


    // Agregar "Key" a cada movimiento para evitar warning react
    const addKeyCar=(prods:any)=>{
    const arr:any =[]
    let total=0;
    prods.map((prod:any,index:number)=>{
        arr.push({
            "key":index + 1,
            "name":prod.name,
            "price":prod.price,
            "cantidad":prod.cantidad,
            "total": formatter.format(parseFloat(prod.price) * parseFloat(prod.cantidad)),
            "idproducts":prod.idproducts
        })
        total= total + parseFloat(prod.price) * parseFloat(prod.cantidad)
        return null
    })
    setTAmount(total)
    return arr
    }

    const handleDeleteItem =(it:any)=>{
        deleteProduct(it)
    }

    const [pivote,setPivote]=React.useState<any>({})

    const handleCant =(e:any)=>{
        setPivote({...pivote,[e.currentTarget.name]:e.currentTarget.value})
    }

    async function updateCar(data:any) {
        try {
            const body = JSON.stringify(data);
            const response = await fetch(`${urlApi}/updateCar`,{ method:'post', mode:'cors', headers:{ 
            'Accept': 'application/json',
            "Content-Type": "application/json",
            'x-access-token': token
          },body:body});
          const res = await response.json();
          if(res.msg === 'success'){
              message.success('Element update successfully')
              getCar()
          }
        } catch (error) {
          console.log(error)
        }
    }

    const handleOnSave =(it:any)=>{
        const data={
            'idproduct':it.idproducts,
            'cantidad':pivote[`${it.key}`]
        }
        updateCar(data)
    }

      const columnsCar = [
        {
            title: 'Article',
            dataIndex: 'key',
            width: 'auto',
        },
        {
            title: 'Product',
            dataIndex: 'name',
            width: 'auto',
        },
        {
            title: 'Unit Price',
            dataIndex: 'price',
            width: 'auto',
        },
        {
            title: 'Quantity',
            width: 'auto',
            render:(item:any)=><React.Fragment>
                <Input type='number' defaultValue={item.cantidad} name={`${item.key}`} onChange={handleCant} style={{ width:'6rem',marginRight:'1rem' }}/>
                <Button onClick={()=>{handleOnSave(item)}} style={{ backgroundColor: '#F4D03F',borderColor:'#F4D03F' }}>Save</Button>
            </React.Fragment>
        },
        {
            title: 'Total',
            dataIndex: 'total',
            width: 'auto'
        },
        {
            title:'Delete',
            width:'auto',
            editable:false,
            render: (item:any) => <Popconfirm title='Are you sure to remove this item?' onConfirm={()=>handleDeleteItem(item)} ><Button danger type='primary'>Delete</Button></Popconfirm>

        },
       
      ];

      React.useEffect(()=>{
          getCar()
      },[]) // eslint-disable-line react-hooks/exhaustive-deps

    return(
        <React.Fragment>
            <h1>Final Amount: {formatter.format(tAmount)}</h1>
            <Table columns={columnsCar} dataSource={productsCar} style={{ margin:'1rem' }} pagination={false} bordered/>
            {productsCar !== null && productsCar !== undefined && tAmount > .01?
            <PayPalButton
            amount={tAmount.toFixed(2)}
            // shippingPreference="NO_SHIPPING" // default is "GET_FROM_FILE"
            
            onSuccess={(details:any, data:any) => {
              cleanCar()
              const pedido ={
                  'idpaypal':details.id,
                  'amount':tAmount
              }
              insertPedido(pedido)
            }}
            
            />
            :
            ''
            }
        </React.Fragment>
    )
}