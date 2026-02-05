import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

function EditPost() {
    const { _id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [username, setUsername] = useState('');

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

    useEffect(() => {
        if (_id && username) {
            const fetchPost = async () => {
                console.log(`Fetching post with ID: ${_id} for user: ${username}`);
                try {
                    const response = await fetch(`/api/blogposts/${_id}`);
                    if (response.ok) {
                        const data = await response.json();
                        setPost(data);
                        setTitle(data.title);
                        setContent(data.content);
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
            console.log('Username not yet available, waiting...');
        }
    }, [_id, username]);

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleContentChange = (e) => {
        setContent(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = `/api/blogposts/${_id}`;
        console.log('Updating post at:', url);

        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title, content, author: username })
            });

            if (response.ok) {
                alert('Post updated successfully');
                navigate(`/posts/${_id}`);
            } else {
                const error = await response.text();
                console.error('Error updating post:', error);
                alert(error);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error updating post');
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

    return (
        <div className="edit-post-container">
            <div className="post">
                <h2>Edit Post</h2>
                <form onSubmit={handleSubmit}>
                    <TextField
                        id="title"
                        label="Title"
                        variant="standard"
                        fullWidth
                        value={title}
                        onChange={handleTitleChange}
                        className="edit-textfield"
                    />
                    <TextField
                        id="content"
                        label="Content"
                        variant="standard"
                        fullWidth
                        multiline
                        value={content}
                        onChange={handleContentChange}
                        className="edit-textfield"
                    />
                    <Button 
                        type="submit" 
                        variant="contained" 
                        color="primary" 
                        style={{ marginTop: '1rem' }}
                    >
                        Update Post
                    </Button>
                </form>
            </div>
        </div>
    );
}

export default EditPost;
