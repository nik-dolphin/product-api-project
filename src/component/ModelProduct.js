import React from "react";
import { Modal } from "react-bootstrap-v5";

export default function ModelProduct({ show, handleClose, slugData }) {
  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
        <p
          style={{
            cursor: "pointer",
            textAlign: "right",
            marginTop: "-37px",
            marginRight: "-25px",
            color: "white",
          }}
          variant="success"
          onClick={() => {
            handleClose(false);
          }}
        >
          <i
            className="fa-solid fa-xmark productCard"
            data-toggle="tooltip"
            title="Back"
          ></i>
        </p>
      <Modal.Title>
      </Modal.Title>
      <Modal.Body className="d-flex flex-row">
        <div className="row" key={slugData.id}>
          <div className="col-md-6">
            <img
              className="overflow-hidden productViewImage w-100"
              src={slugData.image}
              alt="product detail"
            ></img>
          </div>
          <div className="col-md-6 ms-auto d-flex flex-column">
            <p>
              <span className="fw-bold">Name:</span> {slugData.name}
            </p>
            <p>
              <span className="fw-bold">Price:</span> {slugData.price} Rs.
            </p>
            <p>
              <span className="fw-bold">Slug:</span> {slugData.slug}
            </p>
            <p>
              <span className="fw-bold">Category:</span> {slugData.category}
            </p>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
