"""
JazzCash Payment Gateway Integration
Supports both Mobile Wallet and Card payments
"""

import hashlib
import hmac
import requests
from datetime import datetime
from config import Config
import random
import string


class JazzCashPayment:
    """JazzCash payment gateway integration"""
    
    def __init__(self):
        self.merchant_id = Config.JAZZCASH_MERCHANT_ID
        self.password = Config.JAZZCASH_PASSWORD
        self.integrity_salt = Config.JAZZCASH_INTEGRITY_SALT
        self.return_url = Config.JAZZCASH_RETURN_URL
        
        # JazzCash API URLs
        if Config.JAZZCASH_ENVIRONMENT == 'production':
            self.api_url = 'https://payments.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform'
        else:
            # Sandbox URL
            self.api_url = 'https://sandbox.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform'
    
    def generate_transaction_id(self):
        """Generate unique transaction ID"""
        timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
        random_str = ''.join(random.choices(string.digits, k=6))
        return f"T{timestamp}{random_str}"
    
    def generate_secure_hash(self, data_dict):
        """
        Generate SHA256 secure hash for JazzCash
        Order of parameters is critical!
        """
        # Sort parameters alphabetically (JazzCash requirement)
        sorted_keys = sorted(data_dict.keys())
        
        # Build the string to hash
        hash_string = self.integrity_salt + '&'
        hash_values = []
        
        for key in sorted_keys:
            if data_dict[key] != '':
                hash_values.append(str(data_dict[key]))
        
        hash_string += '&'.join(hash_values)
        
        # Generate SHA256 hash
        secure_hash = hmac.new(
            self.integrity_salt.encode('utf-8'),
            hash_string.encode('utf-8'),
            hashlib.sha256
        ).hexdigest().upper()
        
        return secure_hash
    
    def initiate_payment(self, amount, customer_email, customer_mobile, 
                        bill_reference, description="Template Purchase"):
        """
        Initiate JazzCash payment
        
        Args:
            amount: Amount in PKR (will be converted to paisa)
            customer_email: Customer email
            customer_mobile: Customer mobile number (03XXXXXXXXX)
            bill_reference: Unique reference (template_id, purchase_id, etc.)
            description: Payment description
        
        Returns:
            dict: Payment form data to POST to JazzCash
        """
        # Convert amount to paisa (smallest unit)
        amount_in_paisa = int(float(amount) * 100)
        
        # Generate transaction ID
        txn_ref_no = self.generate_transaction_id()
        
        # Current datetime
        txn_datetime = datetime.now().strftime('%Y%m%d%H%M%S')
        txn_expiry = datetime.now().strftime('%Y%m%d%H%M%S')  # Can add hours
        
        # Prepare payment data
        payment_data = {
            'pp_Version': '1.1',
            'pp_TxnType': 'MWALLET',  # or 'MPAY' for cards
            'pp_Language': 'EN',
            'pp_MerchantID': self.merchant_id,
            'pp_Password': self.password,
            'pp_TxnRefNo': txn_ref_no,
            'pp_Amount': str(amount_in_paisa),
            'pp_TxnCurrency': 'PKR',
            'pp_TxnDateTime': txn_datetime,
            'pp_BillReference': bill_reference,
            'pp_Description': description,
            'pp_TxnExpiryDateTime': txn_expiry,
            'pp_ReturnURL': self.return_url,
            'pp_CustomerEmail': customer_email,
            'pp_CustomerMobile': customer_mobile,
            'ppmpf_1': '',  # Optional fields
            'ppmpf_2': '',
            'ppmpf_3': '',
            'ppmpf_4': '',
            'ppmpf_5': '',
        }
        
        # Generate secure hash
        payment_data['pp_SecureHash'] = self.generate_secure_hash(payment_data)
        
        return {
            'api_url': self.api_url,
            'form_data': payment_data,
            'transaction_id': txn_ref_no
        }
    
    def verify_payment_response(self, response_data):
        """
        Verify JazzCash payment response
        
        Args:
            response_data: POST data received from JazzCash callback
        
        Returns:
            dict: Verification result with status and details
        """
        # Extract secure hash from response
        received_hash = response_data.get('pp_SecureHash', '')
        
        # Remove hash from data for verification
        verification_data = {k: v for k, v in response_data.items() if k != 'pp_SecureHash'}
        
        # Generate hash from received data
        calculated_hash = self.generate_secure_hash(verification_data)
        
        # Verify hash
        if calculated_hash != received_hash:
            return {
                'success': False,
                'error': 'Invalid secure hash - payment verification failed',
                'response_code': 'HASH_MISMATCH'
            }
        
        # Check response code
        response_code = response_data.get('pp_ResponseCode', '')
        response_message = response_data.get('pp_ResponseMessage', '')
        
        if response_code == '000':
            # Success
            return {
                'success': True,
                'transaction_id': response_data.get('pp_TxnRefNo'),
                'amount': int(response_data.get('pp_Amount', 0)) / 100,  # Convert back to PKR
                'bill_reference': response_data.get('pp_BillReference'),
                'response_code': response_code,
                'response_message': response_message,
                'payment_method': response_data.get('pp_TxnType'),
                'settled': True
            }
        else:
            # Failed
            return {
                'success': False,
                'error': response_message,
                'response_code': response_code,
                'transaction_id': response_data.get('pp_TxnRefNo')
            }
    
    def initiate_card_payment(self, amount, customer_email, customer_mobile,
                            bill_reference, description="Template Purchase"):
        """
        Initiate card payment (MPAY)
        Similar to wallet but uses MPAY type
        """
        # Same as initiate_payment but with different txn type
        amount_in_paisa = int(float(amount) * 100)
        txn_ref_no = self.generate_transaction_id()
        txn_datetime = datetime.now().strftime('%Y%m%d%H%M%S')
        txn_expiry = datetime.now().strftime('%Y%m%d%H%M%S')
        
        payment_data = {
            'pp_Version': '1.1',
            'pp_TxnType': 'MPAY',  # Card payment
            'pp_Language': 'EN',
            'pp_MerchantID': self.merchant_id,
            'pp_Password': self.password,
            'pp_TxnRefNo': txn_ref_no,
            'pp_Amount': str(amount_in_paisa),
            'pp_TxnCurrency': 'PKR',
            'pp_TxnDateTime': txn_datetime,
            'pp_BillReference': bill_reference,
            'pp_Description': description,
            'pp_TxnExpiryDateTime': txn_expiry,
            'pp_ReturnURL': self.return_url,
            'pp_CustomerEmail': customer_email,
            'pp_CustomerMobile': customer_mobile,
            'ppmpf_1': '',
            'ppmpf_2': '',
            'ppmpf_3': '',
            'ppmpf_4': '',
            'ppmpf_5': '',
        }
        
        payment_data['pp_SecureHash'] = self.generate_secure_hash(payment_data)
        
        return {
            'api_url': self.api_url,
            'form_data': payment_data,
            'transaction_id': txn_ref_no
        }
    
    def check_transaction_status(self, transaction_id):
        """
        Check transaction status (inquiry API)
        
        Args:
            transaction_id: Transaction reference number
        
        Returns:
            dict: Transaction status
        """
        # JazzCash inquiry API
        inquiry_url = self.api_url.replace('merchantform', 'inquirytransaction')
        
        txn_datetime = datetime.now().strftime('%Y%m%d%H%M%S')
        
        inquiry_data = {
            'pp_Version': '1.1',
            'pp_TxnType': 'INQ',
            'pp_Language': 'EN',
            'pp_MerchantID': self.merchant_id,
            'pp_Password': self.password,
            'pp_TxnRefNo': transaction_id,
            'pp_TxnDateTime': txn_datetime,
        }
        
        inquiry_data['pp_SecureHash'] = self.generate_secure_hash(inquiry_data)
        
        try:
            response = requests.post(inquiry_url, data=inquiry_data)
            result = response.json() if response.headers.get('content-type') == 'application/json' else {}
            
            return {
                'success': result.get('pp_ResponseCode') == '000',
                'status': result.get('pp_ResponseMessage', 'Unknown'),
                'data': result
            }
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }


def format_mobile_number(mobile):
    """
    Format Pakistani mobile number for JazzCash
    Accepts: 03001234567, +923001234567, 3001234567
    Returns: 03001234567
    """
    # Remove spaces and dashes
    mobile = mobile.replace(' ', '').replace('-', '')
    
    # Remove +92 and add 0
    if mobile.startswith('+92'):
        mobile = '0' + mobile[3:]
    elif mobile.startswith('92'):
        mobile = '0' + mobile[2:]
    elif not mobile.startswith('0'):
        mobile = '0' + mobile
    
    # Validate length (should be 11 digits: 03XXXXXXXXX)
    if len(mobile) != 11 or not mobile.startswith('0'):
        raise ValueError('Invalid Pakistani mobile number format')
    
    return mobile
