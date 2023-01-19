import React, { useEffect, useState } from 'react';
import TIM, { ChatSDK } from 'tim-js-sdk/tim-js-friendship';
import TIMUploadPlugin from 'tim-upload-plugin';
import './style.scss'

import { genTestUserSig } from '../debug/GenerateTestUserSig'

import live from "./assets/image/live.png";
import lived from "./assets/image/lived.png";
import social from "./assets/image/social.png";
import socialed from "./assets/image/socialed.png";
import LiveDemo from '../live-demo/live-demo';
import SocialDemo from '../social-demo';

const menuList = [
  {
    id: 1,
    name: 'Social Messenger',
    icon: social,
    selectedIcon: socialed,
  },
  {
    id: 2,
    name: 'Live Streaming',
    icon: live,
    selectedIcon: lived,
  }
]

const init = async ():Promise<ChatSDK> => {
  return new Promise((resolve, reject) => {
    const tim = TIM.create({ SDKAppID: genTestUserSig('****').sdkAppID });
    tim?.registerPlugin({ 'tim-upload-plugin': TIMUploadPlugin });
    const onReady = () => { resolve(tim); };
    tim.on(TIM.EVENT.SDK_READY, onReady);
    tim.login({
      userID: '****',
      userSig: genTestUserSig('****').userSig,
    });
  });
}

export default function SampleChat() {
  const [tim, setTim] = useState<ChatSDK>();
  const [currentMenu, setCurrentMenu] = useState(1);
  useEffect(() => {
    (async ()=>{
      const tim = await init()
      setTim(tim)
    })()
  }, [])
  
  const handleSelect = (item:any) => {
    setCurrentMenu(item.id);
  };
  return (
    <div className="chat-demo">
    <ul className="chat-header">
      {
        menuList.map((item)=>(
          <li
            key={item.name}
            className={`menu-default ${item.id === currentMenu ? 'menu-select' : 'menu-unselect'}`}
            onClick={()=>{handleSelect(item)}}>
            <img className='menu-icon' src={item.id === currentMenu ? item?.selectedIcon : item?.icon} alt="" />
            <span>{item?.name}</span>
          </li>
        ))
      }
    </ul>
    <div className="chat-main">
      {
        currentMenu === 1 ? <SocialDemo tim={tim} /> : <LiveDemo tim={tim} /> 
      }
    </div>
  </div>
  );
}
