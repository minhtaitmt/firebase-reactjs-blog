import React from 'react'
import { useNavigate } from 'react-router-dom'

const MostPopular = ({blogs}) => {
    const navigate = useNavigate()
  return (
    <div>
        <div class="blog-heading text-start pt-3 py-2 mb-4">Most Popular</div>
        {blogs?.map((item) => (
            <div class="row pb-3" key={item.id} style={{cursor: "pointer"}} onClick={() => navigate(`/detail/${item.id}`)}>
                <div class="col-5 align-self-center">
                    <img src={item.imgUrl} alt={item.title} class="most-popular-img"/>
                </div>
                <div class="col-7 padding">
                    <div class="text-start most-popular-font">{item.title}</div>
                    <div class="text-start most-popular-font-meta">{item.timestamp.toDate().toDateString()}</div>
                </div>
            </div>
        ))}
    </div>
  )
}

export default MostPopular