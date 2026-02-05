import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import IosShareIcon from '@mui/icons-material/IosShare';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { timeAgo } from './utilities';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';

function DetailedPost() {
    const { _id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [likeCount, setLikeCount] = useState(0);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [username, setUsername] = useState('');
    const [userLiked, setUserLiked] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

    useEffect(() => {
        if (_id && username) {
            const fetchPost = async () => {
                console.log(`Fetching post with ID: ${_id} for user: ${username}`); // Debugging info
                try {
                    const response = await fetch(`/api/blogposts/${_id}?userId=${username}`);
                    if (response.ok) {
                        const data = await response.json();
                        setPost(data);
                        setLikeCount(data.likes || 0);
                        setComments(data.comments || []);
                        setUserLiked(data.userLiked);
                    } else {
                        setError('Post not found');
                    }
                } catch (error) {
                    setError('Error fetching post');
                } finally {
                    setLoading(false);
                }
            };

            fetchPost();
        } else if (!_id) {
            setError('Invalid post ID');
            setLoading(false);
        } else if (!username) {
            console.log('Username not yet available, waiting...'); // Debugging info
        }
    }, [_id, username]);

    const handleLike = async (e) => {
        e.stopPropagation();
        const url = `/api/blogposts/${_id}/like`;
        console.log('Toggling like for post at:', url);

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId: username })
            });

            if (response.ok) {
                const data = await response.json();
                setLikeCount(data.likes || 0);
                setUserLiked(data.userLiked);
            } else {
                const error = await response.text();
                console.error('Error updating likes:', error);
                alert(error);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleShare = (e) => {
        e.stopPropagation();
        const postUrl = `${window.location.origin}/posts/${_id}`;
        navigator.clipboard.writeText(postUrl).then(() => {
            alert("Link copied to clipboard!");
        }, (err) => {
            console.error('Could not copy text: ', err);
        });
    };

    const handleCommentSubmit = async () => {
        if (newComment.trim() !== "" && username.trim() !== "") {
            try {
                const response = await fetch(`/api/blogposts/${_id}/comments`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        author: username,
                        text: newComment,
                    }),
                });

                if (response.ok) {
                    const newCommentObject = await response.json();
                    setComments([...comments, newCommentObject]);
                    setNewComment("");
                } else {
                    const errorText = await response.text();
                    console.error('Error adding comment:', errorText);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        } else {
            console.warn('Username and comment text are required.');
        }
    };

    const handleMoreClick = (event) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleEdit = () => {
        handleMenuClose();
        navigate(`/edit/${_id}`);
    };

    const handleDelete = async () => {
        handleMenuClose();
        const url = `/api/blogposts/${_id}`;
        try {
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: username }) 
            });
            if (response.ok) {
                alert('Post deleted successfully');
                navigate('/');
            } else {
                const errorText = await response.text();
                console.error('Error deleting post:', errorText);
                alert('Error deleting post');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error deleting post');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!post) {
        return <div>Post not found</div>;
    }

    const isImageUrl = (url) => /\.(jpeg|jpg|gif|png|webp)$/.test(url);

    return (
        <div className="detailed-post">
            <div className="post">
                <div className="post-header">
                    <p className="author">{post.author}</p>
                    <div className="post-time-container">
                        <p className="post-time">{timeAgo(post.time)}</p>
                        {post.author === username && (
                            <>
                                <MoreHorizIcon
                                    aria-controls="simple-menu"
                                    aria-haspopup="true"
                                    onClick={handleMoreClick}
                                />
                                <Menu
                                    id="simple-menu"
                                    anchorEl={anchorEl}
                                    keepMounted
                                    open={Boolean(anchorEl)}
                                    onClose={handleMenuClose}
                                >
                                    <MenuItem onClick={handleEdit}>Edit</MenuItem>
                                    <MenuItem onClick={handleDelete}>Delete</MenuItem>
                                </Menu>
                            </>
                        )}
                    </div>
                </div>
                <div className="post-content">
                    <h2>{post.title}</h2>
                    {isImageUrl(post.content) ? (
                        <img src={post.content} alt={post.title} style={{ maxWidth: '100%', height: 'auto' }} />
                    ) : (
                        <p>{post.content}</p>
                    )}
                </div>
                <div className="post-footer">
                    <Button className="reaction" onClick={handleLike}>
                        {userLiked ? <ThumbUpIcon /> : <ThumbUpOffAltIcon />} {likeCount}
                    </Button>
                    <Button className="reaction">
                        <ChatBubbleOutlineIcon /> {comments.length}
                    </Button>
                    <Button className="reaction" onClick={handleShare}>
                        <IosShareIcon /> Share
                    </Button>
                </div>
            </div>
            <div className="comments-section">
                <h3>Comments</h3>
                <div className="text-field-container">
                    <TextField
                        id="fullWidth"
                        label="Add a comment"
                        variant="standard"
                        fullWidth
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    />
                    <Button onClick={handleCommentSubmit} variant="text" color="primary" className="submit-button">
                        Submit
                    </Button>
                </div>
                {comments.length === 0 ? (
                    <p>No comments yet. Be the first to comment!</p>
                ) : (
                    comments.map((comment, index) => (
                        <div key={index} className="comment">
                            <div className="comment-header">
                                <strong>{comment.user}</strong>
                                <span className="comment-time">{timeAgo(comment.date)}</span>
                            </div>
                            <div className="comment-content">
                                <p>{comment.text}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default DetailedPost;
