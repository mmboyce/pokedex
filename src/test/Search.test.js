import React from 'react';
import {
  render, screen, fireEvent,
} from '@testing-library/react';
import renderWithRouter from '../testHelpers';
import Search, { capitalizeString, handleMatchPokemon } from '../components/Search';

describe('Test Helpers', () => {
  test('handle match pokemon', () => {
    const pikachu = { name: 'pikachu' };

    expect(handleMatchPokemon(pikachu, 'pika')).toBeTruthy();
    expect(handleMatchPokemon(pikachu, 'squirtle')).toBeFalsy();
  });

  test('capitalize string', () => {
    expect(capitalizeString('squirtle')).toBe('Squirtle');
    expect(capitalizeString('squirtle two')).toBe('Squirtle two');
  });
});

const RESULTS = [];
for (let i = 1; i < 50; i += 1) {
  RESULTS.push({
    name: `pokemon ${i}`,
    url: `/pokemon/${i}`,
    id: `${i}`,
  });
}

// onFocus and onBlur are tested in MainContainer.test.js
const mockFn = () => true;

describe('Component mounts', () => {
  test('Component has correct props.', () => {
    render(<Search
      results={RESULTS}
      onBlur={mockFn}
      onFocus={mockFn}
    />);

    const searchBoxElement = screen.getByTestId('search-box');
    expect(searchBoxElement).toBeInTheDocument();
    expect(searchBoxElement).toHaveValue('');
  });

  test('Loads value from previous visit.', () => {
    // eslint-disable-next-line no-proto
    jest.spyOn(window.localStorage.__proto__, 'getItem').mockReturnValue('lastValue');

    render(<Search
      results={RESULTS}
      onBlur={mockFn}
      onFocus={mockFn}
    />);

    const searchBoxElement = screen.getByTestId('search-box');
    expect(searchBoxElement).toBeInTheDocument();
    expect(searchBoxElement).toHaveValue('lastValue');
  });
});

describe('Handles Events', () => {
  test('handles textbox changes', () => {
    render(<Search
      results={RESULTS}
      onBlur={mockFn}
      onFocus={mockFn}
    />);

    const searchBoxElement = screen.getByTestId('search-box');
    fireEvent.change(searchBoxElement, {
      target: { value: 'change' },
    });

    expect(searchBoxElement).toHaveValue('change');
  });

  test('renders menu', async () => {
    render(<Search
      results={RESULTS}
      onBlur={mockFn}
      onFocus={mockFn}
    />);

    const searchBoxElement = screen.getByTestId('search-box');
    fireEvent.focus(searchBoxElement);
    fireEvent.change(searchBoxElement, {
      target: { value: 'poke' },
    });

    const firstItemElement = await screen.findByTestId('item-1');
    expect(firstItemElement).toBeInTheDocument();
  });

  test('handles selection', async () => {
    renderWithRouter([<Search
      results={RESULTS}
      onBlur={mockFn}
      onFocus={mockFn}
    />],
    ['/1']);

    const searchBoxElement = screen.getByTestId('search-box');
    fireEvent.focus(searchBoxElement);
    fireEvent.change(searchBoxElement, {
      target: { value: 'poke' },
    });

    const firstItemElement = await screen.findByTestId('item-1');
    fireEvent.click(firstItemElement);

    expect(searchBoxElement).toHaveValue('Pokemon 1');
  });

  test('handles invalid entry', () => {
    renderWithRouter([<Search
      results={RESULTS}
      onBlur={mockFn}
      onFocus={mockFn}
    />],
    ['/1']);

    const searchBoxElement = screen.getByTestId('search-box');
    fireEvent.focus(searchBoxElement);
    fireEvent.change(searchBoxElement, {
      target: { value: 'there will not be a match for this' },
    });
    fireEvent.keyDown(searchBoxElement, { keyCode: 13 });

    const menuElement = screen.queryByTestId('menu');
    expect(menuElement).not.toBeInTheDocument();
  });
});
