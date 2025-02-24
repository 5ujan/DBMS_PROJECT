
import Signin from "./pages/Signin";
import Home from "./pages/Home"
import Error from "./pages/Error";
import Landing from "./pages/Landing";
import Profile from "./pages/Profile";

import { Route, Routes } from "react-router-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { AppProvider } from "./components/Context";
import Events from "./pages/Events";


function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route exact path='/' element={<Landing></Landing>}></Route>
          <Route exact path="/dashboard" element={<Home />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/events" element={<Events />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Error />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
