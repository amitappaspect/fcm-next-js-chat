"use client"; // This is a client component 👈🏽

import UserListItem from '@/components/UserListItem';
import { BiArrowBack, BiSolidPlusCircle, BiSend } from 'react-icons/bi';
import { collection, getDocs, doc, DocumentData, onSnapshot, getDoc, setDoc, addDoc, orderBy, query, updateDoc } from "firebase/firestore"; 
import { db } from '@/components/fcm_config';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getThreadId } from '@/components/helper';

export default function Chat(){
    const router = useRouter();
    const userEmail = localStorage.getItem('loggedInUserEmail');
    const ObjUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const ChatWithUser = JSON.parse(localStorage.getItem('chat_with_user'))
    const [usersData, setUserData] = useState([]);
    const [chatMessages, setChatMessages] = useState([]);
    const [user_typed_msg, set_user_typed_msg] = useState('');
    
    useEffect(() => {
        getUsers();
    }, [])
    
    
    const getUsers = async () => {

        // auto update
        onSnapshot(collection(db, "users"), (doc) => {
            // console.log("Current data: ", );
            
            let tempArr = [];
            doc.docs.forEach(element => {
                if(userEmail != element.data().email){
                    tempArr.push(element.data());
                }
            });
            setUserData(tempArr);
        });

        try {

            const querySnapshot = await getDocs(collection(db, "users"));
            let tempArr = [];
            querySnapshot.forEach((doc) => {
                if(userEmail != doc.data().email){
                    tempArr.push(doc.data());
                }
            });
            setUserData(tempArr);

          } catch (e) {
            console.error("Error adding document: ", e);
          }
    }

    // getThreadId
    const openChatSession = (receiver) => {
        let threadID = getThreadId(ObjUser.user_id, receiver.user_id)
        localStorage.setItem('chat_with_id', receiver.user_id);
        localStorage.setItem('chat_with_user', JSON.stringify(receiver));
        getUsers();
        getMessages(threadID);

    }

    const getMessages = async (threadID) => {
        const refOfMessages = collection(db, "messages", threadID, "messages");
        const q = query(refOfMessages, orderBy("created_at"));
        onSnapshot(q, (doc) => {
            let tempMsgArray = [];
            setChatMessages(tempMsgArray);
            // console.log('doc:', doc.orderby('created_at'));
            if(doc.empty==false){
                doc.docs.forEach(element => {
                    tempMsgArray.push(element.data());
                });
            }
            setChatMessages(tempMsgArray);
            setTimeout(() => {
                let objDiv = document.getElementById("chatbox");
                objDiv.scrollTop = objDiv.scrollHeight+10;
            }, 500);
        });
    }

    const sendMessage = async () => {
        console.log('user_typed_msg', user_typed_msg);
        if(user_typed_msg!=''){
            let threadID = getThreadId(ObjUser.user_id, ChatWithUser.user_id);
            
            try {
                const frankDocRef = collection(db, "messages", threadID, "messages");
                await addDoc(frankDocRef, {
                    sender_id: ObjUser.user_id,
                    receiver_id: ChatWithUser.user_id,
                    msg_type: 'text',
                    message: user_typed_msg,
                    media_url: '',
                    is_read: 0,
                    created_at: new Date().getTime()
                });
                

                // Update last message;
                // console.log('user_typed_msguser_typed_msg', user_typed_msg);
                // const updateLastMessage = doc(db, "users", ""+ChatWithUser.email);
                // await updateDoc(updateLastMessage, {
                // "last_msg": user_typed_msg,
                // });

                // const updateLastMessageForSender = doc(db, "users", ""+ObjUser.email);
                // await updateDoc(updateLastMessageForSender, {
                // "last_msg": user_typed_msg,
                // });

                set_user_typed_msg('');
                
            } catch (error) {
                console.error('Error in send message : ', error);
            }
            let objDiv = document.getElementById("chatbox");
            objDiv.scrollTop = objDiv.scrollHeight;
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
                    return <UserListItem openChat={openChatSession} key={index} name={val.name} obj={val}/>
                })}
            </div>

            {/* Chat window */}
            <div className="w-9/12 rounded-t-lg h-400 float-left flex-1">
                {/* Header */}
                <div className="min-h-35 w-full bg-teal-800 py-3 px-3 rounded-tr-lg text-white row">
                    <div className='mt-2 bg-red-500 px-3 rounded-md float-right' onClick={()=>router.push('/logout')}>Logout</div>
                    <div className='flex gap-2'>
                        <span className='float-left mt-2'><BiArrowBack size="1.5em" /></span>
                        <img className='w-10 h-10 rounded-full float-left' src="https://cdn.pixabay.com/photo/2018/08/28/12/41/avatar-3637425_640.png" />
                        <span className='float-left mt-2 ml-4 text-lg'>{(ChatWithUser) ? ChatWithUser.name : 'User'} Chat</span>
                    </div>
                </div>
                {/* Chat windows */}
                <div className="w-full px-5 h-96 flex flex-col justify-between">
                    <div className="flex flex-col mt-5 overflow-y-scroll" id="chatbox">
                        {
                            chatMessages.length>0 && chatMessages.map((val, index) => {
                                {
                                    return (val.sender_id == ObjUser.user_id) ? 
                                    <div key={index} className="flex justify-end mb-4">
                                        <div>
                                            <div className="mr-2 py-3 px-4 bg-blue-400 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white">
                                                {val.message}
                                            </div>
                                        </div>
                                        <img src="https://source.unsplash.com/vpOeXr5wmR4/600x600" className="object-cover h-8 w-8 rounded-full" />
                                    </div> : 
                                    <div key={index} className="flex justify-start mb-4">
                                        <img src="https://source.unsplash.com/vpOeXr5wmR4/600x600" className="object-cover h-8 w-8 rounded-full" />
                                        <div className="ml-2 py-3 px-4 bg-gray-400 rounded-br-3xl rounded-tr-3xl rounded-tl-xl text-white">
                                            {val.message}
                                        </div>
                                    </div>
                                }
                            })
                        }
                    </div>
                    <div className="py-5">
                    {/* <input
                        value={user_typed_msg} onChange={(e) => set_user_typed_msg(e.target.value)}
                        className="w-full bg-gray-300 py-5 px-3 rounded-xl"
                        type="text"
                        placeholder="type your message here..."
                    />
                    <button className='w-25 h-25 bg-teal-950 p-3 rounded-full ml-5' onClick={()=>sendMessage()}><BiSend size="1.5em" /></button> */}
                    </div>
                </div>
                {/* Footer */}
                <div className='w-full min-h-60 bg-teal-800 p-3'>
                    <span className='float-left mt-4'><BiSolidPlusCircle size="1.5em" /></span>
                    <input type="text" value={user_typed_msg} onChange={(e) => set_user_typed_msg(e.target.value)} className='w-10/12 h-25 bg-teal-950 ml-5 px-3 py-3 rounded-lg' placeholder='message'/>
                    <button className='w-25 h-25 bg-teal-950 p-3 rounded-full ml-5' onClick={()=>sendMessage()}><BiSend size="1.5em" /></button>
                </div>
            </div>
        </main>
    );
}