import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import Perks from "../Perks";
import PhotosUploader from "../photosUploader";
import PlacesFormPage from "./PlacesFormPage";
import AccountNav from "../AccountNav";
import axios from "axios";
import PlaceImg from "../PlaceImg";

export default function PlacesPage() {
    const [places, setPlaces] = useState([]);
    useEffect(()=>{
        axios.get('/user-places').then(({data})=>{
            setPlaces(data);
        })
    },[])
    return (
        <div>
            <AccountNav/>
                <div className="mt-6 text-center">
                    <Link className="inline-flex px-4 py-2 bg-primary text-white rounded-full" to={'/account/places/new'}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Add new Place</Link>
                </div>
                <div>
                    {places.length > 0 && places.map(place=>(
                        <Link key={place} to={'/account/places/'+place._id} className=" flex gap-4 bg-gray-100 p-4 rounded-2xl mt-4 cursor-pointer">
                            <div className="flex grow shrink-0 w-32 h-32 bg-gray-200">
                                {place.photos.length > 0 && (
                                    <PlaceImg place={place}/>
                                )}
                            </div>
                            <div className="grow-0 shrink">
                                <h1 className="text-xl">{place.title}</h1>
                                <p className="text-sm mt-2">{place.description}</p>
                            </div>
                        </Link>   
                    ))}
                </div>
        </div>
    );
}