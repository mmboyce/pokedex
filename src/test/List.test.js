import React from 'react';
import { screen } from '@testing-library/react';
import renderWithRouter from '../testHelpers';
import List from '../components/List';

describe('Component mounts', () => {
  const RESULTS = [];

  for (let i = 1; i < 1001; i += 1) {
    RESULTS.push({
      name: `pokemon ${i}`,
      url: `/pokemon/${i}`,
      id: `${i}`,
    });
  }

  test('Has correct props', () => {
    renderWithRouter(
      [<List results={RESULTS} />],
      ['/1'],
    );

    const sidebarElement = screen.getByTestId('sidebar');
    expect(sidebarElement).toBeInTheDocument();
    expect(sidebarElement.childElementCount).toBe(1001);
  });

  test('ID has correct amount of zeroes', () => {
    renderWithRouter(
      [<List results={RESULTS} />],
      ['/1'],
    );
    const firstElement = screen.getByTestId('sidebar-id-1');
    const tenthElement = screen.getByTestId('sidebar-id-10');
    const hundredthElement = screen.getByTestId('sidebar-id-100');
    const thousandthElement = screen.getByTestId('sidebar-id-1000');

    expect(firstElement).toHaveTextContent('#0001:');
    expect(tenthElement).toHaveTextContent('#0010:');
    expect(hundredthElement).toHaveTextContent('#0100:');
    expect(thousandthElement).toHaveTextContent('#1000:');
  });
});
