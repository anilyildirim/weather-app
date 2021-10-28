import React from 'react';

const Error = ({ usedQuery, errorMessage }) => {

  return (
    <section className="error">
      <strong className="error__warning">{`We couldn't find any results for ${usedQuery}. Here is the error code: `}<span>{errorMessage}!</span></strong>
    </section>
  );
};

export default Error;