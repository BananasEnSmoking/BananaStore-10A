import React from 'react';
import { Container } from 'react-bootstrap';

import {
  HashRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

//componentes layout
import { NavbarBootstrap } from "./components/Layout/NavbarBootstrap";
import { Footer } from "./components/Layout/Footer";

//componentes router
import { CreateAccount } from "./components/CreateAccount";
import { Login } from "./components/Login";
import { ForgotPassword } from "./components/RecoveryPassword/ForgotPassword";
import { RecoveryPassword } from "./components/RecoveryPassword/RecoveryPassword";
import { HomeDepot } from "./components/HomeDepot";
import { ProductDetails } from "./components/Productos/ProductDetails";
import { Carrito } from './components/Carrito/Carrito';
import { Pago } from './components/Carrito/Pago';
import { Order } from './components/Carrito/Order';

function App(): JSX.Element {
  return (
    <React.Fragment>
      <Router>
        <NavbarBootstrap />
        
       <Container style={{ height: '100%' }}>
          <Switch>
            <Route exact={true} path="/" component={HomeDepot}/>
            <Route exact={true} path="/login" component={Login}/>
            <Route exact={true} path="/createAccount" component={CreateAccount}/>
            <Route exact={true} path="/forgotPsw" component={ForgotPassword}/>
            <Route exact={true} path="/recoveryPsw/:email" component={RecoveryPassword}/>
            <Route exact={true} path="/ProductDetails/:itemId" component={ProductDetails}/>
            <Route exact={true} path="/showCarrito" component={Carrito}/>
            <Route exact={true} path="/pago" component={Pago}/>
            <Route exact={true} path="/order" component={Order}/>
          </Switch>
       </Container>
      </Router>
      
    </React.Fragment>
  );
}

export default App;
