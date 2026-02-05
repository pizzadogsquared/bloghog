import React, { useEffect, useState } from 'react';
import Post from './Post';
import {timeAgo} from './utilities';

function ProfileHome({searchTerms, filter}) {
    const [posts, setPosts] = useState([]);
    const [username, setUsername] = useState('');

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
            console.log(storedUsername)
        }


        const fetchPosts = async () => {
            try {
                const response = await fetch('/api/blogposts');
                if (response.ok) {
                    const data = await response.json();

                    const sortedPosts = data.sort((a, b) => new Date(b.time) - new Date(a.time));
                    setPosts(sortedPosts);
                } else {
                    console.error('Failed to fetch posts:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchPosts();
    }, []);

    const filterPosts = (post) => {
        if (filter == 'TITLE') {
            return post.author === username && post.title && post.title.toLowerCase().includes(searchTerms.toLowerCase());
        } else if (filter == 'AUTHOR') {
            return post.author === username && post.author.toLowerCase().includes(searchTerms.toLowerCase());
        } else if (filter == 'CONTENT') {
            return post.author === username && post.content && post.content.toLowerCase().includes(searchTerms.toLowerCase());
        } else if (filter == 'TAGS') {
            return post.author === username && post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchTerms.toLowerCase()));
        } else {
            return  (post.author === username) && 
                    ((post.title && post.title.toLowerCase().includes(searchTerms.toLowerCase())) ||
                    (post.content && post.content.toLowerCase().includes(searchTerms.toLowerCase())) ||
                    (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchTerms.toLowerCase()))));
        }
    };

    const filteredPosts = posts.filter(filterPosts);

    return (
        <div className="home">
            {filteredPosts.map(post => (
                <Post 
                    key={post._id}
                    _id={post._id}
                    author={post.author} 
                    time={timeAgo(post.time)}
                    title={post.title}
                    reactions={post.likes}
                    comments={post.comments}
                />
            ))}
        </div>
    );
}

export default ProfileHome;
