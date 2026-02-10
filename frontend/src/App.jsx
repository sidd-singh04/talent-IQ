import { SignIn, SignInButton } from '@clerk/clerk-react'
import React from 'react'

const App = () => {
  return (
    <>
       <h1>Welcome to the App</h1>
       <SignInButton mode='modal'/>
    </>
  ) 
}  
export default App;