import React, { useState } from 'react';
import { TextField, Button, Tabs, Tab, Box } from '@mui/material';
import { Link } from "react-router-dom";
import { styled } from '@mui/material/styles';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confPassword, setConfPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password, confPassword }),
            });

            if (response.ok) {
                setMessage('User registered successfully!');
                setUsername('');
                setEmail('');
                setPassword('');
                setConfPassword('');
            } else {
                const text = await response.text();
                setMessage(text);
            }
        } catch (error) {
            setMessage('Error registering user.');
        }
    };

    return (
        <Box
            sx={{
                padding: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}
        >
            <h2>Register</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box centered="true">
                    <TextField
                        variant="outlined"
                        label="Username"
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        inputProps={{ maxLength: 24 }}
                        sx={{ marginBottom: 2, minWidth: 500 }}
                    />
                </Box>
                <Box centered="true">
                    <TextField
                        variant="outlined"
                        label="Email"
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        inputProps={{ maxLength: 64 }}
                        sx={{ marginBottom: 2, minWidth: 500 }}
                    />
                </Box>
                <Box centered="true">
                    <TextField
                        variant="outlined"
                        label="Password"
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        inputProps={{ maxLength: 64 }}
                        sx={{ marginBottom: 2, minWidth: 500 }}
                    />
                </Box>
                <Box centered="true">
                    <TextField
                        variant="outlined"
                        label="Confirm Password"
                        type="password"
                        id="confPassword"
                        value={confPassword}
                        onChange={(e) => setConfPassword(e.target.value)}
                        required
                        inputProps={{ maxLength: 64 }}
                        sx={{ marginBottom: 2, minWidth: 500 }}
                    />
                </Box>
                <Button
                    type="submit"
                    centered="true"
                    variant="contained"
                    color="success"
                    sx={{ marginBottom: 2, minWidth: 500 }}
                >
                    Register
                </Button>
            </form>
            <p>Already have an account? <Link to="/Login">Log in</Link></p>
            <p>{message}</p>
        </Box>
    );
};

export default Register;
