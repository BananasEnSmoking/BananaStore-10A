import * as React from "react";
import { Form, Button,Col, Modal } from "react-bootstrap";
import { FormCard } from "../UI/FormCard";

import { PUBLIC_RECAPTCHA_KEY} from "../ReCAPTCHAKeys";

import ReCAPTCHA from "react-google-recaptcha";


export const CreateAccount: React.FC = () =>{
    var urlApiCreateUser = "http://35.167.62.109/storeutags/security/create_account";
    const [robot,setRobot] = React.useState(false);
    const [modalHeader,setModalHeader] = React.useState("");
    const [modalTitle,setModalTitle] = React.useState("");
    const [modalMessage,setModalMessage] = React.useState("");
    const [formData,setFormData] = React.useState({
        "first_name":"",
        "middle_name":"",
        "last_name":"",
        "phone_number":"",
        "address":{
            "city": "",
            "state":""
        },
        "email":"",
        "password":"",
        "password_confirmation":""
    });

    const reRef:any = React.useRef<ReCAPTCHA>();

    const handleOnChange =(e:any)=>{
        if(e.currentTarget.name === 'city' || e.currentTarget.name === 'state'){
            setFormData({
                ...formData, address: {...formData.address,[e.currentTarget.name]:e.currentTarget.value}
            })
        }else{
        setFormData({
            ...formData,[e.currentTarget.name]:e.currentTarget.value
        })
    }
    }

    async function createUser(){
        try {
            const body = JSON.stringify(formData);
            const response = await fetch(urlApiCreateUser, { method: 'POST', headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              }, body: body});

              const res = await response.json();
            if(res.status === "success"){
                setModalMessage("Listo")
            }
              
        } catch (error) {
            console.log(error)
        }
       
    }

    /**
     * La siguiente funcion deberia realizarse en el backend porque no tiene sentido dar la llave privada de nuestra validacion de captcha en el front
     */

  /*  async function isHuman(humanKey:string){
        try{
        const respuesta = await fetch(`https://www.google.com/recaptcha/api/siteverify`,{
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
              },
              body: `secret=${SECRET_RECAPTCHA_KEY}&response=${humanKey}`
            });
            console.log(respuesta)
            const res = await respuesta.json();
            console.log(res)
            if(!res){
                setModalHeader("Robot");
                setModalTitle("Christian Modal Robot");
                setModalMessage("Usted no es una bannana");
                setRobot(true)
            }
            if(res){
                setModalHeader("Bannana");
                setModalTitle("Enviando...");
                setModalMessage("Enviando...");
                setRobot(true)
                createUser()
            }
        }catch(e){
            console.log(e)
        }
    }
    */

    const closeRobotModal =()=>{
        setRobot(false)
    }

    React.useEffect(()=>{
        
    },[modalHeader,modalMessage,modalTitle])

    const RobotModal =(props:any)=>{
        return (
            <Modal
            {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >

      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {modalHeader}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>{modalTitle}</h4>
        <p>
            {modalMessage}
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={closeRobotModal}>Close</Button>
      </Modal.Footer>
    </Modal>
        )
    }


    const handleOnSubmit= async (e:React.FormEvent)=> {
        e.preventDefault();
        const tokenF = await reRef.current.getValue();
        if(tokenF){
                setModalHeader("Bannana");
                setModalTitle("Enviando...");
                setModalMessage("Enviando...");
                setRobot(true);
                if(formData.password === formData.password_confirmation){
                createUser()
                }else{
                setModalHeader("Error");
                setModalTitle("Password");
                setModalMessage("El password que ingreso no coincide");
                setRobot(true);
                }
        } else{
            setModalHeader("Robot");
                setModalTitle("Christian Modal Robot");
                setModalMessage("Usted no es una bannana");
                setRobot(true)
        }
        //isHuman(tokenF)
        reRef.current.reset();  
    }

    return (
        <React.Fragment>
            {/**
             * Aqui empieza el modal 
             */}
            
    <RobotModal
        show={robot}
        onHide={() => setRobot(false)}
      />
    {/**
     * Termina modal
     */}
        <FormCard>
            <Form className="form" onSubmitCapture={handleOnSubmit}>
            <Form.Row className="justify-content-md-center">
                        <Form.Group>
                            <h1>Create account</h1>
                        </Form.Group>
                    </Form.Row>
                <Form.Row>
                    <Form.Group as={Col} xs={12} md={6} lg={4}>
                        <Form.Label>
                            Nombre
                        </Form.Label>
                        <Form.Control  name='first_name' onChange={handleOnChange} placeholder="Nombre" required/>
                    </Form.Group>
                    <Form.Group as={Col} xs={12} md={6} lg={4}>
                        <Form.Label>
                            Apellido Paterno
                        </Form.Label>
                        <Form.Control  name='middle_name' onChange={handleOnChange} placeholder="Apellido paterno" required/>
                    </Form.Group>
                    <Form.Group as={Col} xs={12} md={6} lg={4}>
                        <Form.Label>
                            Apellido Materno
                        </Form.Label>
                        <Form.Control  name='last_name' onChange={handleOnChange} placeholder="Apellido materno" required/>
                    </Form.Group>
                </Form.Row>

                <Form.Row>
                    <Form.Group as={Col} xs={12} md={6} lg={4}>
                        <Form.Label>
                            Ciudad
                        </Form.Label>
                        <Form.Control  name='city' onChange={handleOnChange} placeholder="Ciudad" required/>
                    </Form.Group>
                    <Form.Group as={Col} xs={12} md={6} lg={4}>
                        <Form.Label>
                            Estado
                        </Form.Label>
                        <Form.Control  name='state' onChange={handleOnChange} placeholder="Estado" required/>
                    </Form.Group>
                </Form.Row>

                <Form.Row>
                    <Form.Group as={Col} xs={12} md={6} lg={4}>
                        <Form.Label>
                            Teléfono
                        </Form.Label>
                        <Form.Control  type="tel" name='phone_number' pattern="[\()]?(\+52|52)?[\)]?[ -]*([0-9][ -]*){10}" onChange={handleOnChange} title="Numero de Mexico a 10 digitos puede incluir +52" placeholder="Telefono" required />
                        <Form.Text className="text-muted">
                        Ejemplos: 449 295 45 66  o +52 449 29545 66
                        </Form.Text>
                    </Form.Group>
                    <Form.Group as={Col} xs={12} md={6} lg={4}>
                        <Form.Label>
                            Correo
                        </Form.Label>
                        <Form.Control type="email" name='email' onChange={handleOnChange} placeholder="Correo electronico" required/>
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                <Form.Group as={Col} xs={12} md={6} lg={4}>
                        <Form.Label>
                            Contraseña
                        </Form.Label>
                        <Form.Control type="password" name='password' onChange={handleOnChange} pattern="^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$" title="La contrasena debe tener almenos una letra MAYUSCULA un NUMERO y un tamano minimo de 8 caracteres" placeholder="Contrasena" required/>
                    </Form.Group>
                    <Form.Group as={Col} xs={12} md={6} lg={4}>
                        <Form.Label>
                            Confirmar Contraseña
                        </Form.Label>
                        <Form.Control  type="password" name='password_confirmation' onChange={handleOnChange} pattern="^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$" title="La contrasena debe tener almenos una letra MAYUSCULA un NUMERO y un tamano minimo de 8 caracteres" placeholder="Contrasena" required/>
                        <Form.Text className="text-muted">
                        Debe coincidir con el password que ingreso anteriormente
                        </Form.Text>
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                <Form.Group as={Col} xs={12} md={6} lg={4}>
                <Button block variant="primary" type="submit">Submit</Button>
                </Form.Group>
                <Form.Group as={Col} xs={12} md={6} lg={4}>
                <ReCAPTCHA 
                    sitekey={PUBLIC_RECAPTCHA_KEY}
                    ref={reRef}
                    />
                </Form.Group>
                </Form.Row>
            </Form>
        </FormCard>
        </React.Fragment>
    )
}