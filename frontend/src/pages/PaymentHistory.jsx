import { useState, useEffect } from 'react';
import { getUserPaymentHistory, checkPaymentStatus } from '../api';
import { useNavigate } from 'react-router-dom';

const PaymentHistory = () => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(null);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await getUserPaymentHistory();
      setPayments(response.data.payments);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load payment history');
    } finally {
      setLoading(false);
    }
  };

  const refreshStatus = async (paymentId) => {
    try {
      setRefreshing(paymentId);
      const response = await checkPaymentStatus(paymentId);
      
      // Update the payment in the list
      setPayments(payments.map(p => 
        p.id === paymentId ? response.data : p
      ));
    } catch (err) {
      console.error('Failed to refresh status:', err);
    } finally {
      setRefreshing(null);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      'success': 'bg-green-100 text-green-800 border-green-300',
      'pending': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'failed': 'bg-red-100 text-red-800 border-red-300',
      'cancelled': 'bg-gray-100 text-gray-800 border-gray-300'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${badges[status] || badges.pending}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Payment History</h1>
          <button
            onClick={fetchPayments}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Refresh
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {payments.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600 mb-4">No payment history found</p>
            <button
              onClick={() => navigate('/categories')}
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
            >
              Browse Templates
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Transaction ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Method
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {payments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {payment.transaction_id}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {formatDate(payment.created_at)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          {payment.currency} {payment.amount.toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {payment.payment_method === 'wallet' ? 'JazzCash Wallet' : 'Card'}
                        </div>
                        <div className="text-xs text-gray-400">
                          {payment.payment_gateway.toUpperCase()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(payment.status)}
                        {payment.response_message && payment.status === 'failed' && (
                          <div className="text-xs text-red-600 mt-1">
                            {payment.response_message}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {payment.status === 'pending' && (
                          <button
                            onClick={() => refreshStatus(payment.id)}
                            disabled={refreshing === payment.id}
                            className="text-blue-600 hover:text-blue-800 disabled:opacity-50"
                          >
                            {refreshing === payment.id ? 'Checking...' : 'Check Status'}
                          </button>
                        )}
                        {payment.status === 'success' && payment.completed_at && (
                          <div className="text-xs text-green-600">
                            Completed: {formatDate(payment.completed_at)}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">Payment Information</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Successful payments are processed immediately</li>
            <li>• Pending payments may take a few minutes to process</li>
            <li>• Failed payments will not be charged to your account</li>
            <li>• For payment issues, contact support with your transaction ID</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;
