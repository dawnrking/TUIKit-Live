import React from 'react';
import '@tencentcloud/chat-uikit-react/dist/cjs/index.css';
import './style.scss'
import ownerIcon from './image/owner.png';
import { useTUILiveContext, useTUIMessageContext } from '@tencentcloud/chat-uikit-react';


export function LiveMessageName():React.ReactElement  {
    const { group } = useTUILiveContext('LiveNotification');
    const { message } = useTUIMessageContext('Prefix');
    return (
      <div className={`live-custom-name ${message?.from === group?.ownerID && 'live-owner-name'}`}>
        <label htmlFor="content">{message?.nick || message?.from}</label>
        <span>:</span>
        {message?.from === group?.ownerID &&
          <img className='icon-owner' src={ownerIcon} alt="" />
        }
      </div>
    )
  }