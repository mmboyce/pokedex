import React from 'react';
import { render } from '@testing-library/react';
import { LoadingScreen } from '../App';

describe('LoadingScreen mounts', () => {
  test('renders LoadingScreen', () => {
    const { getByTestId } = render(<LoadingScreen />);
    const loadingScreenElement = getByTestId('loading-screen');

    expect(loadingScreenElement).toBeInTheDocument();
  });
});

describe('LoadingScreen className prop', () => {
  test('Default className', () => {
    const { getByTestId } = render(<LoadingScreen />);
    const loadingScreenElement = getByTestId('loading-screen');

    expect(loadingScreenElement).toContainHTML('class=""');
  });

  test('Loaded className', () => {
    const { getByTestId } = render(<LoadingScreen className="loaded" />);
    const loadingScreenElement = getByTestId('loading-screen');

    expect(loadingScreenElement).toHaveClass('loaded');
  });
});
