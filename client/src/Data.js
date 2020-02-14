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
  const [comment, setcomment] = useState({ text: "" });
  const [state, setstate] = useState([]);

  useEffect(() => {
    Axios.get(`https://hobbitsls.herokuapp.com/api/posts/${ele.id}/comments`)
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
    Axios.post(
      `https://hobbitsls.herokuapp.com/api/posts/${ele.id}/comments`,
      comment
    )
      .then(
        res =>
          console.log(res, "post") & setLoading(true) & setcomment({ text: "" })
      )
      .catch(err => console.log(err, "error"));
  };

  const commentdelete = (e, id) => {
    e.preventDefault();
    Axios.delete(`https://hobbitsls.herokuapp.com/api/posts/comments/${id}`)
      .then(
        res =>
          console.log(res, "delete") &
          setLoading(true) &
          setcomment({ text: "" })
      )
      .catch(err => console.log(err));
  };

  const handlecommentEdit = (e, id) => {
    e.preventDefault();
    Axios.put(
      `https://hobbitsls.herokuapp.com/api/posts/comments/${id}`,
      comment
    )
      .then(
        res =>
          console.log(res, "post") & setLoading(true) & setcomment({ text: "" })
      )
      .catch(err => console.log(err, "post"));
  };

  return (
    <div className='comments-container' style={{ width: "100%" }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Form onSubmit={handlesubmit}>
          <FormGroup className='mb-2 mr-sm-2 mb-sm-0'>
            <Label className='mr-sm-2'>
              Name:
              <Input
                type='textarea'
                name='text'
                placeholder='Text here'
                value={comment.text}
                onChange={handleChange}
              />
            </Label>
          </FormGroup>
          <Button color='info' size='sm'>
            Submit
          </Button>
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
        {state.length === 0 ? (
          <h4 style={{ textDecoration: "underline", marginBottom: "3%" }}>
            No Comments
          </h4>
        ) : (
          <CardText>
            <br />
            Comments :
            {state.map(data => (
              <p>
                {data.text}{" "}
                <Badge
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
                    marginLeft: "1%"
                  }}
                  onClick={e => commentdelete(e, data.id)}>
                  X
                </span>
                {/* {data.id} */}
              </p>
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
