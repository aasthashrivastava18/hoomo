// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import Hero from '../components/home/Hero';
// // import HowItWorks from '../components/home/HowItWorks';
// // import CategorySection from '../components/home/CategorySection';
// // import FeaturedProducts from '../components/home/FeaturedProducts';
// import Testimonials from '../components/homes/Testimonials';
// // import Newsletter from '../components/home/Newsletter';
// // import DealsOfTheDay from '../components/home/DealsOfTheDay';
// // import TrendingProducts from '../components/home/TrendingProducts';
// import Loader from '../components/common/Loader';
// // import { getFeaturedProducts, getTrendingProducts } from '../services/productService';
// import productService from '../services/productService';
// const HomePage = () => {
//   const [featuredProducts, setFeaturedProducts] = useState([]);
//   const [trendingProducts, setTrendingProducts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//   const fetchHomeData = async () => {
//     try {
//       setLoading(true);
//       const [featured, trending] = await Promise.all([
//         productService.getFeaturedProducts(),  // Change this
//         productService.getTrendingProducts()   // Change this
//       ]);
//       setFeaturedProducts(featured);
//       setTrendingProducts(trending);
//     } catch (error) {
//       console.error('Error fetching home data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };
//   fetchHomeData();
// }, []);


//   if (loading) return <Loader />;

//   return (
//     <div className="bg-white">
//       {/* Hero Section */}
//       <Hero />
      
//       {/* How It Works */}
//       <HowItWorks />
      
//       {/* Categories */}
//       <CategorySection />
      
//       {/* Deals of the Day */}
//       <DealsOfTheDay />
      
//       {/* Featured Products */}
//       <FeaturedProducts products={featuredProducts} />
      
//       {/* Trending Products */}
//       <TrendingProducts products={trendingProducts} />
      
//       {/* Stats Section */}
//       <section className="py-16 bg-gray-50">
//         <div className="container mx-auto px-4">
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
//             <div>
//               <div className="text-3xl font-bold text-blue-600">10K+</div>
//               <div className="text-gray-600">Happy Customers</div>
//             </div>
//             <div>
//               <div className="text-3xl font-bold text-green-600">5K+</div>
//               <div className="text-gray-600">Products</div>
//             </div>
//             <div>
//               <div className="text-3xl font-bold text-purple-600">50+</div>
//               <div className="text-gray-600">Categories</div>
//             </div>
//             <div>
//               <div className="text-3xl font-bold text-orange-600">24/7</div>
//               <div className="text-gray-600">Support</div>
//             </div>
//           </div>
//         </div>
//       </section>
      
//       {/* Testimonials */}
//       <Testimonials />
      
//       {/* Newsletter */}
//       <Newsletter />
//     </div>
//   );
// };

// export default HomePage;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/home/Hero';
import HowItWorks from '../components/home/HowItWorks';
import CategorySection from '../components/home/CategorySection';
import FeaturedProducts from '../components/home/FeaturedProducts';
import Testimonials from '../components/home/Testimonials'; // Fixed path
 import Newsletter from '../components/home/Newsletter'; 
import DealsOfTheDay from '../components/home/DealsOfTheDay'; // Fixed path
import TrendingProducts from '../components/home/TrendingProducts'; // Fixed path
import Loader from '../components/common/Loader';
import productService from '../services/productService';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const [featured, trending] = await Promise.all([
          productService.getFeaturedProducts(),
          productService.getTrendingProducts()
        ]);
        setFeaturedProducts(featured);
        setTrendingProducts(trending);
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <Hero />
      
      {/* How It Works */}
      <HowItWorks />
      
      {/* Categories */}
      <CategorySection />
      
      {/* Deals of the Day */}
      <DealsOfTheDay />
      
      {/* Featured Products */}
      <FeaturedProducts products={featuredProducts} />
      
      {/* Trending Products */}
      <TrendingProducts products={trendingProducts} />
      
      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600">10K+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">5K+</div>
              <div className="text-gray-600">Products</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600">50+</div>
              <div className="text-gray-600">Categories</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600">24/7</div>
              <div className="text-gray-600">Support</div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <Testimonials />
      
      {/* Newsletter */}
      <Newsletter />
    </div>
  );
};

export default HomePage;

