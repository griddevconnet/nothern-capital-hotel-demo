import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import ErrorFallback from './ErrorFallback';

const mockError = new Error('Test error message');
const mockResetErrorBoundary = jest.fn();

const renderWithRouter = (ui, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route);
  return render(<Router>{ui}</Router>);
};

describe('ErrorFallback Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders error message', () => {
    renderWithRouter(
      <ErrorFallback 
        error={mockError} 
        resetErrorBoundary={mockResetErrorBoundary} 
      />
    );
    
    expect(screen.getByText(/oops! something went wrong/i)).toBeInTheDocument();
    expect(screen.getByText(/test error message/i)).toBeInTheDocument();
  });

  it('shows stack trace in development mode', () => {
    const originalEnv = process.env;
    process.env = { ...originalEnv, NODE_ENV: 'development' };
    
    const errorWithStack = new Error('Test error');
    errorWithStack.stack = 'Error: Test error\n    at test.js:1:1';
    
    renderWithRouter(
      <ErrorFallback 
        error={errorWithStack}
        resetErrorBoundary={mockResetErrorBoundary} 
      />
    );
    
    expect(screen.getByText(/error: test error/i)).toBeInTheDocument();
    process.env = originalEnv;
  });

  it('calls resetErrorBoundary and navigates to home when home button is clicked', () => {
    renderWithRouter(
      <ErrorFallback 
        error={mockError} 
        resetErrorBoundary={mockResetErrorBoundary} 
      />
    );
    
    const homeButton = screen.getByRole('button', { name: /go to homepage/i });
    fireEvent.click(homeButton);
    
    expect(mockResetErrorBoundary).toHaveBeenCalledTimes(1);
    expect(window.location.pathname).toBe('/');
  });

  it('reloads the page when reload button is clicked', () => {
    const originalLocation = window.location;
    delete window.location;
    window.location = { ...originalLocation, reload: jest.fn() };
    
    renderWithRouter(
      <ErrorFallback 
        error={mockError} 
        resetErrorBoundary={mockResetErrorBoundary} 
      />
    );
    
    const reloadButton = screen.getByRole('button', { name: /reload page/i });
    fireEvent.click(reloadButton);
    
    expect(window.location.reload).toHaveBeenCalledTimes(1);
    
    window.location = originalLocation;
  });

  it('displays contact support link', () => {
    renderWithRouter(
      <ErrorFallback 
        error={mockError} 
        resetErrorBoundary={mockResetErrorBoundary} 
      />
    );
    
    const supportLink = screen.getByRole('link', { name: /contact our support team/i });
    expect(supportLink).toHaveAttribute('href', 'mailto:support@northerncapitalhotel.com');
  });

  it('matches snapshot', () => {
    const { container } = renderWithRouter(
      <ErrorFallback 
        error={mockError} 
        resetErrorBoundary={mockResetErrorBoundary} 
      />
    );
    
    expect(container).toMatchSnapshot();
  });
});
