"use client"; // This is a client component 👈🏽
import { db } from '@/components/fcm_config';
import { doc, updateDoc } from "firebase/firestore"; 
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Page(){
    const router = useRouter()
    const email = localStorage.getItem('loggedInUserEmail');

    useEffect(() => {
        logoutFun();
    }, [])
    

    const logoutFun = async () => {
        if(email){
            const updateOnlineStatus = doc(db, "users", ""+email);
            await updateDoc(updateOnlineStatus, {
                "online": '0',
            });
            localStorage.clear();
            router.push('/');
        }
    }
}