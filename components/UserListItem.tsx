"use client"; // This is a client component 👈🏽

export default function UserListItem({name}){
    return (
        <div className='h-30 w-full bg-slate-800 flex flex-row p-3 border-t-2 border-white'>
            <div><img src="https://hindistatusnow.com/wp-content/uploads/2023/01/Smile-Whatsapp-DP-Images-9.jpg" className='w-10 h-10 rounded-full'/></div>
            <div className='h-ful p-3'><span className='ml-4 align-middle'>{name}</span></div>
        </div>
    )
}