import { hover } from "@testing-library/user-event/dist/hover";
import React, { useEffect, useState } from "react";
import {
  Button,
  ButtonGroup,
  Container,
  Dropdown,
  DropdownButton,
  Form,
  FormControl,
  Spinner,
  ToggleButton,
} from "react-bootstrap-v5";
import { useNavigate, useParams } from "react-router-dom";
import GridView from "./GridView";
import ListView from "./ListView";
import Forbidden from "./Forbidden";
import axios from "axios";

export default function Products() {
  const navigate = useNavigate();
  const dataLimit = 10;
  const pageLimit = 5;
  let { catData, name } = useParams();
  const [data, setData] = useState([]);
  const [sortedArr, setSortedArr] = useState([]);
  const [category, setCategory] = useState("");
  const [ascDesc, setAscDesc] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isGridView, setIsGridView] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState("");
  // const [tempData, setTempData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const pages = Math.round(data.length / dataLimit);

  const LoadingSpinner = () => {
    return (<Spinner hidden={isLoading} animation="border" variant="success" role="status" style={{marginLeft: '50%', marginTop: '5%'}}>
          <span className="visually-hidden">Loading...</span>
        </Spinner>
    )}
  // data slice for single page
  const getPaginatedData = () => {
    const startIndex = currentPage * dataLimit - dataLimit;
    const endIndex = startIndex + dataLimit;
    return tempArr.slice(startIndex, endIndex);
  };

  // set page number by changing them
  function changePage(event) {
    const pageNumber = Number(event.target.textContent);
    setCurrentPage(pageNumber);
  }

  // give the pagination by datalimit and current page
  const getPaginationGroup = () => {
    // console.log(tempArr.length);
    let start = Math.floor((currentPage - 1) / dataLimit) * dataLimit;
    // console.log(start);
    return new Array(pageLimit).fill().map((_, idx) => {
      // console.log(idx);
      return start + idx + 1;
    });
  };

  // reduce page number for go to prevpage
  const handlePreviousClick = () => {
    setCurrentPage((currentPage) => currentPage - 1);
  };

  // reduce page number for go to nextpage
  const handleNextClick = () => {
    setCurrentPage((currentPage) => currentPage + 1);
  };

  // jump onto first page
  const handleFirstClick = () => {
    setCurrentPage(1);
  };

  // jump onto last page
  const handleLastClick = () => {
    setCurrentPage(pages);
  };

  // view change by radio value
  const ViewData = () => {
    if (isGridView === true) {
      return <GridView props={getPaginatedData()} />;
    } else if (isGridView === false) {
      return <ListView props={getPaginatedData()} />;
    }
  };

  // sort data into asc || desc
  const handleSelect = (e) => {
    if (e === "Ascending") {
      const sortedAscending = data.sort((a, b) => a.price - b.price);
      setSortedArr([...sortedAscending]);
      setAscDesc("Ascending");
    } else if (e === "Descending") {
      const sortedDescending = data.sort((a, b) => b.price - a.price);
      setSortedArr([...sortedDescending]);
      setAscDesc("Descending");
    }
  };

  // get data for search query

  const arrayData = data.map((items, i) => {
    return `${items.category}`;
  });
  const uniqueArr = [...new Set(arrayData)];

  // store unique name
  const arrayDataForSearch = data.map((items, i) => {
    return `${items.name}`;
  });
  const uniqueArrForSearch = [...new Set(arrayDataForSearch)];

  // filter data by each character
  const handleSearchClick = (e) => {
    // console.log(searchQuery);
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
    setSearchQuery(value);
  };

  // after click search button set value into input
  const onHandleSuggest = (searchQuery) => {
    setSearchQuery(searchQuery);
    setSuggestions([]);
  };

  // filter all code according to category and search name
  const tempArr = data
    .filter((item) => {
      if (category === "" && catData === undefined) return item;
      else if (catData !== undefined)
        return item.category.toLowerCase() === catData.toLowerCase() && item;
      else
        return item.category.toLowerCase() === category.toLowerCase() && item;
    })
    .filter((item) => {
      if (name === undefined)
        return (
          item.name.toLowerCase().includes(searchText.toLowerCase()) && item
        );
      else return item.name.toLowerCase().includes(name.toLowerCase()) && item;
    });

  useEffect(() => {
    // fetch data using (http://60ff90a3bca46600171cf36d.mockapi.io/api/products) API & store into localStorage also.
    setIsLoading(false);
    const api = axios.create({
      baseURL: "http://60ff90a3bca46600171cf36d.mockapi.io/api/products",
    });
    api
      .get()
      .then((res) => {
        setData(res.data);
        setIsLoading(true);
        localStorage.setItem("Data", JSON.stringify(data));
      })
      .catch((err) => {
        console.log(err);
      });
    // const postData = {
    //   "name": "nikunj",
    //   "airline": 1232,
    //   "trips": 300,
    // }
    // // axios.get('https://api.instantwebtools.net/v1/passenger').then((res) => console.log(res.data.data));
    // try {
    //   axios.post('https://api.instantwebtools.net/v1/passenger', postData).then((res) => {
    //     console.log(res.data);
    //     setTempData(res.data);
    //   })
    // } catch (error) {
    //   console.log(error);
    // }
    // fetch("http://60ff90a3bca46600171cf36d.mockapi.io/api/products")
    //   .then((res) => {
    //     if (!res.ok) {
    //       throw res;
    //     }
    //     return res.json();
    //   })
    //   .then((data) => {
    //     setData(data);
    //     localStorage.setItem("Data", JSON.stringify(data));
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  }, []);
  return (
    <div>
      <div className=" container mt-5 mb-3 mr-3 d-flex justify-content-between">
        {/* Asc || Desc */}
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
          {/* Grid || List View  */}
          <ButtonGroup>
            <ToggleButton
              type="radio"
              variant={hover ? "outline-success" : ""}
              name="radio"
              value={isGridView}
              checked={isGridView}
              onClick={() => setIsGridView(true)}
            >
              Grid
            </ToggleButton>
            <ToggleButton
              type="radio"
              variant={hover ? "outline-success" : ""}
              name="radio"
              value={!isGridView}
              checked={!isGridView}
              onClick={(e) => setIsGridView(false)}
            >
              List
            </ToggleButton>
          </ButtonGroup>
        </div>
      </div>
      <hr></hr>
      <Container>
        <div className="d-flex p-2">
          {/* dropdown for category */}
          <DropdownButton
            variant="success"
            alignRight
            className="me-3"
            title="Find Category"
            id="dropdown-menu-align-right"
            onSelect={(category) => {
              setCategory(category);
              navigate(`/${category}/Products`);
              localStorage.setItem("category", category);
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
          {/* searchbar for search by Name */}
          <Form
            className="d-flex w-25 flex-column"
            style={{
              zIndex: "100",
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
                value={searchQuery}
                // onFocus={handleFocus}
                onKeyDown={(e) => {
                  if (e.tabIndex === "0") {
                    setSearchText(searchQuery);
                    setSuggestions([]);
                    navigate(`/${catData}/Products/${searchQuery}`);
                  }
                }}
              />
              <Button
                variant="outline-success"
                onClick={() => {
                  setSearchText(searchQuery);
                  setSuggestions([]);
                  navigate(`/${catData}/Products/${searchQuery}`);
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
                    value={searchQuery}
                    className="suggestionsCss shadow-sm w-75 text-center"
                  >
                    {items}
                  </div>
                );
              })}
          </Form>
        </div>
        <LoadingSpinner />
        {/* display products */}
        {tempArr.length !== 0 ? <ViewData /> : <Forbidden />}
      </Container>
      {/* pagination */}
      <div
        className="container d-flex justify-content-around mt-5 mb-5 mr-3 top-0"
        style={{ zIndex: "1" }}
      >
        <Button
          disabled={currentPage <= 1}
          variant="success"
          onClick={handlePreviousClick}
        >
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
          Next &rarr;
        </Button>
      </div>
    </div>
  );
}
