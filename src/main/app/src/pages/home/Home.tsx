import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
    return (
        <div>
            <h1>Home Page</h1>
            {/* Altri elementi della tua Home Page */}
            <Link to="/analysis">Vai alla Analisi</Link>
        </div>
    );
}

export default HomePage;