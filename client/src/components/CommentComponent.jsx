import React from 'react';

function CommentComponent({ author, time, content, replies }) {
    return (
        <div className="comment">
            <div className="comment-header">
                <strong>{author}</strong>
                <span className="comment-time">{time}</span>
            </div>
            <div className="comment-content">
                <p>{content}</p>
            </div>
            <div className="comment-replies">
                {replies && replies.map((reply, index) => (
                    <ReplyComponent key={index} {...reply} />
                ))}
            </div>
        </div>
    );
}

export default CommentComponent;
