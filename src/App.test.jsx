import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App layout', () => {
  it('renders a header section', () => {
    const { container } = render(<App />);
    expect(container.querySelector('header')).toBeInTheDocument();
  });

  it('renders an about section', () => {
    const { container } = render(<App />);
    // About renders a <section> with h2 "About"
    const sections = container.querySelectorAll('section');
    const aboutSection = Array.from(sections).find(
      (s) => s.querySelector('h2')?.textContent === 'About'
    );
    expect(aboutSection).toBeTruthy();
  });

  it('renders a skills section', () => {
    const { container } = render(<App />);
    const sections = container.querySelectorAll('section');
    const skillsSection = Array.from(sections).find(
      (s) => s.querySelector('h2')?.textContent === 'Skills'
    );
    expect(skillsSection).toBeTruthy();
  });

  it('renders a footer section', () => {
    const { container } = render(<App />);
    expect(container.querySelector('footer')).toBeInTheDocument();
  });

  it('renders components in order: Header → About → Skills → Footer', () => {
    const { container } = render(<App />);
    const portfolio = container.querySelector('.portfolio');
    const children = Array.from(portfolio.children);
    expect(children[0].tagName.toLowerCase()).toBe('header');
    // About and Skills are <section> elements
    expect(children[1].tagName.toLowerCase()).toBe('section');
    expect(children[2].tagName.toLowerCase()).toBe('section');
    expect(children[3].tagName.toLowerCase()).toBe('footer');
  });

  it('renders portfolioData name in the document', () => {
    const { getByText } = render(<App />);
    expect(getByText('Alex Johnson')).toBeInTheDocument();
  });

  it('renders portfolioData bio in the document', () => {
    const { getByText } = render(<App />);
    expect(
      getByText('A passionate frontend developer with experience building modern web applications.')
    ).toBeInTheDocument();
  });

  it('renders portfolioData email in the document', () => {
    const { getByText } = render(<App />);
    expect(getByText('alex@example.com')).toBeInTheDocument();
  });

  it('renders portfolioData skills in the document', () => {
    const { getByText } = render(<App />);
    expect(getByText('React')).toBeInTheDocument();
    expect(getByText('JavaScript')).toBeInTheDocument();
    expect(getByText('CSS')).toBeInTheDocument();
  });
});
