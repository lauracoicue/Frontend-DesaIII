import React from 'react';

const Button = ({ text, onClick, href }) => {
    const buttonElement = (
        <button
            className="active:scale-[.98] active:duration-75 hover:scale-[1.01] ease-in-out 
            border border-blue-950 bg-blue-950 text-white py-3 px-10 rounded-xl 
            text-center font-bold mt-6"
            onClick={onClick}
        >
            {text}
        </button>
    );

    return href ? <a href={href}>{buttonElement}</a> : buttonElement;
};

export default Button;

