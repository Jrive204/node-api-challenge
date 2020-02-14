import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardTitle,
  CardText,
  Form,
  FormGroup,
  Label,
  Input,
  Badge
} from "reactstrap";
import Axios from "axios";

const Data = ({ ele, handleEdit, handleDelete, loading, setLoading }) => {
  const [Selected, setSelected] = useState(false);

  const [comment, setcomment] = useState({
    description: "",
    notes: "",
    completed: Selected
  });
  const [state, setstate] = useState([]);

  useEffect(() => {
    Axios.get(`http://localhost:5000/api/actions/${ele.id}/projects`)
      .then(
        res =>
          console.log(res, "GET") &
          setstate(res.data) &
          setTimeout(() => {
            setLoading(false);
          }, 1500)
      )
      .catch(err => console.log(err));
  }, [loading, setLoading, ele.id]);

  const handleChange = e => {
    e.preventDefault();
    setcomment({ ...comment, [e.target.name]: e.target.value });
  };

  const handlesubmit = e => {
    e.preventDefault();
    Axios.post(`http://localhost:5000/api/actions/${ele.id}/projects`, comment)
      .then(
        res =>
          console.log(res, "post") &
          setLoading(true) &
          setSelected(false) &
          setcomment({ description: "", notes: "", completed: Selected })
      )
      .catch(err => console.log(err, "error"));
  };

  const commentdelete = (e, id) => {
    e.preventDefault();
    Axios.delete(`http://localhost:5000/api/actions/${id}`)
      .then(
        res =>
          console.log(res, "delete") &
          setLoading(true) &
          setSelected(false) &
          setcomment({ description: "", notes: "", completed: Selected })
      )
      .catch(err => console.log(err));
  };

  const handlecommentEdit = (e, id) => {
    e.preventDefault();
    Axios.put(`http://localhost:5000/api/actions/${id}`, comment)
      .then(
        res =>
          console.log(res, "PUTTTT") &
          setLoading(true) &
          setSelected(false) &
          setcomment({ description: "", notes: "", completed: Selected })
      )
      .catch(err => console.log(err, "post"));
  };

  return (
    <div className='comments-container' style={{ width: "100%" }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Form onSubmit={handlesubmit}>
          <FormGroup className='mb-2 mr-sm-2 mb-sm-0'>
            <Label className='mr-sm-2'>
              Description:
              <Input
                name='description'
                placeholder='Text here'
                value={comment.description}
                onChange={handleChange}
              />
            </Label>
          </FormGroup>
          <FormGroup className='mb-2 mr-sm-2 mb-sm-0'>
            <Label className='mr-sm-2'>
              Notes:
              <Input
                type='textarea'
                name='notes'
                placeholder='Text here'
                value={comment.notes}
                onChange={handleChange}
              />
            </Label>
          </FormGroup>
          <Button
            color='primary'
            size='sm'
            onClick={() =>
              setSelected(1) & setcomment({ ...comment, completed: true })
            }
            active={Selected === 1}>
            True
          </Button>
          <Button
            color='danger'
            size='sm'
            onClick={() =>
              setSelected(2) & setcomment({ ...comment, completed: false })
            }
            active={Selected === 2}>
            False
          </Button>
          <br />
          <Button style={{ marginTop: "2%" }} color='info' size='medium'>
            Submit
          </Button>
          {console.log(comment, "comment")}
        </Form>
      </div>

      <Card
        key={ele.id}
        body
        inverse
        style={{ backgroundColor: "#333", borderColor: "#333" }}>
        {console.log(state, "state")}
        <CardTitle>
          <h3>{ele.name}</h3>
        </CardTitle>
        <CardText>
          <h5>{ele.description}</h5>
        </CardText>
        <CardText>
          <h5>
            completed :
            {ele.completed === true ? <span> True </span> : <span>False</span>}
          </h5>
          {console.log(ele.completed, "completed")}
        </CardText>
        {state.length === 0 ? (
          <h4 style={{ textDecoration: "underline", marginBottom: "3%" }}>
            No Actions
          </h4>
        ) : (
          <CardText>
            <br />
            <h4 style={{ textDecoration: "underline" }}>Actions</h4>
            {state.map(data => (
              <div>
                <span
                  style={{
                    fontSize: "1.3rem",
                    fontWeight: "500",
                    marginLeft: "10%"
                  }}>
                  {data.description}
                </span>{" "}
                &nbsp;
                <Badge
                  style={{ cursor: "pointer" }}
                  onClick={e => handlecommentEdit(e, data.id)}
                  color='warning'
                  pill>
                  Edit
                </Badge>
                <span
                  style={{
                    color: "red",
                    fontWeight: "700",
                    fontSize: "1rem",
                    marginLeft: "1%",
                    cursor: "pointer"
                  }}
                  onClick={e => commentdelete(e, data.id)}>
                  X
                </span>
                <p>
                  Notes: {data.notes} <br />
                  completed :
                  {data.completed === true ? (
                    <span> True </span>
                  ) : (
                    <span>False</span>
                  )}
                </p>
              </div>
            ))}
          </CardText>
        )}
        <Button onClick={() => handleEdit(ele.id)} color='warning'>
          Edit
        </Button>
        <Button onClick={() => handleDelete(ele.id)} color='danger'>
          Delete
        </Button>
      </Card>
    </div>
  );
};

export default Data;
