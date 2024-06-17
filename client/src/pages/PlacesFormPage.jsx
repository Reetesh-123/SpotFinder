import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import axios from 'axios';
import Perks from "../Perks";
import PhotosUploader from "../photosUploader";
import AccountNav from "../AccountNav";

export default function () {
    const {id}=useParams();
    const [title, setTitle] = useState('');   
    const [address,setAddress]=useState('');
    const [addedPhoto, setAddedPhoto] = useState([]);
    const [description, setDescription] = useState('');
    const [perks, setPerks] = useState([]);
    const [extraInfo, setExtraInfo] = useState('');
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [maxGuests, setMaxGuests] = useState(1);
    const [redirect, setRedirect] = useState(false);
    const [price, setPrice] = useState(100);

    useEffect(()=>{
        if(id)
        {

            axios.get('/places/'+id).then(({data})=>{
            setTitle(data.title);
            setDescription(data.description);
            setAddress(data.address);
            setAddedPhoto(data.photos);
            setPerks(data.perks);
            setExtraInfo(data.extraInfo);
            setCheckIn(data.checkIn);
            setCheckOut(data.checkOut);
            setMaxGuests(data.maxGuests);  
            setPrice(data.price);          
        })
        }

    },[id]);

    function inputHeader(text)
    {
        return <h2 className="text-2xl mt-4 font-bold">{text}</h2>;
    }
    function inputDescription(text)
    {
        return <p className="text-gray-500 text-sm">{text}</p>;
    }
    function preInput(header,description)
    {
        return (
            <>
                    {inputHeader(header)}     
                    {inputDescription(description)}
            </>
        )
    }
    async function SavePlace(ev)
    {
        ev.preventDefault();
        const placeData={title,address,addedPhoto,
            description,perks,extraInfo,
            checkIn,checkOut,maxGuests,price};

        if(id)
        {
            //update
           const data = await axios.put('/places',{
                id,
                ...placeData
            }); 
            console.log(data);
        }
        else
        {   
            //new place
            await axios.post('/places',{
                ...placeData
            });
        }
        setRedirect(true);
    }
    
    if(redirect)
    {
        return <Navigate to ={'/account/places'}/>
    }

    return (
        <>
            <AccountNav/>
            <form action="" onSubmit={SavePlace}>
                {preInput('Title', 'Title for your place, should be short & catchy for advertisement')}
                <input type="text" placeholder="title, for example: My lovely apt" value={title} onChange={e => setTitle(e.target.value)} />

                {preInput('Address', 'Address to this place')}
                <input type="text" placeholder="address to this place" value={address} onChange={e => setAddress(e.target.value)} />

                {preInput('Photos', 'More is better')}
                <PhotosUploader addedPhoto={addedPhoto} onChange={setAddedPhoto} />


                {preInput('Description', 'Description of your place')}

                <textarea value={description} onChange={e => setDescription(e.target.value)} />

                {preInput('Perks', 'Select all the perks of your place')}


                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 mt-2">
                    <Perks selected={perks} onChange={setPerks} />
                </div>

                {preInput('Extra Info', 'House rules, etc')}
                <textarea value={extraInfo} onChange={e => setExtraInfo(e.target.value)} />

                {preInput('Check In & Out time', 'Add check-in & check-out time, remember to have cleaning window of time')}


                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    <div>
                        <h3 className="mt-2 -mb-1 font-bold">Check-In time</h3>
                        <input type="text" placeholder="13:00" value={checkIn} onChange={e => setCheckIn(e.target.value)} />
                    </div>

                    <div>
                        <h3 className="mt-2 -mb-1 font-bold">Check-Out time</h3>
                        <input type="text" placeholder="10:00" value={checkOut} onChange={e => setCheckOut(e.target.value)} />
                    </div>

                    <div>
                        <h3 className="mt-2 -mb-1 font-bold">Max number of Guests</h3>
                        <input type="number" value={maxGuests} onChange={e => setMaxGuests(e.target.value)} />
                    </div>

                    <div>
                        <h3 className="mt-2 -mb-1 font-bold">Price per night</h3>
                        <input type="number" value={price} onChange={e => setPrice(e.target.value)} />
                    </div>
                </div>
                <button type='submit' className="primary my-4">Save</button>
            </form>
        </>
    )
}
