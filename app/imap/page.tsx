'use client';

import { FormEvent, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import React from 'react';
import { SearchMail, DeleteMail } from "@/y360api/imap/ImapMethods";



const Page = () => {

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    //const mail:email = await TestConnection(client_id);
    //setToken('Subject:\n' + mail.subject + '\nBody:\n' + mail.body);
    //await TestDeleteMessage(client_id, subject, from);
    const toList: string[] = await SearchMail(client_id, subject);
    console.log(toList);
    if (toList[0] !== 'notfound') {
      toList.forEach(async to => {DeleteMail(to, subject, client_id).then(
        res => {
          if(res) {
            console.log('Mail with subject', subject, 'deleted from', to, 'mailbox');
          } else {
            console.log('Mail with subject', subject, 'not found in', to, 'mailbox');
          }
        });
      });
    }

  };



  const [client_id, setClientId] = useState('');
  const [subject, setSubject] = useState('');
  const [from, setFrom] = useState('');
  const [token, setToken] = useState('');
  const [error_description, setError] = useState('Ready');
  
  return (
    <Container fluid className="flex-row p-6">
      <Row className="mb-5 w-full">
      <Col className="font-bold">Hello! Let&apos;s test IMAP!</Col>
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
            <Form.Label htmlFor={'client_id'}>Удалить у Email: </Form.Label>
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
          <Col className="mb-3 w-full">
            <Form.Label htmlFor={'from'}>Письмо от Email: </Form.Label>
            <Form.Control
              className="w-96"
              type='text'
              placeholder=''
              id='from'
              value={from}
              onChange={event => setFrom(event.target.value)} />
          </Col>
        </Row>
        <Row className="mb-3">
          <Col className="mb-3 w-full">
            <Form.Label htmlFor={'subject'}>Тема: </Form.Label>
            <Form.Control
              className="w-96"
              type='text'
              placeholder=''
              id='subject'
              value={subject}
              onChange={event => setSubject(event.target.value)} />
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <Form.Label htmlFor={'token'}>Response:</Form.Label>
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
