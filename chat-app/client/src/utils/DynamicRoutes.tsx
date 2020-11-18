import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';

import { useAuthState } from '../context/auth';

export default function DynamicRoutes(
  props: JSX.IntrinsicClassAttributes<Route<RouteProps>> &
    Readonly<RouteProps> &
    Readonly<{
      children?: React.ReactNode;
      authenticated?: boolean;
    }>
) {
  const { credentials } = useAuthState();

  if (props.authenticated && !credentials) {
    return <Redirect to="/login" />;
  }
  // TODO: it handles after dispatching
  // comment next redirection for avoiding
  // Warning: Can't perform a React state update on an unmounted component.
  else if (!props.authenticated && credentials) {
    return <Redirect to="/" />;
  } else return <Route component={props.component} {...props} />;
}
