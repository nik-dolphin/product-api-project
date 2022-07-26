import { hover } from '@testing-library/user-event/dist/hover';
import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from "react-router-dom";
import {Button, ButtonGroup, Container, Dropdown, DropdownButton, Form, FormControl, ToggleButton } from 'react-bootstrap-v5';
import ListView from './ListView';
import GridView from './GridView';
import Forbidden from './Forbidden';

export default function Demo() {
  localStorage.removeItem('searchData');
  const navigate = useNavigate();
  let dataLimit = 10;
  const pageLimit = 5;
  const [data, setData] = useState([]);
  const [sortedArr, setSortedArr] = useState([]);
  const [ascDesc, setAscDesc] = useState("");
  const [isGridView, setIsGridView] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [text, setText] = useState('');
  const [suggestions, setSuggestions] = useState('');
  const pages = Math.round(data.length / dataLimit);

  useEffect(() => {
    // fetch data using (http://60ff90a3bca46600171cf36d.mockapi.io/api/products) API & store into localStorage also.
    fetch("http://60ff90a3bca46600171cf36d.mockapi.io/api/products")
    .then((res) => {
      if (!res.ok) {
        throw res;
      }
      return res.json();
    })
    .then((data) => {
      setData(data);
      localStorage.setItem('Data', JSON.stringify(data));
    })
    .catch((err) => {
      console.log(err);
    })
  }, []);

  // data slice for single page 
  const getPaginatedData = () => {
    const startIndex = currentPage * dataLimit - dataLimit;
    const endIndex = startIndex + dataLimit;
    return data.slice(startIndex, endIndex);
  };

  // set page number by changing them
  function changePage(event) {
    const pageNumber = Number(event.target.textContent);
    setCurrentPage(pageNumber);
  }

  // give the pagination by datalimit and current page
  const getPaginationGroup = () => {
    let start = Math.floor((currentPage - 1) / dataLimit) * dataLimit;
    return new Array(pageLimit).fill().map((_, idx) => {
     return start + idx + 1;
    });
  };

  // reduce page number for go to prevpage
  const handlePreviousClick = () => {
    setCurrentPage((currentPage) => currentPage - 1 );
  }

  // reduce page number for go to nextpage
  const handleNextClick = () => {
    setCurrentPage((currentPage) => currentPage + 1);
  }

  // jump onto first page
  const handleFirstClick = () => {
    setCurrentPage(1);
  }

  // jump onto last page
  const handleLastClick = () => {
    setCurrentPage(pages);
  }

  // store unique category
  const arrayData = data.map((items, i) => {
    return `${items.category}`;
  })
  const uniqueArr = [...new Set(arrayData)];

  // store unique name
  const arrayDataForSearch = data.map((items, i) => {
    return `${items.name}`;
  })
  const uniqueArrForSearch = [...new Set(arrayDataForSearch)];

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

   // view change by radio value
   const ViewData = () => {
    if (isGridView === true) {
      return <GridView props={getPaginatedData()} />;
    } else if (isGridView === false) {
      return <ListView props={getPaginatedData()} />;
    }
  };

  // auto search bar data
  const handleSearchClick = (text) => {
    let matches = [];
    if (text.length>0) {
      matches = uniqueArrForSearch.filter(user => {
        const regex = new RegExp(`${text}`, "gi");
        return user.match(regex); 
      })
    }
    setSuggestions(matches);
    setText(text);
  }

  // by click on suggest element store data into searchbar input
  const onHandleSuggest = (text) => {
    setText(text);
    setSuggestions([]);
  }

  return (
    <>
      <div className=' container mt-5 mb-3 mr-3 d-flex justify-content-between'>
        {/* Grid || List View & Asc || Desc */}
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
              onClick={() => setIsGridView(false)}
            >
              List
            </ToggleButton>
          </ButtonGroup>
        </div>
      </div><hr></hr>
      <Container>
      <div className='d-flex'>
          <DropdownButton
          variant="success"
          alignRight
          className='me-3'
          title="Find Category"
          id="dropdown-menu-align-right"
          onSelect={(category) => {
            navigate(`/${category}/Products`);
          }}
          >
          {uniqueArr.map((items, i) => {
            return <Dropdown.Item key={i} eventKey={items}>{items}</Dropdown.Item>
          })}
          </DropdownButton>
          <Form className="d-flex w-25 flex-column" style={{zIndex: '10000', position: 'absolute' , marginLeft: '150px'}}>
            <div className='d-flex flex-row'>
              <FormControl
                type="search"
                autoComplete='off'
                placeholder="Search By Name"
                className="me-2"
                aria-label="Search"
                onChange={(e) => handleSearchClick(e.target.value)}
                value={text}
                onKeyDown={(e) => { if (e.key === 'Enter') { 
                  navigate(`/${text}/Products`);
                  localStorage.setItem('searchData', text);
                }}}
              />
                <Button variant="outline-success" onClick={() => {
                navigate(`/${text}/Products`);
                localStorage.setItem('searchData', text);
              }}>Search</Button>
            </div>
            {suggestions && suggestions.map((items, i) => {
              return <div key={i} onClick={() => onHandleSuggest(items)} value={text} className='suggestionsCss shadow-sm w-75 text-center'
               >{items}</div>
            })}
          </Form>
        </div>
        {data.length !== 0 ? <ViewData /> : <Forbidden />}
        <Outlet></Outlet>
      </Container>
        <div className='container d-flex justify-content-around mt-5 mb-5 mr-3 top-0' style={{zIndex: '1'}}>
          <Button disabled={currentPage<=1} variant="success" onClick={handlePreviousClick}> &larr; Previous</Button>
          <div>
            <Button onClick={handleFirstClick} variant="success">&lArr;</Button>
            {getPaginationGroup().map((item, index) => (
              <Button
                variant="success"
                key={index}
                onClick={changePage}
                className={`${currentPage === item ? 'active' : null} mx-1 my-1`}
              >
                <span>{item}</span>
              </Button>
            ))}
            <Button onClick={handleLastClick} variant="success">&rArr;</Button>
          </div>
          <Button className={`${currentPage === pages ? 'disabled' : ''}`} variant="success" onClick={handleNextClick}>Next &rarr; </Button>
        </div>
    </>
  )
}
