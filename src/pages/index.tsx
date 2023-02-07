import { Auth, ThemeSupa } from '@supabase/auth-ui-react'
import { useSession, useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import Write from './write'

const Home = () => {
  const session = useSession()
  const supabase = useSupabaseClient()
  const user = useUser()
  return (
    <>
      <Write session={session} supabase={supabase} user={ser} />
    </>
  )
}

export default Home