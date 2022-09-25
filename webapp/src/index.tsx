import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const publicUrl = process.env.PUBLIC_URL;

let basename = "";
if (publicUrl.includes("http")) {
  basename = publicUrl.split("//")[1].split("/")[1];
} else {
  basename = publicUrl;
}

root.render(
  <div>
    <link
      rel="stylesheet"  
      href={`${publicUrl}/css/bootstrap.min.css`}
    />
    <link
      rel="stylesheet"  
      href={`${publicUrl}/css/design.css`}
    />
    <div>
      {/* 
      if not running on localhost, do this: 
      public_url = https://badertim.github.io/education-platform-for-quantum-cryptography/
      to
      /education-platform-for-quantum-cryptography

      this is required for routing on GH pages since the root path is not /
      */}
      <BrowserRouter basename={basename}>
        <App />
      </BrowserRouter>
    </div>
  </div>
);


