import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Box, Grid, Avatar } from '@mui/material';
import Post from './Post';
import { Link } from "react-router-dom";
import { capitalize } from 'lodash';
import { useNavigate } from 'react-router-dom';
import ProfileHome from './ProfileHome';

function Profile({searchTerms, filter}) {
    const [file, setFile] = useState(null);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [hideEmail, setHideEmail] = useState(true);
    const [hidePassword, setHidePassword] = useState(true);
    const [hidePosts, setHidePosts] = useState(true);
    const navigate = useNavigate();

    function stringToColor(string) {
        let hash = 0;
        let i;
      
        /* eslint-disable no-bitwise */
        for (i = 0; i < string.length; i += 1) {
          hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }
      
        let color = '#';
      
        for (i = 0; i < 3; i += 1) {
          const value = (hash >> (i * 8)) & 0xff;
          color += `00${value.toString(16)}`.slice(-2);
        }
        /* eslint-enable no-bitwise */
      
        return color;
      }
      
      function stringAvatar(name) {
        return {
          sx: {
            bgcolor: stringToColor(name),
          },
          children: `${name[0]}`,
        };
      }

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
        }

        const storedEmail = localStorage.getItem('email');
        if (storedEmail) {
            setEmail(storedEmail);
        }

        const storedPassword = localStorage.getItem('password');
        if (storedPassword) {
            setPassword(storedPassword);
        }

        const profHome = document.getElementById('profHome');
        if (profHome) {
            profHome.style.display = 'none';
        }
    }, []);

    const handleToggleEmail = () => {
        setHideEmail(!hideEmail);
    };

    const handleTogglePassword = () => {
        setHidePassword(!hidePassword);
    };

    const handleTogglePosts = () => {
        setHidePosts(!hidePosts);
        const profHome = document.getElementById('profHome');
        if(!hidePosts){
            profHome.style.display = 'none';
        }
        else{
            profHome.style.display = 'inline';
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/Login');
    };

    const handleFileSyntax = (event) => {
        setFile(event.target.files[0]);
    };

    const handleFileUpload = async () => {
        if (!file) {
            setMessage('Please upload a file');
            return;
        }

        const formData = new FormData();
        formData.append('image', file);
        formData.append('username', username);

        try {
            const response = await fetch('/api/pfp', {
                method: 'POST',
                body: formData
            });

            const result = await response.text();
            alert(result);
            if (response.ok){
                setMessage("Profile icon changed.")
            }
            else{
                setMessage("Unknown error")
            }
        } catch (error) {
            console.log(error);
            setMessage(error)
        }
    };

    return (
        <Container>
            <Grid container columns={16} p={2} rowGap={4}
            sx={{
                border: '1px solid',
                borderRadius: '14px',
                borderColor: 'grey.300',
                marginTop: '10vh'
            }}>
                <Grid sm={2} display="flex">
                <Avatar
                sx={{ width: 56, height: 56 }}
                {...stringAvatar(capitalize(username))}/>
                </Grid>
                <Grid sm={14} alignSelf={'center'}>
                <h1>@{username}</h1>
                </Grid>
                <Grid sm={2}>
                </Grid>
                <Grid sm={4}>
                <h2>Email</h2>
                </Grid>
                <Grid sm={2}>
                <Button variant="outlined" display="flex" justifyContent="center" onClick={handleToggleEmail}>
                    {hideEmail ? 'Reveal' : 'Hide'}
                </Button>
                </Grid>
                <Grid sm={8}>
                <h2>
                {hideEmail ? '*'.repeat(email.length) : email}
                </h2>
                </Grid>
                <Grid sm={2}>
                </Grid>
                <Grid sm={4}>
                <h2>Password</h2>
                </Grid>
                <Grid sm={2}>
                <Button variant="outlined" display="flex" justifyContent="center" onClick={handleTogglePassword}>
                    {hidePassword ? 'Reveal' : 'Hide'}
                </Button>
                </Grid>
                <Grid sm={8}>
                <h2>
                {hidePassword ? '*'.repeat(password.length):password}
                </h2>
                </Grid>
                <Grid sm={2}>
                </Grid>
                <Grid sm={12}>
                <Button variant="contained" onClick={handleTogglePosts}>
                    {hidePosts ? 'View Blog Posts' : 'Hide Blog Posts'}
                </Button>
                </Grid>
                <Grid sm={2}>
                </Grid>
                {/*
                <Grid sm={2}>
                </Grid>
                <Grid sm={12} >
                <div>
                <input
                type="file"
                accept="image/png"
                onChange={handleFileSyntax}
                style={{ display: 'none' }}
                id="file-input"
                />
                <Button variant="contained"
                onClick={() => {
                document.getElementById('file-input').click()
                handleFileUpload
                }}
                >Change Icon</Button>
                </div>
                </Grid>
                <Grid sm={2}>
                </Grid>
                */}
                <Grid sm={2}>
                </Grid>
                <Grid sm={12} >
                <Button variant="outlined" color="error" onClick={handleLogout}>Log Out</Button>
                </Grid>
                <Grid sm={2}>
                </Grid>
            </Grid>
            <div id='profHome'>
                <ProfileHome searchTerms={searchTerms} filter={filter}/>
            </div>
        </Container>
    )
};

export default Profile;
