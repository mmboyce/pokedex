import React from 'react';
import { render, screen } from '@testing-library/react';
import { Type } from '../components/Pokedex';

describe('Type Mounts', () => {
  let ONE_TYPE;
  let TWO_TYPES;

  beforeEach(() => {
    ONE_TYPE = [
      {
        slot: 1,
        type: {
          name: 'grass',
          url: 'url',
        },
      },
    ];

    TWO_TYPES = [
      {
        slot: 1,
        type: {
          name: 'water',
          url: 'url',
        },
      },
      {
        slot: 2,
        type: {
          name: 'flying',
          url: 'url',
        },
      },
    ];
  });

  test('Type Component with only one type', () => {
    const types = ONE_TYPE;
    render(<Type types={types} />);

    const typesElement = screen.getByTestId('types');
    expect(typesElement).toBeInTheDocument();
    expect(typesElement.children.length).toBe(1);
  });

  test('Type Component with two types', () => {
    const types = TWO_TYPES;
    render(<Type types={types} />);

    const typesElement = screen.getByTestId('types');
    expect(typesElement).toBeInTheDocument();
    expect(typesElement.children.length).toBe(2);
  });

  test('Class Names are correct', () => {
    const types = TWO_TYPES;
    render(<Type types={types} />);

    const typesElement = screen.getByTestId('types');
    expect(typesElement).toBeInTheDocument();
    const { children } = typesElement;
    expect(children[0]).toHaveClass('water');
    expect(children[1]).toHaveClass('flying');
  });
});
