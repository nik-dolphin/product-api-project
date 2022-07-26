import React, { useState } from "react";
import { Card, Row } from "react-bootstrap-v5";
import ModelProduct from "./ModelProduct";

export default function ListView(props) {
  const [show, setShow] = useState(false);
  const [slugData, setSlugData] = useState({});

  return (
    <>
      {props.props.map((items) => {
        return (
          <Row
            id="listView"
            key={items.id}
            className="d-flex justify-content-center align-items-center"
          >
            <Card
              className="m-2 d-flex align-items-center flex-row shadow-sm bg-body rounded productCard"
              style={{ width: "30rem" }}
              onClick={() => {
                setShow(true);
                setSlugData(items);
              }}
            >
              <Card.Img
                className="p-3 rounded overflow-hidden productImage"
                variant="top"
                src={items.image}
              />
              <Card.Body>
                <Card.Text>
                  <span className="fw-bold">Name:</span> {items.name}
                </Card.Text>
                <Card.Text>
                  <span className="fw-bold">Price:</span> {items.price} Rs.
                </Card.Text>
                <Card.Text>
                  <span className="fw-bold">Category:</span> {items.category}
                </Card.Text>
              </Card.Body>
            </Card>
          </Row>
        );
      })}
      <ModelProduct
        slugData={slugData}
        show={show}
        handleClose={() => setShow(false)}
      />
    </>
  );
}
