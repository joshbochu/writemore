import { Auth, ThemeSupa } from '@supabase/auth-ui-react'
import { useSession, useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import Write from '../components/Write'
import Head from 'next/head'

const Home = () => {
  const session = useSession()
  const supabase = useSupabaseClient()
  const user = useUser()
  return (
    <>
      <Head>
        <title>WriteMore</title>
      </Head>
      <Write session={session} supabase={supabase} user={user} />
    </>
  )
}

export default Home