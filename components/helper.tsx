// Function for get thread id based on two user id.

const getThreadId = (userId = 0, receiverId = 0) => {
    if(userId > receiverId){
        return userId+'-'+receiverId;
    }else{
        return receiverId+'-'+userId;
    }
}

export {
    getThreadId
}