"use client"; // This is a client component 👈🏽

import UserListItem from '@/components/UserListItem';
import { BiArrowBack, BiSolidPlusCircle, BiSend } from 'react-icons/bi';
import { collection, getDocs, doc, DocumentData, onSnapshot } from "firebase/firestore"; 
import { db } from '@/components/fcm_config';
import { useEffect, useState } from 'react';

export default function Chat(){
    const userEmail = localStorage.getItem('loggedInUserEmail');
    const [usersData, setUserData] = useState([]);
    
    useEffect(() => {
        getUsers();
    }, [])
    
    
    const getUsers = async () => {

        // auto update
        onSnapshot(collection(db, "users"), (doc) => {
            // console.log("Current data: ", );
            
            let tempArr = [];
            doc.docs.forEach(element => {
                tempArr.push(element.data());
            });
            setUserData(tempArr);
        });

        try {

            const querySnapshot = await getDocs(collection(db, "users"));
            let tempArr = [];
            querySnapshot.forEach((doc) => {
                console.log(`${doc.id} => `, doc.data());
                tempArr.push(doc.data());
            });
            setUserData(tempArr);

          } catch (e) {
            console.error("Error adding document: ", e);
          }
    }

    return (
        <main className="flex-row min-h-screen flex-col items-center justify-between p-5">
            {/* UserLIst */}
            <div className='w-3/12 h-full float-left flex-1'>
                {/* Header */}
                <div className="min-h-26 w-full bg-teal-800 py-3 px-3 rounded-tl-lg text-white row">
                    <div className='flex gap-2'>
                        <span className='float-left mt-2 ml-4 text-lg'>Welcome: {userEmail}</span>
                    </div>
                </div>

                {/* User List */}

                {usersData.length>0 && usersData.map((val, index) => {
                    return <UserListItem key={index} name={val.name} />
                })}
            </div>

            {/* Chat window */}
            <div className="w-9/12 rounded-t-lg h-400 float-left flex-1">
                {/* Header */}
                <div className="min-h-25 w-full bg-teal-800 py-3 px-3 rounded-tr-lg text-white row">
                    <div className='flex gap-2'>
                        <span className='float-left mt-2'><BiArrowBack size="1.5em" /></span>
                        <img className='w-10 h-10 rounded-full float-left' src="https://cdn.pixabay.com/photo/2018/08/28/12/41/avatar-3637425_640.png" />
                        <span className='float-left mt-2 ml-4 text-lg'>Group Chat</span>
                    </div>
                </div>
                {/* Chat windows */}
                <div className='w-full min-h-screen bg-teal-950'>

                </div>
                {/* Footer */}
                <div className='w-full min-h-60 bg-teal-800 p-3'>
                    <span className='float-left mt-4'><BiSolidPlusCircle size="1.5em" /></span>
                    <input type="text" className='w-10/12 h-25 bg-teal-950 ml-5 px-3 py-3 rounded-lg' placeholder='message'/>
                    <button className='w-25 h-25 bg-teal-950 p-3 rounded-full ml-5'><BiSend size="1.5em" /></button>
                </div>
            </div>
        </main>
    );
}