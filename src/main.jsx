import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

const WorkStatus = () => {
    const wstatus=true
    return wstatus ? (
        <App />
    ) : (
        <div>
            <h1>Work in Progress...</h1>
        </div>
    );
};

ReactDOM.createRoot(document.getElementById('root')).render(
        <WorkStatus />
);
