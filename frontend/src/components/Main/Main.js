import Header from "../Header/Header";
import Movies from '../Movies/Movies'
import React from 'react';
const Main = () => {
  
  return (
    <>
      <Header />
      <main className="main">
        <Movies />
      </main>
    </>
  );
};

export default Main;