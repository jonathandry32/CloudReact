import '../assets/css/message.css';
import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useParams,useNavigate } from 'react-router-dom';

export default function Message() {
    let navigate = useNavigate();
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    const userId = JSON.parse(user);
    const [message, setMessage] = useState("");
    const [userMessages,setUserMessage]=useState([]);
    const [userMessagesall,setUserMessageAll]=useState([]);
    const [messages,setMessages]=useState([]);
    const [userMes,setUser]=useState([]);
    const { id } = useParams();
    
    useEffect(() => {
        loadUserMessage();
    }, []);
    
    const handleSendMessage = async () => {
        try {
            const params = new URLSearchParams();
            params.append("messages", message);
            const result=await axios.post(`https://ombaikamitadyws-production-1616.up.railway.app/message/${userId.id}/${id}`, params, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            window.location.reload();
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const loadUser =async ()=>{
        try{
            const result=await axios.get("https://ombaikamitadyws-production-1616.up.railway.app/users/"+id, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setUser(result.data);
        }
        catch(error){
            navigate("/login");
        }
    }

    const loadUserMessage =async ()=>{
        try{
            const result=await axios.get("https://ombaikamitadyws-production-1616.up.railway.app/users?me="+userId.id, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log(result.data);
            setUserMessageAll(result.data);
            setUserMessage(result.data);
        }
        catch(error){
            navigate("/login");
        }
    }
    
    const loadMessages = async () => {
        try {
            const response = await axios.get("https://ombaikamitadyws-production-1616.up.railway.app/messages?me="+userId.id+"&other="+id, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setMessages(response.data);
        } catch (error) {
            console.error('Error fetching details:', error);
        }
    };

    const changeChat = (id) => {
        navigate(`/message/${id}`);
    };

    useEffect(() => {
        loadMessages();
        loadUser();
    }, [id]);

    const months = [
        "Jan", "Feb", "Mar", "Apr", "Mai", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const [search, setSearch] = useState("");
    const filterUserMessage = () => {
        let filtered = userMessagesall.filter(userM => {
            return (
                (search === "" || userM.nom.toLowerCase().includes(search.toLowerCase()))
            );
        });
        setUserMessage(filtered);
    };

    useEffect(() => {
        filterUserMessage();
    }, [search]);

    return (
        <>
            <body>
            <div class="container clearfix">
    <div class="people-list" id="people-list">
      <div class="search">
        <input type="text" placeholder="search"
        value={search}
        onChange={e => setSearch(e.target.value)}
        />
        <i class="fa fa-search"></i>
      </div>
      <ul class="list">
            {
                userMessages.map((m)=>(
                <li class="clearfix">
                    <button
                    style={{border:"none",width:"100%"}}
                     onClick={() => changeChat(m.id)}
                    >
                    {m.photoProfil && m.photoProfil.includes("https:") ? (
                        <img className="imgpic" src={m.photoProfil} alt="PDP" />
                        ) : (
                        <img className="imgpic" src="https://i.pinimg.com/736x/f1/0f/f7/f10ff70a7155e5ab666bcdd1b45b726d.jpg" alt="PDP" />
                    )}
                    <div class="about">
                    <div class="name">{m.nom}</div>
                    <div class="status">
                        {m.email}
                    </div>
                    </div>
                    </button>
                </li>
                ))
             }
      </ul>
    </div>
    
    <div class="chat">
      <div class="chat-header clearfix">
        
      {userMes.photoProfil && userMes.photoProfil.includes("https:") ? (
                        <img className="imgpic" src={userMes.photoProfil} alt="PDP" />
                        ) : (
                        <img className="imgpic" src="https://i.pinimg.com/736x/f1/0f/f7/f10ff70a7155e5ab666bcdd1b45b726d.jpg" alt="PDP" />
                    )}    
        <div class="chat-about">
          <div class="chat-with">{userMes.nom}</div>
          <div class="chat-num-messages">Messages</div>
        </div>
        <i class="fa fa-star"></i>
      </div> 
      
      <div class="chat-history">
        <ul>

        {
                messages.map((um)=>(
                    um.sender.id === userId.id ? (
                           
                        <li class="clearfix">
                        <div class="message-data align-right">
                            <span class="message-data-time" >{um.date[2]} {months[um.date[1]-1]} {um.date[0]} {um.date[3]}:{um.date[4]}</span> &nbsp; &nbsp;
                            <span class="message-data-name" >{um.sender.nom}</span> <i class="fa fa-circle me"></i>
                            
                        </div>
                        <div class="message other-message float-right">
                            {um.message}
                        </div>
                        </li>
                        ):(
                            <li key={um.id}>
                             <div class="message-data">
                                 <span class="message-data-name"><i class="fa fa-circle online"></i>{um.sender.nom}</span>
                                 <span class="message-data-time">{um.date[2]} {months[um.date[1]-1]} {um.date[0]} {um.date[3]}:{um.date[4]}</span>
                             </div>
                             <div class="message my-message">
                                     {um.message}
                             </div>
                             </li>
                        )
                    )
                )
        }
          
        </ul>
        
      </div>
      
      <div className="chat-message clearfix">
            <textarea
                name="message-to-send"
                id="message-to-send"
                placeholder="Type your message"
                rows="3"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            ></textarea>
            <button onClick={handleSendMessage}>Send</button>
        </div>
    </div> 
    
  </div> 

            </body>
        </>
    );
}
