import React, {useState, useEffect} from 'react';
import { Link, useNavigate } from "react-router-dom";
import SavingsIcon from '@mui/icons-material/Savings';
import Button from '@mui/material/Button';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';
import Check from '@mui/icons-material/Check';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import TuneIcon from '@mui/icons-material/Tune';
import { Input, InputAdornment, useTheme, Divider} from '@mui/material';

function Navbar({setSearchTerms, setFilter}) {
    const handleSearchChange = (e) => {
        setSearchTerms(e.target.value);
    };
    const handleFilterAll = () => {
        setFilter('ALL');

        handleClose()
    };
    const handleFilterTitle = () =>{
        setFilter('TITLE');

        handleClose();
    };
    const handleFilterAuthor = () => {
        setFilter('AUTHOR');

        handleClose();
    };
    const handleFilterContent = () => {
        setFilter('CONTENT');

        handleClose();
    };
    const handleFilterTags = () => {
        setFilter('TAGS');

        handleClose();
    };

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };

    const theme = useTheme();
    const navigate = useNavigate();
    const isLoggedIn = () => localStorage.getItem('username') != null;

    const handleProfileClick = () => {
        if (isLoggedIn()) {
            console.log('hi1');
            navigate('/Profile');
        } else {
            console.log('hi2');
            navigate('/Login');
        }
    };


    return (
        <header className="nav-header">
            <div className="nav-container">
                <h1 className="brand">
                    <Link to="/" className="logo-link" style={{ color: theme.palette.primary.main }}>
                        <SavingsIcon color='primary' />
                        BlogHog
                    </Link>
                </h1>
                <div></div>
                <Input
                    placeholder="Search here…"
                    onChange={handleSearchChange}
                    startAdornment={
                        <InputAdornment position="start">
                            <SearchIcon/>
                        </InputAdornment>
                    }
                    endAdornment={
                    <InputAdornment position="end">
                        <TuneIcon
                            id="basic-button"
                            aria-controls={open ? 'basic-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            onClick={handleClick}
                        />
                    </InputAdornment>
                    }
                />
            <div>
            <Menu
            id="filter-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
            'aria-labelledby': 'basic-button',
            }}
            >
                <MenuItem onClick={handleFilterAll}>All</MenuItem>
                <Divider />
                <MenuItem onClick={handleFilterTitle}>Title</MenuItem>
                <MenuItem onClick={handleFilterAuthor}>Author</MenuItem>
                <MenuItem onClick={handleFilterContent}>Content</MenuItem>
                <MenuItem onClick={handleFilterTags}>Tags</MenuItem>
            </Menu>
            </div>
                <div className="button-container">
                    <Button 
                        variant="contained" 
                        color="primary" 
                        component={Link} 
                        to="/CreatePost"
                        className="button">
                        Create
                    </Button>
                    <Button                    
                        variant="contained" 
                        color="primary" 
                        onClick={handleProfileClick}
                        className="button"
                    >
                        <AccountCircleIcon/>
                    </Button>
                </div>
            </div>
        </header>
    );
}

export default Navbar;
