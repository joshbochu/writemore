import { Auth, ThemeSupa } from '@supabase/auth-ui-react'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import Account from '../components/Account'
import Write from './write'

const Home = () => {
  const session = useSession()
  const supabase = useSupabaseClient()
  return (
    <>
      <Write session={session} supabase={supabase} />
    </>
  )
}

export default Home