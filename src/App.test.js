import React from 'react';
import { render } from '@testing-library/react';
import App, { getIdFromUrl } from './App';

describe('getIdFromUrl helper', () => {
  test('Get id from fake url', () => {
    expect(getIdFromUrl('pokemon/100/'))
      .toBe('100');
  });

  test('Get id from real url', () => {
    expect(getIdFromUrl('https://pokeapi.co/api/v2/pokemon/152/'))
      .toBe('152');
  });
});

describe('App works with mocked fetch', () => {
  let mockSuccessResponse;
  let mockJsonPromise;
  let mockFetchPromise;

  beforeEach(() => {
    mockSuccessResponse = {
      results: [
        {
          name: 'pokemon-1',
          url: 'pokemon/1/',
        },
        {
          name: 'pokemon-2',
          url: 'pokemon/1/',
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

  afterEach(() => global.fetch.mockClear());

  test('App mounted', () => {
    const { getByTestId } = render(<App />);
    const appRootElement = getByTestId('App-Root');
    expect(appRootElement).toBeInTheDocument();
  });
});
