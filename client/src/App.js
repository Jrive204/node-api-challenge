import React, { useState, useEffect } from "react";
import "./App.scss";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";
import Axios from "axios";
import Loader from "react-loader-spinner";
import Data from "./Data";

function App() {
  const [user, setUser] = useState({ name: "", description: "" });
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Axios.get("http://localhost:5000/api/projects")
      .then(
        res =>
          console.log(res, "GET") &
          setData(res.data) &
          setTimeout(() => {
            setLoading(false);
          }, 1500)
      )
      .catch(err => console.log(err));
  }, [loading]);

  const handlesubmit = e => {
    e.preventDefault();
    Axios.post("http://localhost:5000/api/projects", user)
      .then(
        res =>
          console.log(res, "post") &
          setLoading(true) &
          setUser({ name: "", description: "" })
      )
      .catch(err => console.log(err, "error"));
  };

  const handleEdit = id => {
    Axios.put(`http://localhost:5000/api/projects/${id}`, user)
      .then(
        res =>
          console.log(res, "post") &
          setLoading(true) &
          setUser({ name: "", description: "" })
      )
      .catch(err => console.log(err, "post"));
  };
  const handleDelete = id => {
    Axios.delete(`https://hobbitsls.herokuapp.com/api/posts/${id}`)
      .then(
        res =>
          console.log(res, "delete") &
          setLoading(true) &
          setUser({ name: "", description: "" })
      )
      .catch(err => console.log(err));
  };

  const handleChange = e => {
    e.preventDefault();
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  return (
    <div className='App'>
      <Form style={{ marginLeft: "8%" }} onSubmit={handlesubmit}>
        <FormGroup className='mb-2 mr-sm-2 mb-sm-0'>
          <Label className='mr-sm-2'>
            Name:
            <Input
              type='text'
              name='name'
              placeholder='Name'
              value={user.name}
              onChange={handleChange}
            />
          </Label>
        </FormGroup>
        <FormGroup className='mb-2 mr-sm-2 mb-sm-0'>
          <Label className='mr-sm-2'>
            {console.log(user)}
            Description:
            <Input
              type='textarea'
              name='description'
              placeholder='info'
              value={user.description}
              onChange={handleChange}
            />
          </Label>
        </FormGroup>
        <Button>Submit</Button>
      </Form>
      <div
        style={{
          display: "flex",
          width: "50%",
          margin: "0 auto",
          flexWrap: "wrap"
        }}>
        {loading && (
          <div style={{ margin: "0 auto", marginTop: "10%" }}>
            <Loader
              type='Puff'
              color='#00BFFF'
              height={100}
              width={100}
              timeout={3000} //3 secs
            />
          </div>
        )}
        {data && !loading && (
          <>
            {data.map(ele => (
              <Data
                ele={ele}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                loading={loading}
                setLoading={setLoading}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
