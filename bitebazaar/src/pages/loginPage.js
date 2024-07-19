import { Input, Divider } from 'antd';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, updateProfile } from 'firebase/auth';
import { auth } from './firebase-config';
import './loginPage.css'


function LoginPage() {
    const [name, setName] = useState("");
    const [signUp, setSignUp] = useState(true);
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const [curUser, setCurUser] = useState(null);
    localStorage.setItem('user', "null");
    
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            localStorage.setItem('user', JSON.stringify(user));
            setCurUser(user);
        });
        return unsubscribe;
    }, []);

    if(curUser != null)
    {
        localStorage.setItem('user', JSON.stringify(curUser));
    }


    function updateDisplayName(user, displayName) {
        updateProfile(user, {
          displayName: displayName
        })
        .then(() => {
          
        })
        .catch((error) => {
          console.error('Error updating display name:', error);
          alert(error);
        });
      }

    const signUpEmail = async () => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
            const user = userCredential.user;
            await updateDisplayName(user, name);
            localStorage.setItem('user', JSON.stringify(user));
            setCurUser(user);
        } catch(error) {
            console.error(error);
            alert(error);
        }
    }
    

    const signInEmail = async () =>
    {
        try
        {
            const user = await signInWithEmailAndPassword(auth, email, pass);
            localStorage.setItem('user', JSON.stringify(user));
            setCurUser(user);
        }
        catch(err)
        {
            console.log(err);
            alert(err);
        }
    }

    const signInGoogle = async () =>
    {
        const provider = new GoogleAuthProvider();

        signInWithPopup(auth, provider)
        .then((result) => {
            const credential = GoogleAuthProvider.credentialFromResult(result);
            localStorage.setItem('user', JSON.stringify(result.user));
            setCurUser(result.user);
        }).catch((error) => {
            console.log(error);
            alert(error);
        });
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        if(signUp)
            signUpEmail();
        else
            signInEmail();
    }

    return(
       !curUser?
                (
                    <div className='loginPageHolder'>
                        <div className='loginImage'></div>
            
                        <div className='loginInfoContainer'>
                            <div className='emailandPass'>
                                <form onSubmit={handleSubmit}>
                                    
                                    {
                                        (signUp ?
                                            (
                                                <>
                                                    <div className='name'>
                                                        <label/> Name
                                                        <Input style={{borderColor: 'black', backgroundColor: 'transparent'}} placeholder="Basic usage" onChange={(e) => setName(e.target.value)} />
                                                    </div>
                                                    <div className='email'>
                                                        <label/> Email
                                                        <Input style={{borderColor: 'black', backgroundColor: 'transparent'}} placeholder="Basic usage" onChange={(e) => setEmail(e.target.value)} />
                                                    </div>
                                                    <div className='password'>
                                                        <label/> Password
                                                        <Input style={{borderColor: 'black', backgroundColor: 'transparent'}} placeholder="Basic usage" onChange={(e) => setPass(e.target.value)}/>
                                                    </div>
                                                    <div className='submit'>
                                                        <button type='submit'>Sign Up</button>
                                                        <div className='changeAuth' onClick={() => setSignUp(false)} type='submit'>Sign In?</div>
                                                    </div>
                                                </>
                                            ) :
                                            (
                                                <>
                                                    <div className='email'>
                                                        <label/> Email
                                                        <Input style={{borderColor: 'black', backgroundColor: 'transparent'}} placeholder="Basic usage" onChange={(e) => setEmail(e.target.value)} />
                                                    </div>
                                                    <div className='password'>
                                                        <label/> Password
                                                        <Input style={{borderColor: 'black', backgroundColor: 'transparent'}} placeholder="Basic usage" onChange={(e) => setPass(e.target.value)}/>
                                                    </div>
                                                    <div className='submit'>
                                                        <button type='submit'>Sign In</button>
                                                        <div className='changeAuth' onClick={() => setSignUp(true)} type='submit'>Sign Up?</div>
                                                    </div>
                                                </>
                                            )
                                            
                                        )
            
                                    }
            
            
            
            
            
                                </form>
                            </div>
                            <div className='orText'><Divider style={{borderColor: 'black'}}>or</Divider></div>
                            <button onClick={signInGoogle}>Google</button>
                        </div>
                    </div>
                )
                :
                (
                    navigate('/home')
                )
    )
}


export default LoginPage;