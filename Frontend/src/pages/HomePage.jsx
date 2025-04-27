import React from 'react'
import AppLayout from '../layout/AppLayout'
import Carousel from '../components/Carousel'
import HomeEvents from '../components/HomeEvents'
import CategoryFetcher from '../components/CategoryFetcher'

const HomePage = () => {
  return (
    <AppLayout>
      <Carousel/>
      <CategoryFetcher/>
      <HomeEvents/>
    </AppLayout>
  )
}

export default HomePage
