import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import CreatePost from './CreatePost';
import Register from './Register';
import Home from './Home';
import Login from './Login';
import Profile from './Profile';
import DetailedPost from './DetailedPost';
import EditPost from './EditPost';

function App() {
    const [username, setUsername] = useState(localStorage.getItem('username') || '');
    const [searchTerms, setSearchTerms] = useState('');
    const [filter, setFilter] = useState('ALL')

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

    return (
        <Router>
            <Navbar setSearchTerms={setSearchTerms} setFilter={setFilter} />
            <Routes>
                <Route path="/" element={<Home searchTerms={searchTerms} filter={filter} />} />
                <Route path="/posts/:_id" element={<DetailedPost/>} />
                <Route path="/edit/:_id" element={<EditPost />} />
                <Route path="/CreatePost" element={<CreatePost />} />
                <Route path="/Register" element={<Register />}/>
                <Route path="/Login" element={<Login/>}/>
                <Route path="/Profile" element={<Profile searchTerms={searchTerms} filter={filter} />}/>
            </Routes>
            <Footer />
        </Router>
    );
}

export default App;
