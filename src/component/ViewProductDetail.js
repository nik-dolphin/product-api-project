import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap-v5";
import { useNavigate, useParams } from "react-router-dom";

export default function ViewProductDetail() {
  const navigate = useNavigate();
  let { slug } = useParams();
  console.log(slug);
  const [slugData, setSlugData] = useState([]);
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
    navigate(-1);
  };
  // const handleShow = (items) => {
  //   setShow(true);
  //   if (catData !== undefined) {
  //     navigate(`/${catData}/Products/Product/${items.slug}`);
  //   } else {
  //     navigate(`/${items.slug}/Product`);
  //   }
  // };

  useEffect(() => {
    fetch(
      `http://60ff90a3bca46600171cf36d.mockapi.io/api/products?slug=${slug}`
    )
      .then((res) => {
        if (!res.ok) {
          throw res;
        }
        return res.json();
      })
      .then((data) => {
        setSlugData(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [slug]);

  return (
    <>
      {slugData.length >= 1 && (
        <Modal
          show={show}
          onHide={handleClose}
          style={{ zIndex: "50000000" }}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <h3 className="tooltip-test" title="Product's Slug">
                {slugData[0].slug}
              </h3>{" "}
              Product Detail
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row" key={slugData[0].id}>
              <div className="col-md-6">
                <img
                  className="overflow-hidden productViewImage w-100"
                  src={slugData[0].image}
                  alt='product'
                ></img>
              </div>
              <div className="col-md-6 ms-auto">
                <span className="fw-bold">Name:</span> {slugData[0].name}{" "}
                <br></br>
                <span className="fw-bold">Price:</span> {slugData[0].price} Rs.{" "}
                <br></br>
                <span className="fw-bold">Slug:</span> {slugData[0].slug}{" "}
                <br></br>
                <span className="fw-bold">Category:</span>{" "}
                {slugData[0].category}
              </div>
            </div>
          </Modal.Body>
        </Modal>
      )}
      {/* {slugData.length >= 1 && 
      <div id='listView' className='d-flex align-items-center justify-content-center' style={{margin: '12%'}}>
        <Row key={slugData[0].id}>
          <Card  className='m-2 d-flex align-items-center flex-row shadow-sm bg-body rounded' style={{ width: '50rem'}} >
            <Card.Img className='p-2 rounded overflow-hidden productViewImage' variant="top" src={slugData[0].image} />
            <Card.Body className='w-100'>
              <Card.Text>
                <span className='fw-bold'>Name:</span> {slugData[0].name}
              </Card.Text>
              <Card.Text>
              <span className='fw-bold'>Price:</span> {slugData[0].price} Rs.
              </Card.Text>
              <Card.Text>
              <span className='fw-bold'>Slug:</span> {slugData[0].slug}
              </Card.Text>
              <Card.Text>
              <span className='fw-bold'>Category:</span> {slugData[0].category}
              </Card.Text>
            </Card.Body>
            <div style={{marginTop: '-20em', marginRight: '-30px', cursor: 'pointer'}} variant="success" onClick={() => {
              navigate(-1);
            }}>
              <i className="fa-solid fa-xmark productCard" data-toggle="tooltip" title="Back"></i>
            </div>
          </Card>
        </Row>
    </div>
    } */}
    </>
  );
}
