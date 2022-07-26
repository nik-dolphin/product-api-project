import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { hover } from "@testing-library/user-event/dist/hover";
import {
  Button,
  ButtonGroup,
  Container,
  Dropdown,
  DropdownButton,
  Form,
  FormControl,
  ToggleButton,
} from "react-bootstrap-v5";
import ListView from "./ListView";
import GridView from "./GridView";
import Forbidden from "./Forbidden";

export default function ProductByCategory() {
  const navigate = useNavigate();
  let dataLimit = 10;
  const pageLimit = 5;
  let { category } = useParams();
  const searchData = localStorage.getItem('searchData'); 
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [radioValue, setRadioValue] = useState("1");
  const [text, setText] = useState(searchData);
  const [suggestions, setSuggestions] = useState("");
  // const [uniqueArrForSearch, setUniqueArrForSearch] = useState("");
  // const [localName, setLocalName] = useState('');

  const pages = Math.round(data.length / dataLimit);


  // store unique name
  const allData = JSON.parse(localStorage.getItem('Data'));
  const arrayDataForSearch = allData.map((items, i) => {
    return `${items.name}`;
  });
  const uniqueArrForSearch = [...new Set(arrayDataForSearch)];

  // sort data into asc || desc
  const handleSelect = (e) => {
    if (e === "Ascending") {
      const sortedAscending = data.sort((a, b) => a.price - b.price);
      setData([...sortedAscending]);
    } else if (e === "Descending") {
      const sortedDescending = data.sort((a, b) => b.price - a.price);
      setData([...sortedDescending]);
    }
  };

  useEffect(() => {
    const localData = JSON.parse(localStorage.getItem('Data'));
    setData(localData);
  }, []);
  console.log(data);

  const getPaginatedData = () => {
    const startIndex = currentPage * dataLimit - dataLimit;
    const endIndex = startIndex + dataLimit;
    return data.slice(startIndex, endIndex);
  };

  function changePage(event) {
    const pageNumber = Number(event.target.textContent);
    setCurrentPage(pageNumber);
  }

  const getPaginationGroup = () => {
    let start = Math.ceil((currentPage - 1) / dataLimit) * dataLimit;
    return new Array(pageLimit).fill().map((_, idx) => {
      return start + idx + 1;
    });
  };

  const handlePreviousClick = () => {
    setCurrentPage((currentPage) => currentPage - 1);
  };

  const handleNextClick = () => {
    setCurrentPage((currentPage) => currentPage + 1);
  };

  const handleFirstClick = () => {
    setCurrentPage(1);
  };

  const handleLastClick = () => {
    setCurrentPage(pages);
  };

  const sortedData = () => {
    const tempArr = data.filter((name) => {
      const regex = new RegExp(`${category}`, "gi");
      const result = name.name.match(regex);
      return result;
    })
    console.log(tempArr);
    getPaginatedData(tempArr);
    data.filter((item) => item.category === category).map((items) => data.push(items))
  }

/////////////////////////////////////////////////////////////////////////////////////
  // set value of views in radio array
  const radios = [
    { name: "Grid View", value: "1" },
    { name: "List View", value: "2" },
  ];

  // display view by clicking dropdown
  const ViewData = () => {
    if (radioValue === "1") {
      return <GridView props={getPaginatedData()} />;
    } else if (radioValue) {
      return <ListView props={getPaginatedData()} />;
    }
  };

  // get data for search query
  const localData = JSON.parse(localStorage.getItem('Data'));
  const arrayData = localData.map((items, i) => {
    return `${items.category}`;
  });
  const uniqueArr = [...new Set(arrayData)];

  // filter data by each character
  const handleSearchClick = (e) => {
    // console.log(text);
    const { value } = e.target;
    let matches = [];
    if (value.length > 0) {
      matches = uniqueArrForSearch.filter((user) => {
        const regex = new RegExp(`${value}`, "gi");
        return user.match(regex);
      });
    }
    // console.log(matches);
    setSuggestions(matches);
    setText(value);
  };

  // after click search button set value into input
  const onHandleSuggest = (text) => {
    setText(text);
    setSuggestions([]);
  };

  return (
    <>
      <div className=" container mt-5 mb-3 mr-3 d-flex justify-content-between">
        <DropdownButton
          variant="success"
          alignRight
          title="Sort by Price"
          id="dropdown-menu-align-right"
          onSelect={handleSelect}
        >
          <Dropdown.Item eventKey="Ascending">Ascending</Dropdown.Item>
          <Dropdown.Item eventKey="Descending">Descending</Dropdown.Item>
        </DropdownButton>
        <h3>PRODUCT DETAIL</h3>
        <div>
          <ButtonGroup>
            {radios.map((radio, idx) => (
              <ToggleButton
                key={idx}
                id={`radio-${idx}`}
                type="radio"
                variant={hover ? "outline-success" : ""}
                name="radio"
                value={radio.value}
                checked={radioValue === radio.value}
                onChange={(e) => setRadioValue(e.currentTarget.value)}
              >
                {radio.name}
              </ToggleButton>
            ))}
          </ButtonGroup>
        </div>
      </div>
      <hr></hr>
      <Container>
        <div className="d-flex">
          <DropdownButton
            variant="success"
            alignRight
            className="me-3"
            title="Find Category"
            id="dropdown-menu-align-right"
            onSelect={(categeory) => {
              navigate(`/${categeory}/Products`);
            }}
          >
            {uniqueArr.map((items, i) => {
              return (
                <Dropdown.Item key={i} eventKey={items}>
                  {items}
                </Dropdown.Item>
              );
            })}
          </DropdownButton>
          <Form
            className="d-flex w-25 flex-column"
            style={{
              zIndex: "10000",
              position: "absolute",
              marginLeft: "150px",
            }}
          >
            <div className="d-flex flex-row">
              <FormControl
                type="search"
                autoComplete="off"
                placeholder="Search By Name"
                className="me-2"
                aria-label="Search"
                onChange={handleSearchClick}
                value={text}
                onKeyDown={(e) =>
                  e.key === "Enter" && navigate(`/${text}/Products`)
                }
              />
              <Button
                variant="outline-success"
                onClick={() => {
                  navigate(`/${text}/Products`);
                }}
              >
                Search
              </Button>
            </div>
            {suggestions &&
              suggestions.map((items, i) => {
                return (
                  <div
                    key={i}
                    onClick={() => onHandleSuggest(items)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && onHandleSuggest(items)
                    }
                    value={text}
                    className="suggestionsCss shadow-sm w-75 text-center"
                  >
                    {items}
                  </div>
                );
              })}
            {/* style={{ zIndex: '100', listStyleType: 'none', padding: '4px', display: 'block'}} */}
          </Form>
        </div>
        {data.length !== 0 ? <ViewData /> : <Forbidden />}
      </Container>
      
      <div className="container d-flex justify-content-around mt-5 mb-5 mr-3">
        <Button
          disabled={currentPage <= 1}
          variant="success"
          onClick={handlePreviousClick}
        >
          {" "}
          &larr; Previous
        </Button>
        <div>
          <Button onClick={handleFirstClick} variant="success">
            &lArr;
          </Button>
          {getPaginationGroup().map((item, index) => (
            <Button
              variant="success"
              key={index}
              onClick={changePage}
              className={`${currentPage === item ? "active" : null} mx-1 my-1`}
            >
              <span>{item}</span>
            </Button>
          ))}
          <Button onClick={handleLastClick} variant="success">
            &rArr;
          </Button>
        </div>
        <Button
          className={`${currentPage === pages ? "disabled" : ""}`}
          variant="success"
          onClick={handleNextClick}
        >
          Next &rarr;{" "}
        </Button>
      </div>
    </>
  );
}
