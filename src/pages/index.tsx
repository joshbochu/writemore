import { Auth, ThemeSupa } from '@supabase/auth-ui-react'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import Account from '../components/Account'
import Write from './write'

const Home = () => {
  const session = useSession()
  const supabase = useSupabaseClient()
  return (
    <>
      {!session ? (
        <div className={`flex justify-center h-screen`}>
          <Auth supabaseClient={supabase} />
        </div>
      ) : (
        <Write />
      )}
    </>
  )
}

export default Home