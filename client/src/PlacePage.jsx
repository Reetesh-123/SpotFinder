import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import BookingWidget from './BookingWidget';
import PlaceGallery from './PlaceGallery';
import AddressLink from './AddressLink';

export default function PlacePage() {
    const { id } = useParams();
    const [place, setPlace] = useState(null);

    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get(`/places/${id}`).then(response => {
            setPlace(response.data);
        });

    }, [id]);

    if (!place)
        return '';

   

    return (
        <div className='bg-gray-100 mt-4 -mx-8 pt-4 px-8'>
            <h1 className='text-3xl'>{place.title}</h1>
            <AddressLink>{place.address}</AddressLink>
            <PlaceGallery place={place}/>
            
            <div className="grid gap-8 grid-cols-1 md:grid-cols-[2fr_1fr] mt-8 mb-8">
                <div>
                    <div>
                        <h2 className='font-semibold text-2xl'>Description</h2>
                        <p className='mt-2'>{place.description}</p>
                    </div>
                    check-In : {place.checkIn} <br/>
                    check-Out: {place.checkOut} <br/>
                    Max number of Guests: {place.maxGuests}
                </div>
                <div>
                    <BookingWidget place={place}/>
                </div>
            </div>
            <div className='bg-white -mx-8 px-8 py-8 border-t' >
                <h2 className='font-semibold text-2xl'>Extra Info</h2>
                <div className='text-sm text-gray-700 leading-5 mt-2'>{place.extraInfo}</div>
            </div>
        </div>
    );
}
