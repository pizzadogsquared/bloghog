import React, { useState, useEffect } from 'react';
import { TextField, Button, Tabs, Tab, Box } from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { styled } from '@mui/material/styles';
import { useParams, useNavigate } from 'react-router-dom';


const Input = styled('input')({
    display: 'none',
  });

function CreatePost() {
    const [selectedTab, setSelectedTab] = useState(0);
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    var [tags, setTags] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [username, setUsername] = useState('')
    const navigate = useNavigate();

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
      };

      const handleSubmit = async () => {
        setSuccessMessage('');
    
        if (!title || !body) {
            console.error('Title and content are required.');
            setSuccessMessage('Title and content are required.');
            return;
        }

        tags = tags
        .replace(/[^a-zA-Z0-9\s]/g, '')
        .trim()
        .split(/\s+/)
        .filter(word => word.length > 0);

        const postData = {
            author: username,
            title,
            content: body,
            tags,
            published: true,
        };
    
        console.log('Post Data: ', postData);
    
        try {            
            console.log(tags);
            const response = await fetch('/api/blogposts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData),
            });
    
            if (response.ok) {
                alert('Post created successfully!');
                setTitle('');
                setBody('');
                setTags([]);
                navigate('/');
            } else {
                const errorText = await response.text();
                console.error('Error creating post:', response.statusText);
                console.error('Server response:', errorText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <Box sx={{ padding: 3 }}>
            <h2>Create Post</h2>

            <Tabs value={selectedTab} onChange={handleTabChange} centered>
                <Tab label="Text" />
                <Tab label="Images & Video" />
            </Tabs>

            <Box sx={{ padding: 2 }}>
                {selectedTab === 0 && (
                    <Box>
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Title"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        inputProps={{ maxLength: 300 }}
                        sx={{ marginBottom: 2 }}
                    />
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Body"
                        multiline
                        rows={6}
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        sx={{ marginBottom: 2 }}
                    />
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Tags Separated By Spaces"
                        required
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        inputProps={{ maxLength: 300 }}
                        sx={{ marginBottom: 2 }}
                    />
                    <Button variant="contained" color="primary" onClick={handleSubmit}>Post</Button>
                </Box>
                )}
                {selectedTab === 1 && (
                    <Box>
                        <TextField
                            fullWidth
                            variant="outlined"
                            label="Title"
                            required
                            inputProps={{ maxLength: 300 }}
                            sx={{ marginBottom: 2 }}
                        />
                        <label htmlFor="icon-button-file">
                            <Input accept="image/*,video/*" id="icon-button-file" type="file" onChange={handleFileChange} />
                            <Button variant="contained" component="span" startIcon={<PhotoCamera />}>
                                Upload
                            </Button>
                        </label>
                        {selectedFile && (
                        <Box sx={{ marginTop: 2 }}>
                            <h4>Selected file:</h4>
                            <p>{selectedFile.name}</p>
                        </Box>
                        )}
                        <Button variant="contained" color="primary" onClick={handleSubmit}>Post</Button>
                    </Box>
                )}
            </Box>
        </Box>
    );
}

export default CreatePost;
