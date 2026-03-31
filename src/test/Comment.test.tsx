import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CommentComponent from '../components/Comment';
import type { Comment } from '../models/comment';

function renderComment(comment: Comment) {
    return render(
        <BrowserRouter>
            <CommentComponent comment={comment} />
        </BrowserRouter>
    );
}

describe('Comment', () => {
    it('renders comment content', () => {
        const comment: Comment = {
            id: 1,
            level: 0,
            user: 'testuser',
            time: 1234567890,
            time_ago: '2 hours ago',
            content: '<p>Hello World</p>',
            deleted: false,
            comments: [],
        };

        renderComment(comment);
        expect(screen.getByText('testuser')).toBeInTheDocument();
        expect(screen.getByText('2 hours ago')).toBeInTheDocument();
    });

    it('renders deleted comment message', () => {
        const comment: Comment = {
            id: 2,
            level: 0,
            user: '',
            time: 1234567890,
            time_ago: '1 hour ago',
            content: '',
            deleted: true,
            comments: [],
        };

        renderComment(comment);
        expect(screen.getByText(/Comment Deleted/)).toBeInTheDocument();
    });

    it('renders nested comments recursively', () => {
        const comment: Comment = {
            id: 3,
            level: 0,
            user: 'parent',
            time: 1234567890,
            time_ago: '3 hours ago',
            content: '<p>Parent comment</p>',
            deleted: false,
            comments: [
                {
                    id: 4,
                    level: 1,
                    user: 'child',
                    time: 1234567891,
                    time_ago: '2 hours ago',
                    content: '<p>Child comment</p>',
                    deleted: false,
                    comments: [],
                },
            ],
        };

        renderComment(comment);
        expect(screen.getByText('parent')).toBeInTheDocument();
        expect(screen.getByText('child')).toBeInTheDocument();
    });

    it('collapses and expands comment on toggle click', () => {
        const comment: Comment = {
            id: 5,
            level: 0,
            user: 'testuser',
            time: 1234567890,
            time_ago: '1 hour ago',
            content: '<p>Collapsible content</p>',
            deleted: false,
            comments: [],
        };

        renderComment(comment);
        const toggleButton = screen.getByText('[-]');
        fireEvent.click(toggleButton);
        expect(screen.getByText('[+]')).toBeInTheDocument();
    });
});
