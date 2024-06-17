import { useEffect, useState } from "react";
import Header from "../Header";
import axios from 'axios';
import { Link } from "react-router-dom";

export default function IndexPage()
{
    const [places, setPlaces] = useState([]);
    useEffect(()=>{
        axios.get('/places').then(response => {
            setPlaces(response.data);
        })
    },[]);

    return (
        <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-8" >
            {places.length > 0 && places.map(place => (
                <Link to={'/places/'+place._id}>

                    <div className="bg-gray-300 rounded-2xl flex">
                        {place.photos?.[0] && (
                            <img className="rounded-2xl aspect-square object-cover" src={"http://localhost:4000/uploads/"+place.photos[0]} alt="" />
                        )}
                    </div>
                   <h2 className="font-semibold mt-1">{place.address}</h2> 
                   <h3 className="text-sm truncate text-gray-500">{place.title}</h3>
                   <div>
                            <span className="font-bold"> ${place.price}</span> per night
                    </div>
                </Link>
            ))}
        </div>
    );
}