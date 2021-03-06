import React from 'react';
import {
  fireEvent,
} from '@testing-library/react';
import { MainContainer } from '../App';
import renderWithRouter from '../testHelpers';

/**
 * @type {Array}
 */
let testResults;

const TEST_RESULTS_ONE = [
  {
    name: 'testName',
    id: '1',
    url: 'testURL',
  },
];

const TEST_RESULTS_TWO = [
  {
    name: 'testName',
    id: '1',
    url: 'testURL',
  },
  {
    name: 'testName2',
    id: '2',
    url: 'testUrl2',
  },
];

describe('MainContainer mounts', () => {
  beforeEach(() => {
    testResults = TEST_RESULTS_ONE;
  });

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
  beforeEach(() => {
    testResults = TEST_RESULTS_ONE;
  });

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

describe('Edge Case Redirects', () => {
  beforeEach(() => {
    testResults = TEST_RESULTS_TWO;
  });

  test('Redirects to last ID if param greater than limit', () => {
    const { getByTestId } = renderWithRouter(
      [<MainContainer results={testResults} />],
      ['/3'],
    );

    const idTextElement = getByTestId('id-text');
    expect(idTextElement).toHaveTextContent('#2');
  });

  test('Redirects to first ID if param less than 1', () => {
    const { getByTestId } = renderWithRouter(
      [<MainContainer results={testResults} />],
      ['/0'],
    );

    const idTextElement = getByTestId('id-text');
    expect(idTextElement).toHaveTextContent('#1');
  });

  test('Redirects to first ID if param is not numerical', () => {
    const { getByTestId } = renderWithRouter(
      [<MainContainer results={testResults} />],
      ['/notNumerical'],
    );

    const idTextElement = getByTestId('id-text');
    expect(idTextElement).toHaveTextContent('#1');
  });
});
