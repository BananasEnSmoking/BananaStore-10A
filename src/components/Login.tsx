import * as React from "react";
import { Form,Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FormCard } from "../UI/FormCard";
import { useHistory } from "react-router-dom";


export const Login: React.FC = () =>{
    
    let history = useHistory();
    const urlLogin = 'http://35.167.62.109/storeutags/security/login';
    const [data,setData] = React.useState({
        "email":"",
        "password":""
    })

   const  handleOnSubmit =(e:React.FormEvent)=>{
       e.preventDefault();
       singIn();
        }

    const handelOnChange =(e:any)=>{
        setData({...data,[e.currentTarget.name]:e.currentTarget.value})
    }

    async function singIn() {
        try {
            const body = JSON.stringify(data);
            const response = await fetch(urlLogin, { method: 'POST', headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              }, body: body});
              const jres = await response.json()
              console.log(jres.data.customer.first_name)
              if(jres.status === "success"){
                localStorage.setItem('token',jres.data.session_id)
                localStorage.setItem('first_name',jres.data.customer.first_name)
                history.push(`/`);
              }else{
                  console.log("Error al intentar ingresar")
              }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <React.Fragment>
            <FormCard>
                <Form className="form" onSubmitCapture={handleOnSubmit} >
                    <Form.Row className="justify-content-md-center">
                        <Form.Group>
                            <h1>Log in to your account</h1>
                        </Form.Group>
                    </Form.Row>
                    <Form.Row className="justify-content-md-center">
                        <p>
                        don't have an account?&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<Link to="/createAccount">Create Account</Link>
                        </p>
                    </Form.Row>
                <Form.Row className="justify-content-md-center">
                    <Form.Group as={Col} xs={12} md={6} lg={4}>
                        <Form.Label>
                            Account
                        </Form.Label>
                        <Form.Control  name='email' placeholder="account" value={data.email} onChange={handelOnChange} required/>
                    </Form.Group>
                </Form.Row>
                <Form.Row className="justify-content-md-center">
                    <Form.Group as={Col} xs={12} md={6} lg={4}>
                        <Form.Label>
                            Password
                        </Form.Label>
                        <Form.Control  name='password'  type="password" placeholder="password" value={data.password} onChange={handelOnChange} required/>
                    </Form.Group>
                </Form.Row>
                <Form.Row className="justify-content-md-center">
                    <Form.Group as={Col} xs={12} md={6} lg={4}>
                        <Form.Check type="checkbox" label="Remember me" />
                    </Form.Group>
                </Form.Row>
                <Form.Row className="justify-content-md-center">
                    <Form.Group>
                    <Link to="/forgotPsw">forgot your password?</Link>
                    </Form.Group>
                </Form.Row>
                <Form.Row className="justify-content-md-center">
                    <Form.Group as={Col} xs={12} md={6} lg={4}>
                        <Button block variant="primary" type="submit">Submit</Button>
                </Form.Group>
                </Form.Row>
                </Form>
            </FormCard>
            </React.Fragment>
    )
}