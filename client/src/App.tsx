import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Container } from 'react-bootstrap';

import './App.scss';

import Register from './pages/Register';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Home from './pages/Home';
import { AuthProvider } from './context/auth';

function App() {
  return (
    <AuthProvider>
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
    </AuthProvider>
  );
}

export default App;
