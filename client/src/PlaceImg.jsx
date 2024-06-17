import React from 'react'

export default function PlaceImg({place,idx=0,className}) {
    if(!place.photos?.length)
    {
        return '';
    }
    if(!className)
    {
        className='object-cover';
    }
  return (
    <img className={className} src={'http://localhost:4000/uploads/'+place.photos[idx]} alt=""/>

  )
}