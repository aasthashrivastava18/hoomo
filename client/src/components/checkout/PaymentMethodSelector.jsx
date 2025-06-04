import React, { useState } from 'react';
import { 
  FaCreditCard, 
  FaPaypal, 
  FaApplePay, 
  FaGooglePay, 
  FaLock,
  FaPlus,
  FaEdit,
  FaTrash
} from 'react-icons/fa';

const PaymentMethodSelector = ({ 
  savedCards = [], 
  selectedPaymentMethod, 
  onPaymentMethodSelect,
  onAddCard,
  onEditCard,
  onDeleteCard
}) => {
  const [showAddCard, setShowAddCard] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [cardForm, setCardForm] = useState({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardholderName: '',
    isDefault: false
  });

  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: FaCreditCard,
      description: 'Pay securely with your card'
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: FaPaypal,
      description: 'Pay with your PayPal account'
    },
    {
      id: 'apple-pay',
      name: 'Apple Pay',
      icon: FaApplePay,
      description: 'Pay with Touch ID or Face ID'
    },
    {
      id: 'google-pay',
      name: 'Google Pay',
      icon: FaGooglePay,
      description: 'Pay with Google Pay'
    }
  ];

  const handleCardInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let formattedValue = value;

    // Format card number
    if (name === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
      if (formattedValue.length > 19) return;
    }

    // Format CVV
    if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length > 4) return;
    }

    setCardForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : formattedValue
    }));
  };

  const handleAddCard = (e) => {
    e.preventDefault();
    const newCard = {
      ...cardForm,
      id: Date.now(),
      lastFour: cardForm.cardNumber.replace(/\s/g, '').slice(-4),
      cardType: getCardType(cardForm.cardNumber)
    };
    
    if (editingCard) {
      onEditCard({ ...newCard, id: editingCard.id });
      setEditingCard(null);
    } else {
      onAddCard(newCard);
    }
    
    setCardForm({
      cardNumber: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: '',
      cardholderName: '',
      isDefault: false
    });
    setShowAddCard(false);
  };

  const handleEditCard = (card) => {
    setCardForm({
      cardNumber: `**** **** **** ${card.lastFour}`,
      expiryMonth: card.expiryMonth,
      expiryYear: card.expiryYear,
      cvv: '',
      cardholderName: card.cardholderName,
      isDefault: card.isDefault
    });
    setEditingCard(card);
    setShowAddCard(true);
  };

  const handleCancel = () => {
    setShowAddCard(false);
    setEditingCard(null);
    setCardForm({
      cardNumber: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: '',
      cardholderName: '',
      isDefault: false
    });
  };

  const getCardType = (cardNumber) => {
    const number = cardNumber.replace(/\s/g, '');
    if (number.startsWith('4')) return 'visa';
    if (number.startsWith('5') || number.startsWith('2')) return 'mastercard';
    if (number.startsWith('3')) return 'amex';
    return 'card';
  };

  const getCardIcon = (cardType) => {
    switch (cardType) {
      case 'visa':
        return '💳';
      case 'mastercard':
        return '💳';
      case 'amex':
        return '💳';
      default:
        return '💳';
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 20 }, (_, i) => currentYear + i);
  const months = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    return { value: month.toString().padStart(2, '0'), label: month.toString().padStart(2, '0') };
  });

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <FaLock className="mr-2 text-green-600" />
          Payment Method
        </h3>
      </div>

      {/* Payment Method Options */}
      <div className="space-y-3 mb-6">
        {paymentMethods.map((method) => {
          const IconComponent = method.icon;
          return (
            <div
              key={method.id}
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                selectedPaymentMethod?.type === method.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => onPaymentMethodSelect({ type: method.id, ...method })}
            >
              <div className="flex items-center">
                <IconComponent className="text-2xl text-gray-600 mr-3" />
                <div>
                  <h4 className="font-medium text-gray-900">{method.name}</h4>
                  <p className="text-sm text-gray-500">{method.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Saved Cards Section */}
      {selectedPaymentMethod?.type === 'card' && (
        <div className="border-t border-gray-200 pt-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-md font-medium text-gray-900">Saved Cards</h4>
            <button
              onClick={() => setShowAddCard(true)}
              className="flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <FaPlus className="mr-1" />
              Add Card
            </button>
          </div>

          {/* Saved Cards List */}
          <div className="space-y-3 mb-4">
            {savedCards.map((card) => (
              <div
                key={card.id}
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  selectedPaymentMethod?.cardId === card.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => onPaymentMethodSelect({ 
                  type: 'card', 
                  cardId: card.id, 
                  card: card 
                })}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{getCardIcon(card.cardType)}</span>
                    <div>
                      <p className="font-medium text-gray-900">
                        **** **** **** {card.lastFour}
                      </p>
                      <p className="text-sm text-gray-500">
                        {card.cardholderName} • Expires {card.expiryMonth}/{card.expiryYear}
                      </p>
                      {card.isDefault && (
                        <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded mt-1">
                          Default
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditCard(card);
                      }}
                      className="p-2 text-gray-400 hover:text-blue-600"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteCard(card.id);
                      }}
                      className="p-2 text-gray-400 hover:text-red-600"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Card Form */}
          {showAddCard && (
            <div className="border border-gray-200 rounded-lg p-4">
              <h5 className="font-medium text-gray-900 mb-4">
                {editingCard ? 'Edit Card' : 'Add New Card'}
              </h5>
              <form onSubmit={handleAddCard} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Card Number *
                  </label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={cardForm.cardNumber}
                    onChange={handleCardInputChange}
                    placeholder="1234 5678 9012 3456"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cardholder Name *
                  </label>
                  <input
                    type="text"
                    name="cardholderName"
                    value={cardForm.cardholderName}
                    onChange={handleCardInputChange}
                    placeholder="John Doe"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expiry Month *
                    </label>
                    <select
                      name="expiryMonth"
                      value={cardForm.expiryMonth}
                      onChange={handleCardInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Month</option>
                      {months.map((month) => (
                        <option key={month.value} value={month.value}>
                          {month.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expiry Year *
                    </label>
                    <select
                      name="expiryYear"
                      value={cardForm.expiryYear}
                      onChange={handleCardInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Year</option>
                      {years.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CVV *
                    </label>
                    <input
                      type="text"
                      name="cvv"
                      value={cardForm.cvv}
                      onChange={handleCardInputChange}
                      placeholder="123"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isDefault"
                    checked={cardForm.isDefault}
                    onChange={handleCardInputChange}
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="text-sm text-gray-700">
                    Set as default payment method
                  </label>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    {editingCard ? 'Update Card' : 'Add Card'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* No Cards Message */}
          {savedCards.length === 0 && !showAddCard && (
            <div className="text-center py-8">
              <FaCreditCard className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">No saved cards</h4>
              <p className="text-gray-500 mb-4">Add a payment method to continue</p>
              <button
                               onClick={() => setShowAddCard(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <FaPlus className="mr-2" />
                Add Payment Method
              </button>
            </div>
          )}
        </div>
      )}

      {/* Other Payment Methods Info */}
      {selectedPaymentMethod?.type === 'paypal' && (
        <div className="border-t border-gray-200 pt-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <FaPaypal className="text-2xl text-blue-600 mr-3" />
              <div>
                <h4 className="font-medium text-gray-900">PayPal Payment</h4>
                <p className="text-sm text-gray-600">
                  You will be redirected to PayPal to complete your payment securely.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedPaymentMethod?.type === 'apple-pay' && (
        <div className="border-t border-gray-200 pt-6">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center">
              <FaApplePay className="text-2xl text-gray-800 mr-3" />
              <div>
                <h4 className="font-medium text-gray-900">Apple Pay</h4>
                <p className="text-sm text-gray-600">
                  Use Touch ID or Face ID to pay with your default card.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedPaymentMethod?.type === 'google-pay' && (
        <div className="border-t border-gray-200 pt-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <FaGooglePay className="text-2xl text-green-600 mr-3" />
              <div>
                <h4 className="font-medium text-gray-900">Google Pay</h4>
                <p className="text-sm text-gray-600">
                  Pay quickly and securely with Google Pay.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Security Notice */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-start space-x-3">
          <FaLock className="text-green-600 mt-1 flex-shrink-0" />
          <div className="text-sm text-gray-600">
            <p className="font-medium text-gray-900 mb-1">Secure Payment</p>
            <p>
              Your payment information is encrypted and secure. We never store your 
              complete card details on our servers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodSelector;

        
