import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Container } from 'react-bootstrap';

import './App.scss';

import Register from './pages/Register';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Home from './pages/Home';
import { AuthProvider } from './context/auth';
import DynamicRoute from './utils/DynamicRoutes';

function App() {
  return (
    <AuthProvider>
      <Container className="pt-5">
        <BrowserRouter>
          <Switch>
            <DynamicRoute
              exact
              path="/"
              component={Home}
              authenticated={true} // authenticated user
            />
            <DynamicRoute
              exact
              path="/register"
              component={Register}
              authenticated={false} // guest
            />
            <DynamicRoute
              exact
              path="/login"
              component={Login}
              authenticated={false} // guest
            />
            <Route component={NotFound} />
          </Switch>
        </BrowserRouter>
      </Container>
    </AuthProvider>
  );
}

export default App;
