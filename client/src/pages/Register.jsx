import { useState } from "react"
import { Link } from "react-router-dom"
import axios from 'axios';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');

    async function registerUser(e)
    {
        e.preventDefault();
        try
        {
            await axios.post('/register',{
                name,
                email,
                password
            });
            alert('Registration successful. Now you can login');
        }
        catch(err)
        {
            alert('Registration failed, Please try again later');
        }
    }
    
    return (
        <div className="mt-4 grow flex items-center justify-around">
            <div className="mb-64">
                <h1 className="text-center text-4xl font-bold">Register</h1>
                <form className="max-w-md mx-auto my-6" onSubmit={registerUser}>
                    <input type="text" placeholder="John Doe" value={name} onChange={e=>setName(e.target.value)}  />
                    <input type="email" placeholder="your@gmail.com" value={email} onChange={e=>setEmail(e.target.value)}/>
                    <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)}/>
                    <button className="primary">Register</button>
                    <div className="text-center text-gray-500 py-2">
                        Already a member? <Link className="underline text-black" to={'/login'}>Login</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}