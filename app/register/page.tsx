"use client"; // This is a client component 👈🏽
import Loading from "@/components/loading"
import Link from "next/link"
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '@/components/fcm_config';
import { db } from '@/components/fcm_config';
import { collection, addDoc, setDoc, doc } from "firebase/firestore"; 

export default function Page(){
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setsuccessMsg] = useState('');

    // Check login event.
    const doSignup = () => {
        if(email=='' || password==''){
            alert('Please enter email and password!');
        return false;
        }

        setLoading(true);

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                setError('');
                // Signed in 
                console.log('userCredential : ', userCredential);
                // const user = userCredential.user;
                // ...
                setLoading(false);
                addUserToUsersTable();
                setsuccessMsg('Account created successfully! have login karo.')
            })
            .catch((error) => {
                setError(error.message);
                setsuccessMsg('')
                console.log('error : ', error.message);
                // const errorCode = error.code;
                // const errorMessage = error.message;
                // ..
                setLoading(false);
            });
    }

    const addUserToUsersTable = async () => {
        await setDoc(doc(db, "users", email), {
            name: name,
            email: email,
            online: "0"
          });
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-5">
            <div className='border-1 border-white w-3/13 h-50'>
                <center><h2 className='font-sans text-lg text-sky-300'>Create new account for Chat</h2></center>

                {error ? 
                <div className="my-3 text-white bg-red-600 p-3 rounded">{error}</div> : ''}

                {successMsg ? 
                <div className="my-3 text-white bg-green-600 p-3 rounded">{successMsg}</div> : ''}
                
                <div className='row mt-5'>
                    <label>Name</label><br/>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)}  className='bg-white p-2 h-10 w-auto text-black rounded-md' placeholder='Name'/>
                </div>
                
                <div className='row mt-5'>
                    <label>Email</label><br/>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}  className='bg-white p-2 h-10 w-auto text-black rounded-md' placeholder='Email'/>
                </div>

                <div className='row mt-5'>
                    <label>Password</label><br/>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}  className='bg-white p-2 h-10 w-auto text-black rounded-md' placeholder='Password'/>
                </div>
                <div className='row mt-5'>
                    <button onClick={doSignup} className='w-auto h-auto bg-teal-700 px-3 py-2 rounded-md'>{(loading) ? <Loading /> : 'Sign up' }</button>
                </div>
                <div className='row mt-5'>
                    <Link href="/"><button className="text-white underline">Back to Login</button></Link>
                </div>
            </div>
        </main>
    )

}