import React from 'react';
import { render } from '@testing-library/react';
import { Route, MemoryRouter } from 'react-router-dom';

/**
 * This method is a helper to provide url params to mainContainer,
 * kinda like a mock. It accomplishes this by wrapping the children in
 * a MemoryRouter.
 * @param {JSX.Element[]} children An array of elements to wrap
 * @param {string[]} routeEntries The route entries to mock.
 * @returns {JSX.Element} The children wrapped in a MemoryRouter.
 * @example
 * renderWithRouter(
 *    [<Component />],
 *     ['/1'],          //route
 *  );
 */
const renderWithRouter = (children, routeEntries) => (
  render(
    <MemoryRouter initialEntries={routeEntries}>
      <Route path="/:id">
        {children}
      </Route>
    </MemoryRouter>,
  )
);

export default renderWithRouter;
