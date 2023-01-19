import React from 'react';
// @ts-ignore
import logo from "./assets/image/logo.svg";


export default function TUIChatEmpty():React.ReactElement{
  return (<div className='tui-chat-default'>
    <header>Welcome to <img src={logo} alt="" /></header>
    <p className="content">
      We provide a demo for you to try out the features. You can start a one-to-one chat or group chat. Let's chat!
    </p>
    <p className="link">
      Please note that by using this demo, we will process your personal data in accordance with our Tencent Cloud
      <a href="https://www.tencentcloud.com/document/product/301/17345?lang=en&pg=" target="_blank" rel="noreferrer">Privacy Policy.</a>
    </p>
  </div> );
}
