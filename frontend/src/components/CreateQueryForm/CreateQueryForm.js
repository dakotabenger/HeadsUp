import React, { useState } from 'react';
import {Alert,Form,Col,Row,Button,Card,Container} from 'react-bootstrap'
import Zip from 'react-zipcode'
import { WithContext as ReactTags } from 'react-tag-input';
import { shallowEqual, useSelector } from 'react-redux'


const KeyCodes = {
  comma: 188,
  enter: 13,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];


function CreateQueryForm() {
  const [successfulSubmit,setSuccessfulSubmit] = useState(false)
  const [failedSubmit,setFailedSubmit] = useState(false)
  const [minPriceValue,setMinPriceValue] = useState(1000)
  const [maxPriceValue,setMaxPriceValue] = useState(1000)
  const [zipCode,setZipCode] = useState(85201)
  const [email,setEmail] = useState("")
  const [maxMiles,setMaxMiles] = useState(100000)
  const [minMiles, setMinMiles] = useState(0)
  const [reminderMessage,setReminderMessage] = useState("")
  const [tags,setTags] = useState([])
  const [suggestions,setSuggestions] = useState([])
  const sessionUser = useSelector(state =>  state.session.user );

  const handleDelete = (i) => {
    setTags(tags.filter((tag,index) => {
      return index !== i
    }))

  }

  const handleAddition = (tag) => {
    setTags([...tags,tag])
  }

  const handleDrag = (tag,currPos,newPos) => {
    const newTags = tags.slice()
    newTags.splice(currPos, 1);
    newTags.splice(newPos, 0, tag);
    setTags(newTags)
  }
  
  const onSubmit = async (e) => {
    e.preventDefault()
    var emailRegEx = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    
      if (!emailRegEx.test(email)) {
        setEmail("Please Enter A Valid Email")     
        return;
    }
    setSuccessfulSubmit(true)

    const res = await fetch(`/api/createNotification/${sessionUser.id}`, {
      method: 'POST',
      body: JSON.stringify({ email, minPriceValue,maxPriceValue,zipCode,maxMiles,minMiles})
    });
    
    if (res.data && res.data.success) {  
      await setTimeout(()=>{
      setSuccessfulSubmit(true)
    },5000)
    setSuccessfulSubmit(false)
  } else { 
      await setTimeout(()=>{
          setFailedSubmit(true)
        },5000)
        setFailedSubmit(false)
  }
}

return (
  <Container className="form-container">
    <Col sm="6"></Col>
   <Card  sm="6">
   <Card.Header style={{textAlign:"center"}}>Create A Email Notification For Offerup Cars</Card.Header>
   <Card.Body >
     <Col sm="3"></Col>
     <Card.Text column sm="6">


      {successfulSubmit && (
        <Alert key={1} variant="success">Notification Set Up!</Alert>
        )}
      {failedSubmit && (
        <Alert key={2} variant="danger">Oops! Something Went Wrong!</Alert>
        )}
    <Form>
      <Form.Group as={Row}>
        <Form.Label column sm="3">
          Min Price:
        </Form.Label>
        <Col sm="7">
          <Form.Control
            value={minPriceValue}
            onChange={e => setMinPriceValue(e.target.value)}
            type="range"
            min={0}
            max={10000}
          />
        </Col>
        <Col xs="2">
          <Form.Control value={minPriceValue} onChange={e => setMinPriceValue(e.target.value)}/>
        </Col>
      </Form.Group>
      <Form.Group as={Row}>
        <Form.Label column sm="3">
          Max Price:
        </Form.Label>
        <Col sm="7">
          <Form.Control
            value={maxPriceValue}
            onChange={e => setMaxPriceValue(e.target.value)}
            type="range"
            min={0}
            max={10000}
          />
        </Col>
        <Col xs="2">
          <Form.Control value={maxPriceValue} onChange={e => setMaxPriceValue(e.target.value)}/>
        </Col>
      </Form.Group>
      <Form.Group as={Row}>
        <Form.Label column sm="3">
          Min Miles:
        </Form.Label>
        <Col sm="7">
          <Form.Control
            value={minMiles}
            onChange={e => setMinMiles(e.target.value)}
            type="range"
            min={0}
            max={200000}
          />
        </Col>
        <Col xs="2">
          <Form.Control value={minMiles} onChange={e => setMinMiles(e.target.value)}/>
        </Col>
      </Form.Group>
      <Form.Group as={Row}>
        <Form.Label column sm="3">
          Max Miles:
        </Form.Label>
        <Col sm="7">
          <Form.Control
            value={maxMiles}
            onChange={e => setMaxMiles(e.target.value)}
            type="range"
            min={0}
            max={200000}
          />
        </Col>
        <Col xs="2">
          <Form.Control value={maxMiles} onChange={e => setMaxMiles(e.target.value)}/>
        </Col>
      </Form.Group>
      <Form.Group as={Row}>
          <Form.Label column xs="2">
               Zip Code:
         </Form.Label>
         <Col xs="7"></Col>
         <Col sm="3"><Form.Control className="zipCode" onValue={(value) => setZipCode(value)} /></Col>
         
      </Form.Group>
      <Form.Group as={Row}>
        <Col sm="4">
         </Col>
          <Form.Label className="tag-label" column xs="5">
            <div className="tag-input">
      <ReactTags  tags={tags}
                    suggestions={suggestions}
                    handleDelete={handleDelete}
                    handleAddition={handleAddition}
                    handleDrag={handleDrag}
                    delimiters={delimiters} /></div>
              Tags to Search Descriptions and Titles For
         </Form.Label>
        
         <Col sm="2"></Col>
         
      </Form.Group>
      <Form.Group as={Row}>
          <Form.Label style={{textAlign:"center",fontSize:"17pt"}} column sm="6">
              Email For Notifications:
              <Row>
<Col sm="3"></Col>
         <Form.Control  column sm="6" style={{maxWidth:"300px"}} value={email} onChange={e => {setEmail(e.target.value)}}/>
            <Col sm="3"></Col>
              </Row>
         </Form.Label>
          <Form.Label style={{textAlign:"center",fontSize:"17pt"}}column sm="6">
              Set A Reminder Message For Why You Set This Up:
          <textarea style={{height:"100px",width:"500px",resize:"none",fontSize:"12pt"}} type="textarea" value={reminderMessage} onChange={e => setReminderMessage(e.target.value)} />
         </Form.Label>

      </Form.Group>
      <Form.Group>
      </Form.Group>
      <Row>
      <Col sm="4"></Col>      
      <Col sm="3">  
      <Button style={{width:"300px"}} variant="primary" type="submit" onClick={(e) => onSubmit(e)}>
      Create Notification
    </Button>
      </Col>
      <Col sm="5"></Col>
    </Row>
    </Form>
    </Card.Text>
    <Col sm="3"></Col>
    </Card.Body>
    </Card>
    <Col sm="3"></Col>
    </Container>
  );
}

export default CreateQueryForm;