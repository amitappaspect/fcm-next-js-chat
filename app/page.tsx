"use client"; // This is a client component 👈🏽

import { auth, db } from '@/components/fcm_config';
import Loading from '@/components/loading';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import { useState } from 'react'

export default function Home() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter()

  // Check login event.
  const doLogin = () => {
    if(email=='' || password==''){
      alert('Please enter email and password!');
      return false;
    }

    setLoading(true);
   
    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
		console.log('userCredential', userCredential);
        // Signed in 
		localStorage.setItem('loggedInUserEmail', ''+userCredential.user.email);
		localStorage.setItem('loggedInUserUid', ''+userCredential.user.uid);
        // ...

        // Update online status.
        const updateOnlineStatus = doc(db, "users", ""+userCredential.user.email);
        await updateDoc(updateOnlineStatus, {
          "online": '1',
        });

		setError('');
		setLoading(false);

		// Redirect user to chat display.
		router.push('/chat');

      })
      .catch((error) => {
		setError(error.message);
		setLoading(false);
      });
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-5">
      <div className='border-1 border-white w-3/13 h-50'>
          <center><h2 className='font-sans text-lg text-sky-300'>Welcome to chat</h2></center>

		  {error ? 
                <div className="my-3 text-white bg-red-600 p-3 rounded">{error}</div> : ''}

          <div className='row mt-5'>
            <label>Email</label><br/>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}  className='bg-white p-2 h-10 w-auto text-black rounded-md' placeholder='Email'/>
          </div>
          <div className='row mt-5'>
            <label>Password</label><br/>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}  className='bg-white p-2 h-10 w-auto text-black rounded-md' placeholder='Password'/>
          </div>
          <div className='row mt-5'>
            <button onClick={doLogin} className='w-auto h-auto bg-teal-700 px-3 py-2 rounded-md'>{(loading) ? <Loading /> : 'Login' }</button>
          </div>
          <div className='row mt-5'>
            <Link href="/register"><button className="text-white underline">Create new account</button></Link>
          </div>
      </div>
    </main>
  )
}
