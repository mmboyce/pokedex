import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Route, MemoryRouter } from 'react-router-dom';
import { MainContainer } from '../App';

/**
 * This method is a helper to provide url params to mainContainer,
 * kinda like a mock. It accomplishes this by wrapping the children in
 * a MemoryRouter.
 * @param {JSX.Element[]} children An array of elements to wrap
 * @param {string[]} routeEntries The route entries to mock.
 * @returns {JSX.Element} The children wrapped in a MemoryRouter.
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

let testResults;

beforeEach(() => {
  testResults = [
    {
      name: 'testName',
      id: '1',
      url: 'testURL',
    },
  ];
});

describe('MainContainer mounts', () => {
  test('Renders MainContainer', () => {
    const { getByTestId } = renderWithRouter(
      [<MainContainer results={testResults} />],
      ['/1'],
    );

    const mainContainerElement = getByTestId('main-container');
    expect(mainContainerElement).toBeInTheDocument();
  });
});

describe('MainContainer Events Handled', () => {
  test('Search Box Focus Handled', () => {
    const { getByTestId } = renderWithRouter(
      [<MainContainer results={testResults} />],
      ['/1'],
    );
    const pokedexElement = getByTestId('pokedex');
    const searchBoxElement = getByTestId('search-box');

    expect(pokedexElement).not.toHaveClass('search-box-focused');

    fireEvent.focus(searchBoxElement);
    expect(pokedexElement).toHaveClass('search-box-focused');
  });

  test('Search Box Focus Lost', () => {
    const { getByTestId } = renderWithRouter(
      [<MainContainer results={testResults} />],
      ['/1'],
    );
    const pokedexElement = getByTestId('pokedex');
    const searchBoxElement = getByTestId('search-box');

    fireEvent.focus(searchBoxElement);
    expect(pokedexElement).toHaveClass('search-box-focused');

    fireEvent.blur(searchBoxElement);
    expect(pokedexElement).not.toHaveClass('search-box-focused');
  });
});
