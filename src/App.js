import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import ViewProductDetail from './component/ViewProductDetail';
import Forbidden from './component/Forbidden';
import Products from './component/Products';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route exact path="/" element={<Products />}></Route>
          <Route exact path="/:catData/Products" element={<Products />}></Route>
          <Route exact path="/:catData/Products/:name" element={<Products />}></Route>
          <Route exact path="/forbidden" element={<Forbidden />}></Route>
          <Route exact path="/Product/:slug" element={<Products />}></Route>
          <Route exact path="/:catData/Products/Product/:slug" element={<ViewProductDetail />}></Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
