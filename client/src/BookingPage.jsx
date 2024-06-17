import React, { useEffect } from 'react'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios';
import AddressLink from './AddressLink';
import PlaceGallery from './PlaceGallery';
import BookingDates from './BookingDates';

export default function BookingPage() {

  const { id } = useParams();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    if (id) {
      axios.get('/bookings').then(response => {
        const foundBooking = response.data.find(({ _id }) => _id === id);
        if (foundBooking)
          setBooking(foundBooking);
      })
    }
  }, [id]);

  if (!booking)
    return '';

  return (
    <div className='my-8'>
      <h1 className='text-3xl'>{booking.place.title}</h1>
      <AddressLink className='my-2 block'>{booking.place.address}</AddressLink>

      <div className='p-6 bg-gray-200 rounded-2xl my-6 flex items-center justify-between'>
        <div>

          <h2 className='text-2xl mb-4 '>Your booking Information:</h2>
          <BookingDates booking={booking} />
        </div>
        <div className='bg-primary text-white px-4 py-2 rounded-2xl'>
          <div>Total Price</div>
          <div className='text-2xl'>${booking.price}</div>
        </div>
      </div>
      <PlaceGallery place={booking.place} />
    </div>
  )
}
