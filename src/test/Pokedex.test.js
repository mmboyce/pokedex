import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import Pokedex, { loadingText } from '../components/Pokedex';
import renderWithRouter from './helpers';

describe('Component mounts with mock data', () => {
  let mockSuccessResponse;
  let mockJsonPromise;
  let mockFetchPromise;

  // setup mock
  beforeEach(() => {
    mockSuccessResponse = {
      name: 'pokemon-1',
      weight: 20,
      height: 30,
      sprites: {
        front_default: 'url.png',
      },
      types: [
        {
          type: 'normal',
        },
      ],
    };
    mockJsonPromise = Promise.resolve(mockSuccessResponse);
    mockFetchPromise = Promise.resolve({
      ok: true,
      json: () => mockJsonPromise,
    });
    jest.spyOn(global, 'fetch').mockImplementation(() => mockFetchPromise);
  });

  // cleanup mock
  afterEach(() => global.fetch.mockClear());

  test('Pokedex mounts', () => {
    renderWithRouter(
      [<Pokedex
        id="1"
        pokeApiUrl="/pokemon"
        resultsLength="3"
        className=""
      />],
      ['/1'],
    );

    const pokedexElement = screen.getByTestId('pokedex');
    expect(pokedexElement).toBeInTheDocument();
  });

  test('Pokedex information is loading', () => {
    renderWithRouter(
      [<Pokedex
        id="1"
        pokeApiUrl="/pokemon"
        resultsLength="3"
        className=""
      />],
      ['/1'],
    );

    const nameElement = screen.getByTestId('name');
    const heightElement = screen.getByTestId('height');
    const weightElement = screen.getByTestId('weight');

    expect(nameElement).toHaveTextContent(loadingText);
    expect(weightElement).toHaveTextContent(loadingText);
    expect(heightElement).toHaveTextContent(loadingText);
  });

  test('Pokedex information loads', async () => {
    renderWithRouter(
      [<Pokedex
        id="1"
        pokeApiUrl="/pokemon"
        resultsLength="3"
        className=""
      />],
      ['/1'],
    );

    expect(await screen.findByText('pokemon 1')).toBeInTheDocument();
    expect(await screen.findByText('3m')).toBeInTheDocument();
    expect(await screen.findByText('2kg')).toBeInTheDocument();
  });
});

describe('Component encounters bad response', () => {
  let mockFetchPromise;

  // setup mock
  beforeEach(() => {
    mockFetchPromise = Promise.resolve({
      ok: false,
      status: '404',
    });
    jest.spyOn(global, 'fetch').mockImplementation(() => mockFetchPromise);
  });

  // cleanup mock
  afterEach(() => global.fetch.mockClear());

  test('Handles error', async () => {
    renderWithRouter(
      [<Pokedex
        id="1"
        pokeApiUrl="/pokemon"
        resultsLength="3"
        className=""
      />],
      ['/1'],
    );

    expect(await screen.findByTestId('error-msg')).toBeInTheDocument();
  });
});

describe('Listens to events', () => {
  let mockSuccessResponse;
  let mockJsonPromise;
  let mockFetchPromise;

  // setup mock
  beforeEach(() => {
    mockSuccessResponse = {
      name: 'pokemon-1',
      weight: 20,
      height: 30,
      sprites: {
        front_default: 'url.png',
      },
      types: [
        {
          type: 'normal',
        },
      ],
    };
    mockJsonPromise = Promise.resolve(mockSuccessResponse);
    mockFetchPromise = Promise.resolve({
      ok: true,
      json: () => mockJsonPromise,
    });
    jest.spyOn(global, 'fetch').mockImplementation(() => mockFetchPromise);
  });

  // cleanup mock
  afterEach(() => global.fetch.mockClear());

  test('listens to prev key navigation', () => {
    renderWithRouter(
      [<Pokedex
        id="1"
        pokeApiUrl="/pokemon"
        resultsLength="3"
        className=""
      />],
      ['/1'],
    );
    fireEvent.keyDown(document, { keyCode: 188, altKey: true });

    const pokedexElement = screen.getByTestId('pokedex');
    expect(pokedexElement.children).toHaveLength(0);
  });

  test('listens to next key navigation', () => {
    renderWithRouter(
      [<Pokedex
        id="1"
        pokeApiUrl="/pokemon"
        resultsLength="3"
        className=""
      />],
      ['/1'],
    );

    fireEvent.keyDown(document, { keyCode: 190, altKey: true });
    const pokedexElement = screen.getByTestId('pokedex');
    expect(pokedexElement.children).toHaveLength(0);
  });

  test('listens to prev nav click', () => {
    renderWithRouter(
      [<Pokedex
        id="1"
        pokeApiUrl="/pokemon"
        resultsLength="3"
        className=""
      />],
      ['/1'],
    );
    fireEvent.click(screen.getByTestId('prev'));

    const nameElement = screen.getByTestId('name');
    const heightElement = screen.getByTestId('height');
    const weightElement = screen.getByTestId('weight');

    expect(nameElement).toHaveTextContent(loadingText);
    expect(weightElement).toHaveTextContent(loadingText);
    expect(heightElement).toHaveTextContent(loadingText);
  });

  test('listens to next nav click', () => {
    renderWithRouter(
      [<Pokedex
        id="1"
        pokeApiUrl="/pokemon"
        resultsLength="3"
        className=""
      />],
      ['/1'],
    );
    fireEvent.click(screen.getByTestId('next'));

    const nameElement = screen.getByTestId('name');
    const heightElement = screen.getByTestId('height');
    const weightElement = screen.getByTestId('weight');

    expect(nameElement).toHaveTextContent(loadingText);
    expect(weightElement).toHaveTextContent(loadingText);
    expect(heightElement).toHaveTextContent(loadingText);
  });
});
