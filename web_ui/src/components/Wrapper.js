// react and js imports
import React from "react";
import { useNavigate } from "react-router-dom";

// user defined components:



const Wrapper = () => {

    const navigate = useNavigate();

    const handleNavigateToLogin = () => {
        navigate("/login");
    };
    return (
        <div>
            <h1>Welcome to the Home Page</h1>
            <button onClick={handleNavigateToLogin}> Go to Login </button>
      </div>
    )
};

export default Wrapper;