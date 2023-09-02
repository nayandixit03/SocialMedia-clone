import React, { useEffect, useRef, useState } from 'react'
import './Chat.css'
import Noti from '../../img/noti.png'
import LogoSearch from '../../components/LogoSearch/LogoSearch'
import {useSelector,useDispatch} from 'react-redux'
import { userChats } from '../../api/ChatRequests'
import Conversation from '../../components/Conversation/Conversation'
import {UilSetting} from '@iconscout/react-unicons'
import Home from '../../img/home.png'
import { Link } from 'react-router-dom'
import Comment from '../../img/comment.png'
import ChatBox from '../../components/ChatBox/ChatBox'
import {io} from 'socket.io-client';
const Chat = () => {

    const {user}=useSelector((state)=>state.authReducer.authData);
   
    const [chats,setChats]=useState([])
    const [currentChat,setCurrentChat]=useState(null)
    const socket=useRef();
    const [onlineUsers,setOnlineUsers]=useState([])
    const [sendMessage,setSendMessage]=useState(null)
    const [receiveMessage,setReceiveMessage]=useState(null)

    
    useEffect(()=>{
        socket.current=io('http://localhost:8800');
        socket.current.emit("new-user-add",user._id)
        socket.current.on('get-users',(users)=>{
            setOnlineUsers(users);
           // console.log(onlineUsers)
           
    
        });
    },[user]);
  //send message to socket server
    useEffect(()=>{
        if(sendMessage!==null){
          socket.current.emit('send-message',sendMessage)
        }
    },[sendMessage])

    //receive message from socket server
    useEffect(()=>{
      socket.current.on("receive-message",(data)=>{
        setReceiveMessage(data)
      })
    },[])

    useEffect(()=>{
        const getChats=async()=>{
            try {
               const {data}=await userChats(user._id) 
               setChats(data);
               console.log(data)
            } catch (error) {
                 console.log(error)
            }
        };
        getChats();
    },[user])

    const checkOnlineStatus=(chat)=>{
      const chatMember=chat.members.find((member)=>member !=user._id)
      const online=onlineUsers.find((user)=>user.userId ===chatMember)
      return online ? true:false
    }

  return (
    <div className='Chat'>
        {/* left side */}
        <div className='Left-side-chat'>
         <LogoSearch/>
          <div className='Chat-container'>
          <h2>Chats</h2>
            <div className='Chat-list'>
              {chats.map((chat)=>(
                <div onClick={()=>setCurrentChat(chat)}>
                    <Conversation data={chat} currentUserId={user._id} online={checkOnlineStatus(chat)}/>
                </div>
              ))}
            </div>
          </div>
           
        </div>

        {/* right side */}
        <div className='Right-side-chat'>
            <div style={{width:'20rem',alignSelf:'flex-end'}}>
              <div className='navIcons'>
              <Link to='../home'> <img src={Home} alt='' /></Link>   
              <UilSetting />
              <img src={Noti} alt='' />
              <Link to="../chat">
              <img src={Comment} alt='' />
               </Link>
             </div>
                
               
            </div>
           {/* chatbody */}
           <ChatBox chat={currentChat} currentUser={user._id} setSendMessage={setSendMessage} receiveMessage={receiveMessage}/> 

        </div>
    </div>
  )
}

export default Chat