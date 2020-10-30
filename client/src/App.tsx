import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Container } from 'react-bootstrap';

import './App.scss';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Home from './pages/Home';

function App() {
  return (
    <Container className="pt-5">
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/login" component={Login} />
          <Route component={NotFound} />
        </Switch>
      </BrowserRouter>
    </Container>
  );
}

export default App;
