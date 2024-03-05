'use client';

import { FormEvent, useState } from "react";
import requestToken from "@/y360api/token/TokenAPI";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import React from 'react';
import TokenResponse from "@/y360api/token/TokenResponse";


const Page = () => {

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const resp: TokenResponse = await requestToken(client_id, client_secret, subject_token);

    setToken(resp.access_token);
    if(resp.error_description) {
      setError(resp.error_description);
    } else {
      setError('Ok');
    }
    

    //router.push('/generate')

  };



  const [client_id, setClientId] = useState('');
  const [client_secret, setClientSecret] = useState('');
  const [subject_token, setSubjectToken] = useState('');
  const [token, setToken] = useState('');
  const [error_description, setError] = useState('Ready');
  
  return (
    <Container fluid className="flex-row p-6">
      <Row className="mb-5 w-full">
      <Col className="font-bold">Hello! Let&apos;s generate token!</Col>
      </Row>
      <Row>
        <Col>
      <Form acceptCharset={'utf-8'} id={'tokenForm'} method={'post'} onSubmit={onSubmit} 
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
          <Col className="mb-3">
            <Form.Label htmlFor={'client_secret'}>client_secret:</Form.Label>
            <Form.Control
              className="w-96"
              type='text'
              placeholder=''
              id='client_secret'
              value={client_secret}
              onChange={event => setClientSecret(event.target.value)} />
          </Col>
        </Row>
        <Row className="mb-3">
          <Col className="mb-3">
            <Form.Label htmlFor={'subject_token'}>subject_token (user_id):</Form.Label>
            <Form.Control
              className="w-96"
              type='text'
              placeholder=''
              id='subject_token'
              value={subject_token}
              width={200}
              onChange={event => setSubjectToken(event.target.value)} />
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
      <Button className="bg-gray-500 text-gray-300 rounded-sm p-1" type={'submit'} form={'tokenForm'}>Send</Button>
      </Col>
      </Row>

    </Container>
  );
};


export default Page;
