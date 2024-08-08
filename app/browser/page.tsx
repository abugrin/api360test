

import {Col, Container, Row } from "react-bootstrap";
import React from 'react';



const Page = () => {

  return (
    <Container fluid className="flex-row p-6">
      <Row className="mb-5 w-full">
      <Col className="font-bold"><p className="text-red-700 text-2xl">Внимание!</p> Вы используете неподдерживаемый браузер.</Col>
      </Row>
      <Row>
        <Col className="font-bold">Обратитесь к администратору</Col>
      </Row>

    </Container>
  );
};


export default Page;
