import React, { useEffect, useState } from 'react'
import { differenceInCalendarDays } from 'date-fns'
import axios from 'axios';
import { Navigate } from 'react-router-dom';

function BookingWidget({ place }) {

    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [numberOfGuests, setNumberOfGuests] = useState(1);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [redirect, setRedirect] = useState(null);
    const [price, setPrice] = useState(0);
    const [numberOfNights, setNumberOfNights] = useState(0);
    useEffect(()=>{
        
        if (checkIn && checkOut) {
                setNumberOfNights(differenceInCalendarDays(new Date(checkOut), new Date(checkIn)));
                setPrice(place.price * differenceInCalendarDays(new Date(checkOut), new Date(checkIn)));
            }

    },[checkIn,checkOut]);

    async function BookingHandler()
    {
       const response = await axios.post('/bookings',{
            place:place._id,checkIn,checkOut,phone,numberOfGuests,name,price
        })
        const bookingId=response.data._id;
        setRedirect(`/account/bookings/${bookingId}`);
    }

    if(redirect)
    {
        return <Navigate to={redirect}/>
    }
    
    return (

        <div className='bg-white shadow p-4 rounded-2xl'>
            <div className='text-2xl text-center mb-2'>Price : ${place.price} per night</div>
            <div className='border rounded-2xl'>
                <div className='flex'>
                    <div className='py-2 px-4'>
                        <label htmlFor="">Check In: </label>
                        <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
                    </div>
                    <div className='py-2 px-4 border-l'>
                        <label htmlFor="">Check Out:</label>
                        <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
                    </div>
                </div>
                <div>
                    <div className='py-2 px-4 border-t'>
                        <label htmlFor="">Number of Guests:</label>
                        <input type="number" value={numberOfGuests} onChange={(e) => setNumberOfGuests(e.target.value)} />
                    </div>
                </div>
                {numberOfNights > 0 && (
                    <>
                        <div className='py-2 px-4 border-t'>
                            <label htmlFor="">Your fullname:</label>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className='py-2 px-4 border-t'>
                            <label htmlFor="">Phone number:</label>
                            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
                        </div>
                    </>
                )}
            </div>
            <button onClick={BookingHandler} className="mt-2 primary">Book this place
                {numberOfNights > 0 && (
                    <span> in ${price} </span>
                )}
            </button>
        </div>


    )
}

export default BookingWidget