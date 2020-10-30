import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Container } from 'react-bootstrap';

import './App.scss';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Container className="pt-5">
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Register} />
          <Route component={NotFound} />
        </Switch>
      </BrowserRouter>
    </Container>
  );
}

export default App;
