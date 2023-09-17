import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import MainPage from './MainPage'


function App() {
  const [session, setSession] = useState(null)

    useEffect(() => {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session)
      })

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session)
      })


      return () => subscription.unsubscribe()
    }, [])

    return (
      <div className="App">
      <header className="App-header">
        <h1>TravelMatcher.</h1>
      </header>
          {!session ? (<Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />) : <MainPage session={session}/>}
    </div>
      
    )
}

export default App;
