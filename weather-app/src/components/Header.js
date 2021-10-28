import React from 'react';

const Header = ({ titleText, continuousText }) => {

  return (
    <header className="header">
      <h1>{titleText}</h1>
      <p>{continuousText}</p>
    </header>
  );
};

export default Header;