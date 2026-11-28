import { BrowserRouter, Routes, Route } from 'react-router';
import Home from './pages/Home';
import CreateInvoice from './pages/CreateInvoice';
import SignIn from './pages/SignIn';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Invoices from './pages/Invoices';
import { useState } from 'react';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <main>
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/invoices" element={<ProtectedRoute><Invoices /></ProtectedRoute>} />
            <Route path="/create-invoice" element={<ProtectedRoute><CreateInvoice /></ProtectedRoute>} />
            <Route path="/signin" element={<SignIn />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </main>
    </>
  )
}

export default App
