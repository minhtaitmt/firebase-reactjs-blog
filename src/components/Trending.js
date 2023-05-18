import React from 'react'
import OwlCarousel from 'react-owl-carousel'
import { Link } from 'react-router-dom'
import "owl.carousel/dist/assets/owl.carousel.css"
import "owl.carousel/dist/assets/owl.theme.default.css"

const Trending = ({blogs}) => {
    const options = {
        loop: true,
        margin: 10,
        nav: true,
        responsive: {
            0: {
                items: 1,
            },
            400: {
                items: 2,
            },
            600: {
                items: 3,
            },
            1000: {
                items: 4,
            },
        }
    }
  return (
    <>
        <div>
			<div class="blog-heading text-start py-2 mb-4">Trending</div>
        </div>
        <OwlCarousel className="owl-theme" {...options}>
            {blogs?.map((item) => (
                <div class="item px-2" key={item.id}>
                    <Link to={`/detail/${item.id}`}>
                        <div class="trending-img-position">
                            <div class="trending-img-size">
                                <img src={item.imgUrl} alt={item.title} class="trending-img-relative"/>
                            </div>
                            <div class="trending-img-absolute"></div>
                            <div class="trending-img-absolute-1">
                                <span class="text-white">{item.title}</span>
                                <div class="trending-meta-info">
                                    {item.author} - {item.timestamp.toDate().toDateString()}
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>
            ))}
        </OwlCarousel>
    </>
  )
}

export default Trending