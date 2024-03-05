'use client';

import { FormEvent, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import React from 'react';
import { TestConnection } from "@/y360api/imap/TestConnection";


const Page = () => {

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    TestConnection(client_id);


  };



  const [client_id, setClientId] = useState('');
  const [token, setToken] = useState('');
  const [error_description, setError] = useState('Ready');
  
  return (
    <Container fluid className="flex-row p-6">
      <Row className="mb-5 w-full">
      <Col className="font-bold">Hello! Let&apos;s generate token!</Col>
      </Row>
      <Row>
        <Col>
      <Form acceptCharset={'utf-8'} id={'imapForm'} method={'post'} onSubmit={onSubmit} 
      className="flex-row text-base">
        <Row className="mb-3">
          <Col className="mb-3 w-full">
            <Form.Control
              className="w-full font-mono"
              type='text'
              placeholder=''
              disabled 
              id='error'
              value={error_description}
              onChange={event => setError(event.target.value)} />
          </Col>
        </Row>
        <Row className="mb-3">
          <Col className="mb-3 w-full">
            <Form.Label htmlFor={'client_id'}>client_id: </Form.Label>
            <Form.Control
              className="w-96"
              type='text'
              placeholder=''
              id='client_id'
              value={client_id}
              onChange={event => setClientId(event.target.value)} />
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <Form.Label htmlFor={'token'}>Token:</Form.Label>
            <Form.Control
              as='textarea'
              rows={5}
              placeholder=''
              id='token'
              cols={50}
              
              value={token}
              onChange={event => setToken(event.target.value)}
            />
          </Col>
        </Row>
      </Form>
      <Button className="bg-gray-500 text-gray-300 rounded-sm p-1" type={'submit'} form={'imapForm'}>Send</Button>
      </Col>
      </Row>

    </Container>
  );
};


export default Page;
