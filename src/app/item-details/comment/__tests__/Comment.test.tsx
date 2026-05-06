import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Comment from '../Comment';
import { mockComment, mockDeletedComment } from '../../../../mocks/fixtures/item';

function renderComment(comment = mockComment) {
  return render(
    <MemoryRouter>
      <Comment comment={comment} />
    </MemoryRouter>
  );
}

describe('Comment', () => {
  it('renders user link', () => {
    renderComment();
    const link = screen.getByText('commenter1');
    expect(link.closest('a')).toHaveAttribute('href', '/user/commenter1');
  });

  it('renders time_ago', () => {
    renderComment();
    expect(screen.getByText('2 hours ago')).toBeInTheDocument();
  });

  it('renders comment content as innerHTML', () => {
    renderComment();
    expect(screen.getByText('This is a test comment')).toBeInTheDocument();
  });

  it('collapse toggle hides comment body', () => {
    renderComment();
    expect(screen.getByText('This is a test comment')).toBeVisible();
    const toggles = screen.getAllByText('[-]');
    fireEvent.click(toggles[0]);
    expect(screen.getByText('[+]')).toBeInTheDocument();
    const commentTree = screen.getByText('This is a test comment').closest('div[style]');
    expect(commentTree).toHaveStyle({ display: 'none' });
  });

  it('collapse toggle shows comment body when expanded', () => {
    renderComment();
    const toggles = screen.getAllByText('[-]');
    fireEvent.click(toggles[0]);
    fireEvent.click(screen.getByText('[+]'));
    expect(screen.getAllByText('[-]')).toHaveLength(2);
  });

  it('deleted comments show [deleted] | Comment Deleted', () => {
    renderComment(mockDeletedComment);
    expect(screen.getByText('[deleted]')).toBeInTheDocument();
    expect(screen.getByText(/Comment Deleted/)).toBeInTheDocument();
  });

  it('recursively renders nested sub-comments', () => {
    renderComment();
    expect(screen.getByText('commenter2')).toBeInTheDocument();
    expect(screen.getByText('This is a nested reply')).toBeInTheDocument();
  });

  it('renders meta section with correct class', () => {
    const { container } = renderComment();
    expect(container.querySelector('.meta')).toBeInTheDocument();
  });
});
