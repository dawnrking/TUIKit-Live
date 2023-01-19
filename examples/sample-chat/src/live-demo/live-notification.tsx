import React, {  useEffect, useState } from 'react';
import '@tencentcloud/chat-uikit-react/dist/cjs/index.css';
import './style.scss'
import { Avatar, Icon, IconTypes, useTUILiveContext } from '@tencentcloud/chat-uikit-react';

const defaultUserAvatar = 'https://web.sdk.qcloud.com/component/TUIKit/assets/avatar_21.png';

export function LiveNotification():React.ReactElement  {

    const { group, ownerProfile } = useTUILiveContext('LiveNotification');
    const [isShow, setIsShow] = useState(true);

    useEffect(()=>{
      if (group?.notification && ownerProfile) {
        setIsShow(true);
      }
    }, [group?.notification, ownerProfile] )

    const handleCloseNotification = () => {
      setIsShow(false);
    };
    return (
      <>
      {isShow &&
        <div className='pin'>
          <aside className='pin-left'>
            <Avatar size={32} image={ownerProfile?.avatar || defaultUserAvatar} />
            <div className="live-owner-name">
              <h1>{ownerProfile?.nick || ownerProfile?.userID}</h1>
              <Icon type={IconTypes.OWNER} width={15} height={15} />
            </div>
          </aside>
          <p className='text'>{ group?.notification }</p>
          <i  role="button" tabIndex={0} className='icon icon-close' onClick={handleCloseNotification}></i>
        </div>
      }
      </>
    )
  }