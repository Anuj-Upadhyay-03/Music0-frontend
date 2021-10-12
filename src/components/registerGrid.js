//Author: Simar Saggu
// Created on: 16th July,2021
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/registerGrid.css';
import React from "react";
import {  Container,Col, Row, Button, Alert} from 'react-bootstrap';
import Register from './register.js';
import { useHistory } from "react-router-dom";

function Grid() {
  let history = useHistory();
  const handleLogin= ()=>{
   history.push("/");
  }
  return (
    <div className="Container">
      <Container fluid>
        <Row>
          <Col md={4} >
            <Row>
              <div className="app-name">MusicO</div>
            </Row>
            <Row>
              <div className="app-tagline">PLAY.FORWARD.REPEAT</div>
            </Row>
          </Col>
          <Col md={8} className="register-container">
            <Row className="login-btn">
              <Col md={10}>
                <div className="login-tag">Existing User?</div>
              </Col>
              <Col md={2}>
                <Button type='button' className="login-btn-btn" onClick={handleLogin}> <img src="https://img.icons8.com/material-outlined/26/000000/enter-2.png"/></Button>
              </Col>
            </Row>
            <Row >
              <Register/>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Grid;
