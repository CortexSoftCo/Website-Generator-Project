import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { initiateJazzCashPayment, checkPaymentStatus } from '../api';
import { useAuthStore } from '../store';

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [paymentData, setPaymentData] = useState({
    amount: location.state?.amount || '',
    payment_method: 'wallet',
    mobile_number: '',
    template_id: location.state?.template_id || '',
    purchase_id: location.state?.purchase_id || ''
  });
  const [paymentStatus, setPaymentStatus] = useState(null);

  // Check if we're returning from payment gateway
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const paymentId = params.get('payment_id');
    
    if (paymentId) {
      checkStatus(paymentId);
    }
  }, [location.search]);

  const checkStatus = async (paymentId) => {
    try {
      setLoading(true);
      const response = await checkPaymentStatus(paymentId);
      setPaymentStatus(response);
      
      if (response.status === 'success') {
        setSuccess('Payment successful! Redirecting...');
        setTimeout(() => {
          navigate('/buyer-dashboard');
        }, 3000);
      } else if (response.status === 'failed') {
        setError('Payment failed. Please try again.');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to check payment status');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setPaymentData({
      ...paymentData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Validate mobile number for wallet payment
      if (paymentData.payment_method === 'wallet' && !paymentData.mobile_number) {
        setError('Mobile number is required for wallet payment');
        setLoading(false);
        return;
      }

      const response = await initiateJazzCashPayment(paymentData);

      if (response.success) {
        setSuccess('Redirecting to payment gateway...');
        
        // If payment_url is provided, redirect to it
        if (response.payment_url) {
          window.location.href = response.payment_url;
        } 
        // If form_data is provided, submit a form
        else if (response.form_data) {
          // Create a form and submit it
          const form = document.createElement('form');
          form.method = 'POST';
          form.action = response.form_data.action;
          
          Object.keys(response.form_data.fields).forEach(key => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = response.form_data.fields[key];
            form.appendChild(input);
          });
          
          document.body.appendChild(form);
          form.submit();
        } else {
          setError('Invalid payment response from server');
        }
      } else {
        setError(response.message || 'Payment initiation failed');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Payment initiation failed');
    } finally {
      setLoading(false);
    }
  };

  // If checking payment status
  if (paymentStatus) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Payment Status</h2>
          
          {paymentStatus.status === 'success' && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              <p className="font-bold">Payment Successful!</p>
              <p>Transaction ID: {paymentStatus.transaction_id}</p>
              <p>Amount: PKR {paymentStatus.amount}</p>
            </div>
          )}
          
          {paymentStatus.status === 'failed' && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <p className="font-bold">Payment Failed</p>
              <p>{paymentStatus.response_message}</p>
            </div>
          )}
          
          {paymentStatus.status === 'pending' && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
              <p className="font-bold">Payment Pending</p>
              <p>Your payment is being processed...</p>
            </div>
          )}
          
          <button
            onClick={() => navigate('/buyer-dashboard')}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">JazzCash Payment</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Amount (PKR)
            </label>
            <input
              type="number"
              name="amount"
              value={paymentData.amount}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              required
              min="1"
              step="0.01"
              readOnly={location.state?.amount}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Payment Method
            </label>
            <select
              name="payment_method"
              value={paymentData.payment_method}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              required
            >
              <option value="wallet">JazzCash Wallet</option>
              <option value="card">Credit/Debit Card</option>
            </select>
          </div>

          {paymentData.payment_method === 'wallet' && (
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Mobile Number
              </label>
              <input
                type="tel"
                name="mobile_number"
                value={paymentData.mobile_number}
                onChange={handleChange}
                placeholder="03001234567"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                required
                pattern="[0-9]{11}"
              />
              <p className="text-sm text-gray-600 mt-1">
                Enter 11-digit mobile number (e.g., 03001234567)
              </p>
            </div>
          )}

          <div className="mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">Payment Summary</h3>
              <div className="flex justify-between text-sm">
                <span>Amount:</span>
                <span className="font-bold">PKR {paymentData.amount}</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span>Method:</span>
                <span>{paymentData.payment_method === 'wallet' ? 'JazzCash Wallet' : 'Card Payment'}</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold transition-colors ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {loading ? 'Processing...' : 'Proceed to Payment'}
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-full mt-3 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
          >
            Cancel
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Secure payment powered by JazzCash</p>
          <p className="mt-2">
            {import.meta.env.VITE_JAZZCASH_ENV === 'sandbox' && (
              <span className="text-yellow-600 font-semibold">
                Sandbox Mode - Test Payments Only
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Payment;
