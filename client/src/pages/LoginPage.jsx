import { useContext, useState } from "react"
import { Link, Navigate } from "react-router-dom"
import axios from "axios"
import { UserContext } from "../UserContext";

export default function LoginPage() {
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);
    const {setUser}=useContext(UserContext);
    
   async function handleLoginSubmit(e){
        e.preventDefault();
        try{
           const {data} = await axios.post('/login',{
                email,
                password
            });
            setUser(data);
            setRedirect(true);
            alert('login successful');
        }
        catch(err)
        {
            alert('login failed');
        }
    }
    if(redirect)
    {
        return <Navigate to={'/'}/>
    }
    return (
        <div className="mt-4 grow flex items-center justify-around">
            <div className="mb-64">
                <h1 className="text-center text-4xl font-bold">Login</h1>
                <form className="max-w-md mx-auto my-6" onSubmit={handleLoginSubmit}>
                    <input type="email" placeholder="your@gmail.com" value={email} onChange={e=>setEmail(e.target.value)} />
                    <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)}/>
                    <button className="primary">Login</button>
                    <div className="text-center text-gray-500 py-2">
                        Dont have an account yet? <Link className="underline text-black" to={'/register'}>Register now</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}