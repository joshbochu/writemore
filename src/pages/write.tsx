import { Auth, ThemeSupa } from '@supabase/auth-ui-react'
import { SupabaseClient, useSession, useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import Account from '../components/Account'
import { useState, useEffect } from 'react'



const Write = ({ session }) => {
    const user = useUser()
    const supabase = useSupabaseClient()
    const [wordCount, setWordCount] = useState(0);
    const [text, setText] = useState('');
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        setWordCount(text.split(/\s|\n/g).reduce((acc, curr) => curr ? acc + 1 : acc, 0));
    }, [text]);

    async function savePost() {
        if (wordCount === 0) return;
        try {
            const { data, error } = await supabase
                .from('posts')
                .insert({ post: text, user_id: user!.id, word_count: wordCount })
                .select()
            //conflict will bust
            if (error?.code === "23505") {
                const { data, error } = await supabase
                    .from('posts')
                    .update({ post: text, user_id: user!.id, word_count: wordCount })
                    .eq('user_id', user!.id)
            }
        }
        catch (err) {
            // todo
        }
    }

    return (
        <div className="grid grid-cols-3">
            <div></div>
            <div className="flex">
                <textarea
                    placeholder="Write here..."
                    className="custom-scrollbar resize-none w-full h-screen outline-0 pt-16"
                    onChange={(e: any) => setText(e.target.value)}
                >
                </textarea>
            </div >
            <div>
                <ul className="absolute top-0 right-0 m-4 text-xs list-none">
                    <li>
                        <button onClick={() => supabase.auth.signOut()}>Sign out</button>
                    </li>
                </ul>
                <button className="absolute bottom-0 right-0 m-4 p-1 text-xs border-solid rounded border-2 border-indigo-600"
                    onClick={() => {
                        savePost()
                    }}
                >Save</button>
            </div>
        </div >


    );
}

export default Write