// import React from 'react'
// import {GoogleLogin} from '@react-oauth/google';
// import './GoogleAuth.css';

// const clientId = "1094200193389-s63qju92nqcse68cfl97eoj41k8806tv.apps.googleusercontent.com"

// const GoogleAuth = () => {

//     const onSuccess = (res) => {
//         console.log("LOGIN SUCCESS! Current user: ",res.profileObj)
//     }

//   return (
//     <div className='signInButton'>
//       <GoogleLogin
//           clientId={clientId}
//           buttonText="Sing up with Google"
//           onSuccess={onSuccess}
//           cookiePolicy={'single_host_origin'}
//           isSignedIn={true}
//       />
//     </div>
//   )
// }

// export default GoogleAuth

import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import './GoogleAuth.css';

const clientId = "1094200193389-s63qju92nqcse68cfl97eoj41k8806tv.apps.googleusercontent.com";

const GoogleAuth = () => {

    const onSuccess = (response) => {
        console.log("LOGIN SUCCESS! Current user: ", response);
    };

    const onFailure = (error) => {
        console.log("LOGIN FAILED! Error: ", error);
    };

    return (
        <GoogleOAuthProvider clientId={clientId}>
            <div className='signInButton'>
                <GoogleLogin
                    onSuccess={onSuccess}
                    onError={onFailure}
                />
            </div>
        </GoogleOAuthProvider>
    );
}

export default GoogleAuth;
