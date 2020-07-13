import React from 'react';
import { render, screen } from '@testing-library/react';
import ErrorDisplay from '../components/ErrorDisplay';

describe('ErrorDisplay Mounts', () => {
  test('component mounts', () => {
    render(<ErrorDisplay errWhen="trying to display" message="error message" />);
    const errorDisplayElement = screen.getByTestId('error-msg');

    expect(errorDisplayElement).toBeInTheDocument();
    expect(errorDisplayElement).toHaveTextContent('Error when trying to display: error message');
  });
});
