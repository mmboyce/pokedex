import React from 'react';
import { render, screen } from '@testing-library/react';
import App, { getIdFromUrl } from './App';

describe('getIdFromUrl helper', () => {
  test('Get id from fake url', () => {
    expect(getIdFromUrl('pokemon/100/')).toBe('100');
  });

  test('Get id from real url', () => {
    expect(getIdFromUrl('https://pokeapi.co/api/v2/pokemon/152/')).toBe('152');
  });

  test('Get id without trailing slash', () => {
    expect(getIdFromUrl('/pokemon/23')).toBe('23');
  });
});

describe('App works with mocked fetch', () => {
  let mockSuccessResponse;
  let mockJsonPromise;
  let mockFetchPromise;

  // setup mock
  beforeEach(() => {
    mockSuccessResponse = {
      results: [
        {
          name: 'pokemon-1',
          url: 'pokemon/1/',
        },
        {
          name: 'pokemon-2',
          url: 'pokemon/2/',
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

  test('App mounted', () => {
    const { getByTestId } = render(<App />);
    const appRootElement = getByTestId('App-Root');
    expect(appRootElement).toBeInTheDocument();
  });
});

describe('Format Results', () => {
  let mockSuccessResponse;
  let mockJsonPromise;
  let mockFetchPromise;

  // setup mock
  beforeEach(() => {
    mockSuccessResponse = {
      results: [
        {
          name: 'pokemon-1',
          url: 'pokemon/1/',
        },
        {
          name: 'pokemon-2',
          url: 'pokemon/2/',
        },
        {
          name: 'pokemon-4',
          url: 'pokemon/4/',
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

  test('Formatted Results found in Document', async () => {
    render(<App />);

    expect(await screen.findByText('pokemon 1')).toBeInTheDocument();
    expect(await screen.findByText('pokemon 2')).toBeInTheDocument();
    expect(await screen.findByText('#001:')).toBeInTheDocument();
    expect(await screen.findByText('#002:')).toBeInTheDocument();
  });

  test('Sequential jump ceases to be included', async () => {
    render(<App />);

    const sidebarElement = await screen.findByTestId('sidebar');
    expect(sidebarElement.lastChild).toHaveTextContent('#002:');
  });
});

describe('Respone not ok', () => {
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

  test('Displays error message', async () => {
    render(<App />);

    expect(await screen.findByTestId('error-msg-app')).toBeInTheDocument();
  });
});
