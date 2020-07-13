import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Sprite, spriteStates, loadingSvgSrc } from '../components/Pokedex';

const testSpriteSrc = `${process.env.PUBLIC_URL}/logo192.png`;

describe('Sprite mounts', () => {
  test('Component displays loading gif', async () => {
    render(<Sprite sprite={testSpriteSrc} name="test" />);

    /**
     * @type {HTMLImageElement}
     */
    const loadingSprite = await screen.findByTestId('loading-image');
    expect(loadingSprite).toBeInTheDocument();
    expect(loadingSprite.src).toContain(loadingSvgSrc);
    expect(loadingSprite).toHaveClass(spriteStates.spriteVisible);
    expect(loadingSprite).not.toHaveClass(spriteStates.spriteHidden);
    expect(loadingSprite.alt).toBe('Buffering test');

    /**
     * @type {HTMLImageElement}
     */
    const spriteElement = await screen.findByTestId('sprite-image');
    expect(spriteElement).toBeInTheDocument();
    expect(spriteElement.src).toContain(testSpriteSrc);
    expect(spriteElement).toHaveClass(spriteStates.spriteHidden);
    expect(spriteElement).not.toHaveClass(spriteStates.spriteVisible);
    expect(spriteElement.alt).toBe('test');
  });
});

describe('Sprite handles image load', () => {
  test('Component displays sprite after load', async () => {
    render(<Sprite sprite={testSpriteSrc} name="test" />);

    /**
     * @type {HTMLImageElement}
     */
    const loadingSprite = await screen.findByTestId('loading-image');
    expect(loadingSprite).toHaveClass(spriteStates.spriteVisible);
    expect(loadingSprite).not.toHaveClass(spriteStates.spriteHidden);
    /**
     * @type {HTMLImageElement}
     */
    const spriteElement = await screen.findByTestId('sprite-image');
    expect(spriteElement).toHaveClass(spriteStates.spriteHidden);
    expect(spriteElement).not.toHaveClass(spriteStates.spriteVisible);

    fireEvent.load(spriteElement);

    expect(loadingSprite).not.toHaveClass(spriteStates.spriteVisible);
    expect(loadingSprite).toHaveClass(spriteStates.spriteHidden);

    expect(spriteElement).not.toHaveClass(spriteStates.spriteHidden);
    expect(spriteElement).toHaveClass(spriteStates.spriteVisible);
  });
});
