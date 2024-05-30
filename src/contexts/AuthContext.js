import React, { useContext, useEffect, useState } from 'react'
import { auth } from '../firebase'
import { onAuthStateChanged } from 'firebase/auth'


const AuthContext = React.createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider( {children} ) {
    const [currentUser, setCurrentUser] = useState(null);
    const [userLoggedIn, setUserLoggedIn] = useState(false);


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, intializeUser);
        return unsubscribe;
    }, [])
   
    async function intializeUser(user) {
        if (user) {
            setCurrentUser( {...user});
            setUserLoggedIn(true);
        }else {
            setCurrentUser(null);
            setUserLoggedIn(false);
        }
    }

    const value = {
        currentUser, 
        userLoggedIn
    }

  return (
    <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>
  )
}
