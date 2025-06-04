import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FaPlus, FaSpinner, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { addProduct } from '../../services/productService';
// import { addClothingItem } from '../../services/clothesService';
// import clothesService from '../services/clothesService';
import { addClothingItem } from "../../services/clothesService";
import restaurantService from '../../services/restaurantService';

const AddProduct = () => {   
  const navigate = useNavigate();
  const [productType, setProductType] = useState('grocery');
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  // Validation schemas based on product type
  const grocerySchema = Yup.object({
    name: Yup.string().required('Product name is required'),
    description: Yup.string().required('Description is required'),
    price: Yup.number().positive('Price must be positive').required('Price is required'),
    category: Yup.string().required('Category is required'),
    stock: Yup.number().integer('Stock must be a whole number').min(0, 'Stock cannot be negative').required('Stock is required'),
    unit: Yup.string().required('Unit is required'),
    brand: Yup.string().required('Brand is required'),
    isOrganic: Yup.boolean(),
    discount: Yup.number().min(0, 'Discount cannot be negative').max(100, 'Discount cannot exceed 100%'),
  });

  const clothingSchema = Yup.object({
    name: Yup.string().required('Product name is required'),
    description: Yup.string().required('Description is required'),
    price: Yup.number().positive('Price must be positive').required('Price is required'),
    category: Yup.string().required('Category is required'),
    stock: Yup.number().integer('Stock must be a whole number').min(0, 'Stock cannot be negative').required('Stock is required'),
    brand: Yup.string().required('Brand is required'),
    sizes: Yup.array().of(Yup.string()).min(1, 'At least one size is required'),
    colors: Yup.array().of(Yup.string()).min(1, 'At least one color is required'),
    gender: Yup.string().required('Gender is required'),
    discount: Yup.number().min(0, 'Discount cannot be negative').max(100, 'Discount cannot exceed 100%'),
  });

  const restaurantSchema = Yup.object({
    name: Yup.string().required('Menu item name is required'),
    description: Yup.string().required('Description is required'),
    price: Yup.number().positive('Price must be positive').required('Price is required'),
    category: Yup.string().required('Category is required'),
    preparationTime: Yup.number().positive('Preparation time must be positive').required('Preparation time is required'),
    isVegetarian: Yup.boolean(),
    isVegan: Yup.boolean(),
    isGlutenFree: Yup.boolean(),
    spicyLevel: Yup.string(),
    calories: Yup.number().min(0, 'Calories cannot be negative'),
    ingredients: Yup.array().of(Yup.string()).min(1, 'At least one ingredient is required'),
    allergens: Yup.array().of(Yup.string()),
    discount: Yup.number().min(0, 'Discount cannot be negative').max(100, 'Discount cannot exceed 100%'),
    isAvailable: Yup.boolean().default(true),
  });

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setUploading(true);
    
    // In a real app, you would upload these to your server or cloud storage
    // For now, we'll just create local URLs
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    
    setImages([...images, ...newImages]);
    setUploading(false);
  };

  const removeImage = (index) => {
    const newImages = [...images];
    URL.revokeObjectURL(newImages[index].preview);
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      // In a real app, you would first upload images to get their URLs
      const imageUrls = images.map(img => img.preview); // Placeholder
      
      const productData = {
        ...values,
        images: imageUrls,
      };
      
      let response;
      if (productType === 'grocery') {
        response = await addProduct(productData);
      } else if (productType === 'clothing') {
        response = await addClothingItem(productData);
      } else if (productType === 'restaurant') {
        response = await restaurantService.addMenuItem(productData);
      }
      
      toast.success(`${
        productType === 'grocery' 
          ? 'Product' 
          : productType === 'clothing' 
            ? 'Clothing item' 
            : 'Menu item'
      } added successfully!`);
      
      resetForm();
      setImages([]);
      
      // Navigate to inventory management
      navigate('/vendor/inventory');
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error(`Failed to add ${
        productType === 'grocery' 
          ? 'product' 
          : productType === 'clothing' 
            ? 'clothing item' 
            : 'menu item'
      }`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Add New Product</h1>
      
      {/* Product Type Selection */}
      <div className="mb-8">
        <label className="block text-gray-700 text-sm font-bold mb-2">Product Type</label>
        <div className="flex flex-wrap space-x-4">
          <button
            type="button"
            onClick={() => setProductType('grocery')}
            className={`px-4 py-2 rounded-md mb-2 ${
              productType === 'grocery' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Grocery Product
          </button>
          <button
            type="button"
            onClick={() => setProductType('clothing')}
            className={`px-4 py-2 rounded-md mb-2 ${
              productType === 'clothing' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Clothing Item
          </button>
          <button
            type="button"
            onClick={() => setProductType('restaurant')}
            className={`px-4 py-2 rounded-md mb-2 ${
              productType === 'restaurant' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Restaurant Menu Item
          </button>
        </div>
      </div>
      
      {/* Product Form */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <Formik
          initialValues={
            productType === 'grocery' 
              ? {
                  name: '',
                  description: '',
                  price: '',
                  category: '',
                  stock: '',
                  unit: 'piece',
                  brand: '',
                  isOrganic: false,
                  discount: 0,
                }
              : productType === 'clothing'
                ? {
                    name: '',
                    description: '',
                    price: '',
                    category: '',
                    stock: '',
                    brand: '',
                    sizes: [],
                    colors: [],
                    gender: '',
                    discount: 0,
                  }
                : {
                    name: '',
                    description: '',
                    price: '',
                    category: '',
                    preparationTime: '',
                    isVegetarian: false,
                    isVegan: false,
                    isGlutenFree: false,
                    spicyLevel: 'mild',
                    calories: '',
                    ingredients: [],
                    allergens: [],
                    discount: 0,
                    isAvailable: true,
                  }
          }
          validationSchema={
            productType === 'grocery' 
              ? grocerySchema 
              : productType === 'clothing'
                ? clothingSchema
                : restaurantSchema
          }
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting, setFieldValue, values }) => (
            <Form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Common Fields */}
                <div>
                  <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                    {productType === 'restaurant' ? 'Menu Item Name' : 'Product Name'}
                  </label>
                  <Field
                    type="text"
                    id="name"
                    name="name"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={`Enter ${productType === 'restaurant' ? 'menu item' : 'product'} name`}
                  />
                  <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
                </div>
                
                <div>
                  <label htmlFor="price" className="block text-gray-700 text-sm font-bold mb-2">
                    Price ($)
                  </label>
                  <Field
                    type="number"
                    id="price"
                    name="price"
                    step="0.01"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                  />
                  <ErrorMessage name="price" component="div" className="text-red-500 text-sm mt-1" />
                </div>
                
                <div>
                  <label htmlFor="category" className="block text-gray-700 text-sm font-bold mb-2">
                    Category
                  </label>
                  <Field
                    as="select"
                    id="category"
                    name="category"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a category</option>
                    {productType === 'grocery' ? (
                      <>
                        <option value="fruits">Fruits</option>
                        <option value="vegetables">Vegetables</option>
                        <option value="dairy">Dairy</option>
                        <option value="bakery">Bakery</option>
                        <option value="meat">Meat</option>
                        <option value="beverages">Beverages</option>
                        <option value="snacks">Snacks</option>
                        <option value="canned">Canned Goods</option>
                        <option value="frozen">Frozen Foods</option>
                        <option value="household">Household</option>
                      </>
                    ) : productType === 'clothing' ? (
                      <>
                        <option value="tops">Tops</option>
                        <option value="bottoms">Bottoms</option>
                        <option value="dresses">Dresses</option>
                        <option value="outerwear">Outerwear</option>
                        <option value="activewear">Activewear</option>
                        <option value="underwear">Underwear</option>
                        <option value="accessories">Accessories</option>
                        <option value="footwear">Footwear</option>
                      </>
                    ) : (
                      <>
                        <option value="appetizers">Appetizers</option>
                        <option value="soups">Soups</option>
                        <option value="salads">Salads</option>
                        <option value="main_courses">Main Courses</option>
                        <option value="burgers">Burgers</option>
                        <option value="pizza">Pizza</option>
                        <option value="pasta">Pasta</option>
                        <option value="sandwiches">Sandwiches</option>
                        <option value="seafood">Seafood</option>
                        <option value="vegetarian">Vegetarian</option>
                        <option value="desserts">Desserts</option>
                        <option value="beverages">Beverages</option>
                        <option value="sides">Side Dishes</option>
                        <option value="breakfast">Breakfast</option>
                        <option value="specials">Chef's Specials</option>
                      </>
                    )}
                  </Field>
                  <ErrorMessage name="category" component="div" className="text-red-500 text-sm mt-1" />
                </div>
                
                <div>
                  <label htmlFor="discount" className="block text-gray-700 text-sm font-bold mb-2">
                    Discount (%)
                  </label>
                  <Field
                    type="number"
                    id="discount"
                    name="discount"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                  <ErrorMessage name="discount" component="div" className="text-red-500 text-sm mt-1" />
                </div>
                
                {/* Grocery-specific fields */}
                {productType === 'grocery' && (
                  <>
                    <div>
                      <label htmlFor="stock" className="block text-gray-700 text-sm font-bold mb-2">
                        Stock Quantity
                      </label>
                      <Field
                        type="number"
                        id="stock"
                        name="stock"
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0"
                      />
                      <ErrorMessage name="stock" component="div" className="text-red-500 text-sm mt-1" />
                    </div>
                    
                    <div>
                      <label htmlFor="brand" className="block text-gray-700 text-sm font-bold mb-2">
                        Brand
                      </label>
                      <Field
                                                type="text"
                        id="brand"
                        name="brand"
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter brand name"
                      />
                      <ErrorMessage name="brand" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    <div>
                      <label htmlFor="unit" className="block text-gray-700 text-sm font-bold mb-2">
                        Unit
                      </label>
                      <Field
                        as="select"
                        id="unit"
                        name="unit"
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="piece">Piece</option>
                        <option value="kg">Kilogram (kg)</option>
                        <option value="g">Gram (g)</option>
                        <option value="lb">Pound (lb)</option>
                        <option value="oz">Ounce (oz)</option>
                        <option value="l">Liter (L)</option>
                        <option value="ml">Milliliter (ml)</option>
                        <option value="dozen">Dozen</option>
                        <option value="pack">Pack</option>
                        <option value="box">Box</option>
                      </Field>
                      <ErrorMessage name="unit" component="div" className="text-red-500 text-sm mt-1" />
                    </div>
                    
                    <div className="flex items-center">
                      <label className="flex items-center cursor-pointer">
                        <Field
                          type="checkbox"
                          name="isOrganic"
                          className="form-checkbox h-5 w-5 text-blue-600"
                        />
                        <span className="ml-2 text-gray-700">Organic Product</span>
                      </label>
                    </div>
                  </>
                )}
                
                {/* Clothing-specific fields */}
                {productType === 'clothing' && (
                  <>
                    <div>
                      <label htmlFor="stock" className="block text-gray-700 text-sm font-bold mb-2">
                        Stock Quantity
                      </label>
                      <Field
                        type="number"
                        id="stock"
                        name="stock"
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0"
                      />
                      <ErrorMessage name="stock" component="div" className="text-red-500 text-sm mt-1" />
                    </div>
                    
                    <div>
                      <label htmlFor="brand" className="block text-gray-700 text-sm font-bold mb-2">
                        Brand
                      </label>
                      <Field
                        type="text"
                        id="brand"
                        name="brand"
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter brand name"
                      />
                      <ErrorMessage name="brand" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    <div>
                      <label htmlFor="gender" className="block text-gray-700 text-sm font-bold mb-2">
                        Gender
                      </label>
                      <Field
                        as="select"
                        id="gender"
                        name="gender"
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select gender</option>
                        <option value="men">Men</option>
                        <option value="women">Women</option>
                        <option value="unisex">Unisex</option>
                        <option value="kids">Kids</option>
                      </Field>
                      <ErrorMessage name="gender" component="div" className="text-red-500 text-sm mt-1" />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">Sizes</label>
                      <div className="flex flex-wrap gap-2">
                        {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => (
                          <label key={size} className="inline-flex items-center">
                            <input
                              type="checkbox"
                              className="form-checkbox h-5 w-5 text-blue-600"
                              checked={values.sizes.includes(size)}
                              onChange={() => {
                                const newSizes = values.sizes.includes(size)
                                  ? values.sizes.filter(s => s !== size)
                                  : [...values.sizes, size];
                                setFieldValue('sizes', newSizes);
                              }}
                            />
                            <span className="ml-2">{size}</span>
                          </label>
                        ))}
                      </div>
                      <ErrorMessage name="sizes" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">Colors</label>
                      <div className="flex flex-wrap gap-2">
                        {['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Pink', 'Gray', 'Brown'].map(color => (
                          <label key={color} className="inline-flex items-center">
                            <input
                              type="checkbox"
                              className="form-checkbox h-5 w-5 text-blue-600"
                              checked={values.colors.includes(color)}
                              onChange={() => {
                                const newColors = values.colors.includes(color)
                                  ? values.colors.filter(c => c !== color)
                                  : [...values.colors, color];
                                setFieldValue('colors', newColors);
                              }}
                            />
                            <span className="ml-2">{color}</span>
                          </label>
                        ))}
                      </div>
                      <ErrorMessage name="colors" component="div" className="text-red-500 text-sm mt-1" />
                    </div>
                  </>
                )}

                {/* Restaurant-specific fields */}
                {productType === 'restaurant' && (
                  <>
                    <div>
                      <label htmlFor="preparationTime" className="block text-gray-700 text-sm font-bold mb-2">
                        Preparation Time (minutes)
                      </label>
                      <Field
                        type="number"
                        id="preparationTime"
                        name="preparationTime"
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="15"
                      />
                      <ErrorMessage name="preparationTime" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    <div>
                      <label htmlFor="calories" className="block text-gray-700 text-sm font-bold mb-2">
                        Calories
                      </label>
                      <Field
                        type="number"
                        id="calories"
                        name="calories"
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0"
                      />
                      <ErrorMessage name="calories" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    <div>
                      <label htmlFor="spicyLevel" className="block text-gray-700 text-sm font-bold mb-2">
                        Spicy Level
                      </label>
                      <Field
                        as="select"
                        id="spicyLevel"
                        name="spicyLevel"
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="not_spicy">Not Spicy</option>
                        <option value="mild">Mild</option>
                        <option value="medium">Medium</option>
                        <option value="hot">Hot</option>
                        <option value="extra_hot">Extra Hot</option>
                      </Field>
                    </div>

                    <div className="flex flex-col space-y-2">
                      <label className="block text-gray-700 text-sm font-bold">Dietary Options</label>
                      <label className="inline-flex items-center">
                        <Field
                          type="checkbox"
                          name="isVegetarian"
                          className="form-checkbox h-5 w-5 text-blue-600"
                        />
                        <span className="ml-2 text-gray-700">Vegetarian</span>
                      </label>
                      <label className="inline-flex items-center">
                        <Field
                          type="checkbox"
                          name="isVegan"
                          className="form-checkbox h-5 w-5 text-blue-600"
                        />
                        <span className="ml-2 text-gray-700">Vegan</span>
                      </label>
                      <label className="inline-flex items-center">
                        <Field
                          type="checkbox"
                          name="isGlutenFree"
                          className="form-checkbox h-5 w-5 text-blue-600"
                        />
                        <span className="ml-2 text-gray-700">Gluten Free</span>
                      </label>
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">Ingredients</label>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        {values.ingredients && values.ingredients.map((ingredient, index) => (
                          <div key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md flex items-center">
                            <span>{ingredient}</span>
                            <button
                              type="button"
                              className="ml-1 text-blue-600 hover:text-blue-800"
                              onClick={() => {
                                const newIngredients = [...values.ingredients];
                                newIngredients.splice(index, 1);
                                setFieldValue('ingredients', newIngredients);
                              }}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="flex">
                        <input
                          type="text"
                          className="flex-grow px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Add ingredient"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && e.target.value.trim()) {
                              e.preventDefault();
                              setFieldValue('ingredients', [...(values.ingredients || []), e.target.value.trim()]);
                              e.target.value = '';
                            }
                          }}
                        />
                        <button
                          type="button"
                          className="px-3 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
                          onClick={(e) => {
                            const input = e.target.previousSibling;
                            if (input.value.trim()) {
                              setFieldValue('ingredients', [...(values.ingredients || []), input.value.trim()]);
                              input.value = '';
                            }
                          }}
                        >
                          Add
                        </button>
                      </div>
                      <ErrorMessage name="ingredients" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">Allergens</label>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        {values.allergens && values.allergens.map((allergen, index) => (
                          <div key={index} className="bg-red-100 text-red-800 px-2 py-1 rounded-md flex items-center">
                            <span>{allergen}</span>
                            <button
                              type="button"
                              className="ml-1 text-red-600 hover:text-red-800"
                              onClick={() => {
                                const newAllergens = [...values.allergens];
                                newAllergens.splice(index, 1);
                                setFieldValue('allergens', newAllergens);
                              }}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="flex">
                        <input
                          type="text"
                          className="flex-grow px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Add allergen"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && e.target.value.trim()) {
                              e.preventDefault();
                              setFieldValue('allergens', [...(values.allergens || []), e.target.value.trim()]);
                              e.target.value = '';
                            }
                          }}
                        />
                        <button
                          type="button"
                          className="px-3 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
                          onClick={(e) => {
                            const input = e.target.previousSibling;
                            if (input.value.trim()) {
                              setFieldValue('allergens', [...(values.allergens || []), input.value.trim()]);
                              input.value = '';
                            }
                          }}
                        >
                          Add
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <label className="flex items-center cursor-pointer">
                        <Field
                          type="checkbox"
                          name="isAvailable"
                          className="form-checkbox h-5 w-5 text-blue-600"
                        />
                        <span className="ml-2 text-gray-700">Available for Order</span>
                      </label>
                    </div>
                  </>
                )}
              </div>

              {/* Description Field - Full Width */}
              <div>
                <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
                  Description
                </label>
                <Field
                  as="textarea"
                  id="description"
                  name="description"
                  rows="4"
                                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter product description"
                />
                <ErrorMessage name="description" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Image Upload Section */}
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Product Images</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                      >
                        <span>Upload images</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={uploading}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </div>

                {/* Preview uploaded images */}
                {images.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image.preview}
                          alt={`Preview ${index}`}
                          className="h-24 w-full object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <FaTrash size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FaPlus className="mr-2" />
                      Add {
                        productType === 'grocery' 
                          ? 'Product' 
                          : productType === 'clothing' 
                            ? 'Clothing Item' 
                            : 'Menu Item'
                      }
                    </>
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>

      {/* Additional Information */}
      <div className="mt-8 bg-blue-50 p-4 rounded-md">
        <h2 className="text-lg font-semibold text-blue-800 mb-2">Tips for Adding Products</h2>
        <ul className="list-disc pl-5 text-blue-700 space-y-1">
          <li>Use high-quality images to showcase your products</li>
          <li>Write detailed descriptions to help customers make informed decisions</li>
          <li>Set competitive prices by researching similar products</li>
          <li>Keep your inventory updated to avoid overselling</li>
          <li>Use appropriate categories to help customers find your products</li>
          {productType === 'restaurant' && (
            <>
              <li>Clearly mark allergens to ensure customer safety</li>
              <li>Provide accurate preparation times to set customer expectations</li>
              <li>Include dietary information for customers with specific needs</li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default AddProduct;



