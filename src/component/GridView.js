import React, { useState } from "react";
import { Card, Row } from "react-bootstrap-v5";
import ModelProduct from "./ModelProduct";

export default function GridView(props) {
  const [show, setShow] = useState(false);
  const [slugData, setSlugData] = useState({});

  return (
    <>
      <Row id="gridView" className="my-3 " style={{ maxWidth: "1281px" }}>
        {props.props &&
          props.props.map((items) => {
            return (
              <Card
                key={items.id}
                className="m-2 shadow-sm bg-body rounded productCard"
                style={{ width: "15rem", cursor: "pointer" }}
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
            );
          })}
      </Row>
      <ModelProduct
        slugData={slugData}
        show={show}
        handleClose={() => setShow(false)}
      />
    </>
  );
}
