import { BrowserRouter, Routes, Route } from 'react-router';
import Home from './pages/Home';
import Header from './components/Header';
import Footer from './components/Footer';
import Invoices from './pages/Invoices';
import CreateInvoice from './pages/CreateInvoice';
import SignIn from './pages/SignIn';
import { useState } from 'react';
import heroImg from './assets/logo-centered.svg';
import reactLogo from './assets/react.svg';
import viteLogo from './assets/vite.svg';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <main>
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/create-invoice" element={<CreateInvoice />} />
            <Route path="/signin" element={<SignIn />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </main>
    </>
  )
}

export default App
