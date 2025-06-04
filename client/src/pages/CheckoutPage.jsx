// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Formik, Form, Field, ErrorMessage } from 'formik';
// import * as Yup from 'yup';
// import { FaLock, FaCreditCard, FaMoneyBill, FaPaypal } from 'react-icons/fa';
// import Loader from '../components/common/Loader';
// import Alert from '../components/common/Alert';
// import Button from '../components/common/Button';
// // import OrderSummary from '../components/checkout/OrderSummary';
// // import AddressForm from '../components/checkout/AddressForm';
// // import PaymentMethodSelector from '../components/checkout/PaymentMethodSelector';
// // import useCart from '../hooks/useCart';
// // import useAuth from '../hooks/useAuth';
// import { useCart } from '../context/CartContext';
// import { useAuth } from '../context/AuthContext';
// // import { createOrder } from '../services/orderService';
// import orderService from '../services/orderService';
// import { toast } from 'react-toastify';

// const CheckoutPage = () => {
//   const { cart, loading: cartLoading, error: cartError, clearCart } = useCart();
//   const { user, isAuthenticated } = useAuth();
//   const navigate = useNavigate();
  
//   const [paymentMethod, setPaymentMethod] = useState('credit_card');
//   const [processingOrder, setProcessingOrder] = useState(false);
//   const [orderError, setOrderError] = useState(null);
  
//   useEffect(() => {
//     if (!isAuthenticated) {
//       navigate('/login', { state: { from: '/checkout' } });
//       return;
//     }
    
//     if (cart && (!cart.items || cart.items.length === 0)) {
//       navigate('/cart');
//       toast.info('Your cart is empty');
//     }
//   }, [isAuthenticated, cart, navigate]);
  
//   const initialValues = {
//     // Shipping Address
//     shippingAddress: {
//       fullName: user?.name || '',
//       addressLine1: user?.address?.addressLine1 || '',
//       addressLine2: user?.address?.addressLine2 || '',
//       city: user?.address?.city || '',
//       state: user?.address?.state || '',
//       postalCode: user?.address?.postalCode || '',
//       country: user?.address?.country || 'US',
//       phone: user?.phone || '',
//     },
//     // Billing Address
//     sameAsShipping: true,
//     billingAddress: {
//       fullName: user?.name || '',
//       addressLine1: user?.address?.addressLine1 || '',
//       addressLine2: user?.address?.addressLine2 || '',
//       city: user?.address?.city || '',
//       state: user?.address?.state || '',
//       postalCode: user?.address?.postalCode || '',
//       country: user?.address?.country || 'US',
//       phone: user?.phone || '',
//     },
//     // Payment Details (for credit card)
//     paymentDetails: {
//       cardNumber: '',
//       cardName: '',
//       expiryDate: '',
//       cvv: '',
//     },
//     // Order Notes
//     orderNotes: '',
//   };
  
//   const validationSchema = Yup.object({
//     shippingAddress: Yup.object({
//       fullName: Yup.string().required('Full name is required'),
//       addressLine1: Yup.string().required('Address is required'),
//       city: Yup.string().required('City is required'),
//       state: Yup.string().required('State is required'),
//       postalCode: Yup.string().required('Postal code is required'),
//       country: Yup.string().required('Country is required'),
//       phone: Yup.string().required('Phone number is required'),
//       .matches(/^\+?[\d\s-()]+$/, 'Invalid phone number'),
//     }),
//     sameAsShipping: Yup.boolean(),
//     billingAddress: Yup.object().when('sameAsShipping', {
//       is: false,
//       then: Yup.object({
//         fullName: Yup.string().required('Full name is required'),
//         addressLine1: Yup.string().required('Address is required'),
//         city: Yup.string().required('City is required'),
//         state: Yup.string().required('State is required'),
//         postalCode: Yup.string().required('Postal code is required'),
//         country: Yup.string().required('Country is required'),
//         phone: Yup.string().required('Phone number is required'),
//       }),
//        otherwise: (schema) => schema.notRequired(),
//     }),
//       paymentDetails: Yup.object().when([], {
//     is: () => paymentMethod === 'credit_card',
//     then: (schema) => schema.shape({
//       cardNumber: Yup.string()
//         .required('Card number is required')
//         .test('card-number', 'Invalid card number', (value) => {
//           return value && value.replace(/\s/g, '').length >= 13;
//         }),
//       cardName: Yup.string().required('Name on card is required'),
//       expiryDate: Yup.string()
//         .required('Expiry date is required')
//         .matches(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Format: MM/YY'),
//       cvv: Yup.string()
//         .required('CVV is required')
//         .matches(/^\d{3,4}$/, 'CVV must be 3 or 4 digits'),
//     }),
//     otherwise: (schema) => schema.notRequired(),
//   }),
// });

  
//   const calculateSubtotal = () => {
//     if (!cart || !cart.items) return 0;
//     return cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
//   };
  
//   const calculateTax = (subtotal) => {
//     return subtotal * 0.05; // 5% tax
//   };
  
//   const calculateShipping = (subtotal) => {
//     return subtotal > 50 ? 0 : 5.99; // Free shipping over $50
//   };
  
//   const calculateTotal = () => {
//     const subtotal = calculateSubtotal();
//     const tax = calculateTax(subtotal);
//     const shipping = calculateShipping(subtotal);
//     return subtotal + tax + shipping;
//   };
  
//   const handleSubmit = async (values, { setSubmitting }) => {
//     try {
//       setProcessingOrder(true);
//       setOrderError(null);
      
//       // Prepare order data
//       const orderData = {
//         items: cart.items.map(item => ({
//           product: item.productId,
//           quantity: item.quantity,
//           price: item.price,
//           // Include any variant information if applicable
//           ...(item.size && { size: item.size }),
//           ...(item.color && { color: item.color }),
//         })),
//         shippingAddress: values.shippingAddress,
//         billingAddress: values.sameAsShipping ? values.shippingAddress : values.billingAddress,
//         paymentMethod,
//         subtotal: calculateSubtotal(),
//         tax: calculateTax(calculateSubtotal()),
//         shippingCost: calculateShipping(calculateSubtotal()),
//         total: calculateTotal(),
//         notes: values.orderNotes,
//       };
      
//       // In a real app, you would process payment here
      
//       // Create order
//       // const response = await createOrder(orderData);
//       const response = await orderService.createOrder(orderData);
//       // Clear cart after successful order
//       await clearCart();
      
//       // Navigate to order confirmation page
//       navigate(`/order-confirmation/${response.orderId}`);
      
//       toast.success('Order placed successfully!');
//     } catch (error) {
//       console.error('Error placing order:', error);
//       setOrderError('Failed to place your order. Please try again.');
//       toast.error('Failed to place order');
//     } finally {
//       setProcessingOrder(false);
//       setSubmitting(false);
//     }
//   };
  
//   if (cartLoading) return <Loader />;
//   if (cartError) return <Alert type="error" message={cartError} />;
  
//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
//       <div className="flex flex-col lg:flex-row gap-8">
//         <div className="w-full lg:w-2/3">
//           <Formik
//             initialValues={initialValues}
//             validationSchema={validationSchema}
//             onSubmit={handleSubmit}
//           >
//             {({ values, setFieldValue, isSubmitting }) => (
//               <Form className="space-y-8">
//                 {/* Shipping Address */}
//                 <div className="bg-white rounded-lg shadow-md p-6">
//                   <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
//                   <AddressForm 
//                     prefix="shippingAddress"
//                     values={values.shippingAddress}
//                   />
//                 </div>
                
//                 {/* Billing Address */}
//                 <div className="bg-white rounded-lg shadow-md p-6">
//                   <div className="flex items-center mb-4">
//                     <h2 className="text-xl font-semibold">Billing Address</h2>
//                     <label className="ml-auto flex items-center cursor-pointer">
//                       <Field 
//                         type="checkbox" 
//                         name="sameAsShipping" 
//                         className="form-checkbox h-5 w-5 text-blue-600 mr-2"
//                       />
//                       <span>Same as shipping address</span>
//                     </label>
//                   </div>
                  
//                   {!values.sameAsShipping && (
//                     <AddressForm 
//                       prefix="billingAddress"
//                       values={values.billingAddress}
//                     />
//                   )}
//                 </div>
                
//                 {/* Payment Method */}
//                 <div className="bg-white rounded-lg shadow-md p-6">
//                   <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                  
//                   <PaymentMethodSelector
//                     selectedMethod={paymentMethod}
//                     onChange={setPaymentMethod}
//                     methods={[
//                       { id: 'credit_card', name: 'Credit Card', icon: <FaCreditCard /> },
//                       { id: 'paypal', name: 'PayPal', icon: <FaPaypal /> },
//                       { id: 'cash_on_delivery', name: 'Cash on Delivery', icon: <FaMoneyBill /> },
//                     ]}
//                   />
                  
//                   {paymentMethod === 'credit_card' && (
//                     <div className="mt-6 space-y-4">
//                       <div>
//                         <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
//                           Card Number
//                         </label>
//                         <Field
//   type="text"
//   id="cardNumber"
//   name="paymentDetails.cardNumber"
//   placeholder="1234 5678 9012 3456"
//   onChange={(e) => {
//     const formatted = formatCardNumber(e.target.value);
//     setFieldValue('paymentDetails.cardNumber', formatted);
//   }}
//   className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// />

//                         <ErrorMessage name="paymentDetails.cardNumber" component="div" className="text-red-500 text-sm mt-1" />
//                       </div>
                      
//                       <div>
//                         <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">
//                           Name on Card
//                         </label>
//                         <Field
//                           type="text"
//                           id="cardName"
//                           name="paymentDetails.cardName"
//                           placeholder="John Doe"
//                                                     className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                         <ErrorMessage name="paymentDetails.cardName" component="div" className="text-red-500 text-sm mt-1" />
//                       </div>
                      
//                       <div className="grid grid-cols-2 gap-4">
//                         <div>
//                           <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
//                             Expiry Date
//                           </label>
//                           <Field
//                             type="text"
//                             id="expiryDate"
//                             name="paymentDetails.expiryDate"
//                             placeholder="MM/YY"
//                             className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                           />
//                           <ErrorMessage name="paymentDetails.expiryDate" component="div" className="text-red-500 text-sm mt-1" />
//                         </div>
                        
//                         <div>
//                           <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
//                             CVV
//                           </label>
//                           <Field
//                             type="text"
//                             id="cvv"
//                             name="paymentDetails.cvv"
//                             placeholder="123"
//                             className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                           />
//                           <ErrorMessage name="paymentDetails.cvv" component="div" className="text-red-500 text-sm mt-1" />
//                         </div>
//                       </div>
                      
//                       <div className="text-sm text-gray-500 flex items-center mt-2">
//                         <FaLock className="mr-1" /> Your payment information is secure and encrypted
//                       </div>
//                     </div>
//                   )}
                  
//                   {paymentMethod === 'paypal' && (
//                     <div className="mt-4 p-4 bg-blue-50 rounded-md">
//                       <p className="text-gray-700">
//                         You will be redirected to PayPal to complete your payment after reviewing your order.
//                       </p>
//                     </div>
//                   )}
                  
//                   {paymentMethod === 'cash_on_delivery' && (
//                     <div className="mt-4 p-4 bg-yellow-50 rounded-md">
//                       <p className="text-gray-700">
//                         You will pay in cash when your order is delivered. Additional fee may apply.
//                       </p>
//                     </div>
//                   )}
//                 </div>
                
//                 {/* Order Notes */}
//                 <div className="bg-white rounded-lg shadow-md p-6">
//                   <h2 className="text-xl font-semibold mb-4">Additional Information</h2>
                  
//                   <div>
//                     <label htmlFor="orderNotes" className="block text-sm font-medium text-gray-700 mb-1">
//                       Order Notes (Optional)
//                     </label>
//                     <Field
//                       as="textarea"
//                       id="orderNotes"
//                       name="orderNotes"
//                       rows="3"
//                       placeholder="Special instructions for delivery or any other notes"
//                       className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                   </div>
//                 </div>
                
//                 {/* Submit Button (Mobile) */}
//                 <div className="lg:hidden">
//                   <Button
//                     type="submit"
//                     disabled={isSubmitting || processingOrder}
//                     className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-md font-medium"
//                   >
//                     {isSubmitting || processingOrder ? (
//                       <>Processing Order...</>
//                     ) : (
//                       <>Complete Order</>
//                     )}
//                   </Button>
//                 </div>
//               </Form>
//             )}
//           </Formik>
//         </div>
        
//         {/* Order Summary */}
//         <div className="w-full lg:w-1/3">
//           <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
//             <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
//             {cart && cart.items && (
//               <OrderSummary 
//                 items={cart.items}
//                 subtotal={calculateSubtotal()}
//                 tax={calculateTax(calculateSubtotal())}
//                 shipping={calculateShipping(calculateSubtotal())}
//                 total={calculateTotal()}
//               />
//             )}
            
//             {orderError && (
//               <Alert type="error" message={orderError} className="mt-4" />
//             )}
            
//             {/* Submit Button (Desktop) */}
//             <div className="hidden lg:block mt-6">
//               <Button
//                 type="submit"
//                 form="checkout-form"
//                 disabled={processingOrder}
//                 className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-md font-medium"
//               >
//                 {processingOrder ? (
//                   <>Processing Order...</>
//                 ) : (
//                   <>Complete Order</>
//                 )}
//               </Button>
//             </div>
            
//             <div className="mt-4 text-sm text-gray-500">
//               <p className="flex items-center">
//                 <FaLock className="mr-1" /> Secure Checkout
//               </p>
//               <p className="mt-2">
//                 By completing your purchase, you agree to our{' '}
//                 <a href="/terms" className="text-blue-600 hover:underline">Terms of Service</a> and{' '}
//                 <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CheckoutPage;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FaLock, FaCreditCard, FaMoneyBill, FaPaypal } from 'react-icons/fa';
import Loader from '../components/common/Loader';
import Alert from '../components/common/Alert';
import Button from '../components/common/Button';
import OrderSummary from '../components/checkout/OrderSummary';
import AddressForm from '../components/checkout/AddressForm';
import PaymentMethodSelector from '../components/checkout/PaymentMethodSelector';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import orderService from '../services/orderService';
import { toast } from 'react-hot-toast';

const CheckoutPage = () => {
  const { cart, loading: cartLoading, error: cartError, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [processingOrder, setProcessingOrder] = useState(false);
  const [orderError, setOrderError] = useState(null);

  // Card number formatting function
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }
    
    if (cart && (!cart.items || cart.items.length === 0)) {
      navigate('/cart');
      toast.info('Your cart is empty');
    }
  }, [isAuthenticated, cart, navigate]);

  const initialValues = {
    // Shipping Address
    shippingAddress: {
      fullName: user?.name || '',
      addressLine1: user?.address?.addressLine1 || '',
      addressLine2: user?.address?.addressLine2 || '',
      city: user?.address?.city || '',
      state: user?.address?.state || '',
      postalCode: user?.address?.postalCode || '',
      country: user?.address?.country || 'US',
      phone: user?.phone || '',
    },
    // Billing Address
    sameAsShipping: true,
    billingAddress: {
      fullName: user?.name || '',
      addressLine1: user?.address?.addressLine1 || '',
      addressLine2: user?.address?.addressLine2 || '',
      city: user?.address?.city || '',
      state: user?.address?.state || '',
      postalCode: user?.address?.postalCode || '',
      country: user?.address?.country || 'US',
      phone: user?.phone || '',
    },
    // Payment Details (for credit card)
    paymentDetails: {
      cardNumber: '',
      cardName: '',
      expiryDate: '',
      cvv: '',
    },
    // Order Notes
    orderNotes: '',
  };

  const validationSchema = Yup.object({
    shippingAddress: Yup.object({
      fullName: Yup.string().required('Full name is required'),
      addressLine1: Yup.string().required('Address is required'),
      city: Yup.string().required('City is required'),
      state: Yup.string().required('State is required'),
      postalCode: Yup.string().required('Postal code is required'),
      country: Yup.string().required('Country is required'),
      phone: Yup.string()
        .required('Phone number is required')
        .matches(/^\+?[\d\s-()]+$/, 'Invalid phone number'),
    }),
    sameAsShipping: Yup.boolean(),
    billingAddress: Yup.object().when('sameAsShipping', {
      is: false,
      then: (schema) => schema.shape({
        fullName: Yup.string().required('Full name is required'),
        addressLine1: Yup.string().required('Address is required'),
        city: Yup.string().required('City is required'),
        state: Yup.string().required('State is required'),
        postalCode: Yup.string().required('Postal code is required'),
        country: Yup.string().required('Country is required'),
        phone: Yup.string().required('Phone number is required'),
      }),
      otherwise: (schema) => schema.notRequired(),
    }),
    paymentDetails: Yup.object().when([], {
      is: () => paymentMethod === 'credit_card',
      then: (schema) => schema.shape({
        cardNumber: Yup.string()
          .required('Card number is required')
          .test('card-number', 'Invalid card number', (value) => {
            return value && value.replace(/\s/g, '').length >= 13;
          }),
        cardName: Yup.string().required('Name on card is required'),
        expiryDate: Yup.string()
          .required('Expiry date is required')
          .matches(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Format: MM/YY'),
        cvv: Yup.string()
          .required('CVV is required')
          .matches(/^\d{3,4}$/, 'CVV must be 3 or 4 digits'),
      }),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

  const calculateSubtotal = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateTax = (subtotal) => {
    return subtotal * 0.05; // 5% tax
  };

  const calculateShipping = (subtotal) => {
    return subtotal > 50 ? 0 : 5.99; // Free shipping over $50
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = calculateTax(subtotal);
    const shipping = calculateShipping(subtotal);
    return subtotal + tax + shipping;
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setProcessingOrder(true);
      setOrderError(null);
      
      // Prepare order data
      const orderData = {
        items: cart.items.map(item => ({
          product: item.productId,
          quantity: item.quantity,
          price: item.price,
          // Include any variant information if applicable
          ...(item.size && { size: item.size }),
          ...(item.color && { color: item.color }),
        })),
        shippingAddress: values.shippingAddress,
        billingAddress: values.sameAsShipping ? values.shippingAddress : values.billingAddress,
        paymentMethod,
        subtotal: calculateSubtotal(),
        tax: calculateTax(calculateSubtotal()),
        shippingCost: calculateShipping(calculateSubtotal()),
        total: calculateTotal(),
        notes: values.orderNotes,
      };
      
      // Create order
      const response = await orderService.createOrder(orderData);
      
      // Clear cart after successful order
      await clearCart();
      
      // Navigate to order confirmation page
      navigate(`/order-confirmation/${response.orderId}`);
      
      toast.success('Order placed successfully!');
    } catch (error) {
      console.error('Error placing order:', error);
      setOrderError('Failed to place your order. Please try again.');
      toast.error('Failed to place order');
    } finally {
      setProcessingOrder(false);
      setSubmitting(false);
    }
  };

  if (cartLoading) return <Loader />;
  if (cartError) return <Alert type="error" message={cartError} />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-2/3">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue, isSubmitting }) => (
              <Form className="space-y-8" id="checkout-form">
                {/* Shipping Address */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
                  <AddressForm 
                    prefix="shippingAddress"
                    values={values.shippingAddress}
                  />
                </div>
                
                {/* Billing Address */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center mb-4">
                    <h2 className="text-xl font-semibold">Billing Address</h2>
                    <label className="ml-auto flex items-center cursor-pointer">
                      <Field 
                        type="checkbox" 
                        name="sameAsShipping" 
                        className="form-checkbox h-5 w-5 text-blue-600 mr-2"
                      />
                      <span>Same as shipping address</span>
                    </label>
                  </div>
                  
                  {!values.sameAsShipping && (
                    <AddressForm 
                      prefix="billingAddress"
                      values={values.billingAddress}
                    />
                  )}
                </div>
                
                {/* Payment Method */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                  
                  <PaymentMethodSelector
                    selectedMethod={paymentMethod}
                    onChange={setPaymentMethod}
                    methods={[
                      { id: 'credit_card', name: 'Credit Card', icon: <FaCreditCard /> },
                      { id: 'paypal', name: 'PayPal', icon: <FaPaypal /> },
                      { id: 'cash_on_delivery', name: 'Cash on Delivery', icon: <FaMoneyBill /> },
                    ]}
                  />
                  
                  {paymentMethod === 'credit_card' && (
                    <div className="mt-6 space-y-4">
                      <div>
                        <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                          Card Number
                        </label>
                        <Field
                          type="text"
                          id="cardNumber"
                          name="paymentDetails.cardNumber"
                          placeholder="1234 5678 9012 3456"
                          onChange={(e) => {
                            const formatted = formatCardNumber(e.target.value);
                            setFieldValue('paymentDetails.cardNumber', formatted);
                          }}
                          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <ErrorMessage name="paymentDetails.cardNumber" component="div" className="text-red-500 text-sm mt-1" />
                      </div>
                      
                      <div>
                        <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">
                          Name on Card
                        </label>
                        <Field
                          type="text"
                          id="cardName"
                          name="paymentDetails.cardName"
                          placeholder="John Doe"
                          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <ErrorMessage name="paymentDetails.cardName" component="div" className="text-red-500 text-sm mt-1" />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                            Expiry Date
                          </label>
                          <Field
                            type="text"
                            id="expiryDate"
                            name="paymentDetails.expiryDate"
                            placeholder="MM/YY"
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <ErrorMessage name="paymentDetails.expiryDate" component="div" className="text-red-500 text-sm mt-1" />
                        </div>
                        
                        <div>
                          <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                            CVV
                          </label>
                          <Field
                            type="text"
                            id="cvv"
                            name="paymentDetails.cvv"
                            placeholder="123"
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <ErrorMessage name="paymentDetails.cvv" component="div" className="text-red-500 text-sm mt-1" />
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-500 flex items-center mt-2">
                        <FaLock className="mr-1" /> Your payment information is secure and encrypted
                      </div>
                    </div>
                  )}
                  
                  {paymentMethod === 'paypal' && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-md">
                      <p className="text-gray-700">
                        You will be redirected to PayPal to complete your payment after reviewing your order.
                      </p>
                    </div>
                  )}
                  
                  {paymentMethod === 'cash_on_delivery' && (
                    <div className="mt-4 p-4 bg-yellow-50 rounded-md">
                      <p className="text-gray-700">
                        You will pay in cash when your order is delivered. Additional fee may apply.
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Order Notes */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-4">Additional Information</h2>
                  <div>
                    <label htmlFor="orderNotes" className="block text-sm font-medium text-gray-700 mb-1">
                      Order Notes (Optional)
                    </label>
                    <Field
                      as="textarea"
                      id="orderNotes"
                      name="orderNotes"
                      rows="3"
                      placeholder="Special instructions for delivery or any other notes"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                {/* Submit Button (Mobile) */}
                <div className="lg:hidden">
                  <Button
                    type="submit"
                    disabled={isSubmitting || processingOrder}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-md font-medium"
                  >
                    {isSubmitting || processingOrder ? (
                      <>Processing Order...</>
                    ) : (
                      <>Complete Order</>
                    )}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
        
        {/* Order Summary */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            {cart && cart.items && (
              <OrderSummary 
                items={cart.items}
                subtotal={calculateSubtotal()}
                tax={calculateTax(calculateSubtotal())}
                shipping={calculateShipping(calculateSubtotal())}
                total={calculateTotal()}
              />
            )}
            
            {orderError && (
              <Alert type="error" message={orderError} className="mt-4" />
            )}
            
            {/* Submit Button (Desktop) */}
            <div className="hidden lg:block mt-6">
              <Button
                type="submit"
                form="checkout-form"
                disabled={processingOrder}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-md font-medium"
              >
                {processingOrder ? (
                  <>Processing Order...</>
                ) : (
                  <>Complete Order</>
                )}
              </Button>
            </div>
            
            <div className="mt-4 text-sm text-gray-500">
              <p className="flex items-center">
                <FaLock className="mr-1" /> Secure Checkout
              </p>
              <p className="mt-2">
                By completing your purchase, you agree to our{' '}
                <a href="/terms" className="text-blue-600 hover:underline">Terms of Service</a> and{' '}
                <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
