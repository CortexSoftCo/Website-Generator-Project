import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from './store';
import { getCurrentUser } from './api';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Categories from './pages/Categories';
import TemplateDetail from './pages/TemplateDetail';
import Cart from './pages/Cart';
import AIBuilder from './pages/AIBuilder';
import AIHistory from './pages/AIHistory';
import Payment from './pages/Payment';
import PaymentHistory from './pages/PaymentHistory';
import SellerDashboard from './pages/SellerDashboard';
import BuyerDashboard from './pages/BuyerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import About from './pages/About';
import Contact from './pages/Contact';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';

function App() {
  const { token, setAuth } = useAuthStore();

  useEffect(() => {
    if (token) {
      getCurrentUser()
        .then(res => setAuth(res.data.user, token))
        .catch(() => useAuthStore.getState().logout());
    }
  }, []);

  return (
    <BrowserRouter>
      <div style={styles.app}>
        <Navbar />
        <main style={styles.main}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/category/:slug" element={<Categories />} />
            <Route path="/template/:id" element={<TemplateDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/ai-builder" element={<AIBuilder />} />
            <Route path="/ai-history" element={<AIHistory />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/payment/history" element={<PaymentHistory />} />
            <Route path="/seller/dashboard" element={<SellerDashboard />} />
            <Route path="/buyer/dashboard" element={<BuyerDashboard />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

const styles = {
  app: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: '#fafafa'
  },
  main: {
    flex: 1
  }
};

export default App;