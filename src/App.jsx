import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import How from './components/How';
import IssuesTable from './components/IssuesTable';
import Footer from './components/Footer';
import './index.css';

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <How />
        <IssuesTable />
      </main>
      <Footer />
    </>
  );
}

export default App;