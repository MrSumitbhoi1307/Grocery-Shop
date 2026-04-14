import React from 'react';
import MainBanner from '../components/MainBanner';  // path adjust kar lena
import Categories from '../components/Categories';
import BestSeller from '../components/BestSeller';
import BottomBanner from '../components/BottomBanner';
import NewsLetter from '../components/NewsLetter';

const Home = () => {
  return (
    <div className="mt-10">   {/* typo fix: ckassName → className */}
      <MainBanner />
      <Categories />
      <BestSeller/>
      <BottomBanner/>
      <NewsLetter/>
    </div>
  );
};

export default Home;