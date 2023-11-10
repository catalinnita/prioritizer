import Head from 'next/head'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { Auth, ThemeSupa } from '@supabase/auth-ui-react'
import styles from '../styles/base.module.css'
import { useSupabaseClient } from '@supabase/auth-helpers-react'

function Home({ supabase }) {
    const supabaseClient = useSupabaseClient()
    return (
    <div className={styles.loginWrapper}>
        <Head>
        <title>Prioritizer Login</title>
        <meta name="description" content="Prioritize your tasks!" />
        <link rel="icon" href="/favicon.ico" />
        </Head>
        
        <div className={styles.login}>
            <Auth
                supabaseClient={supabaseClient}
                appearance={{ theme: ThemeSupa }}
                theme="dark"
                redirectTo="http://localhost:3000"
                providers={["github", "bitbucket", "google"]}
                socialLayout="horizontal"
                magicLink
            />            
        </div>
    </div>
    )
}

export const getServerSideProps = async (ctx) => {

    // Create authenticated Supabase Client
    const supabase = createServerSupabaseClient(ctx)
    // Check if we have a session
    const {
        data: { session },
    } = await supabase.auth.getSession()

    if (session?.user) {
        return {
            redirect: {
                destination: '/dashboard',
                permanent: false,
            },
        }
    }
    console.log({supabase})
    return {
        props: {
            supabase: JSON.stringify(supabase)
        }
    }
}

export default Home