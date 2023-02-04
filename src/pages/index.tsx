import { Auth, ThemeSupa } from '@supabase/auth-ui-react'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
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