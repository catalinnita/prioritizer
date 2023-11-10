import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { SignOutButtonProps } from "./types"
import Router from "next/router"

export function SingOutButton({label, className}: SignOutButtonProps) {
    const supabase = useSupabaseClient()
  
    async function logout() {
        const signout = await supabase.auth.signOut()
        if (!signout.error) {
            Router.push('/login')
        }
    }
    
    return <button 
        className={className} 
        onClick={() => { 
            logout() 
        }}>Logout</button>
}