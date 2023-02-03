import { Auth, ThemeSupa } from '@supabase/auth-ui-react'
import { SupabaseClient, useSession, useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import Account from '../components/Account'
import { useState, useEffect } from 'react'


const Write = ({ session, supabase }) => {
    const user = useUser();
    const [wordCount, setWordCount] = useState(0);
    const [text, setText] = useState('');
    const [showAuthContainer, setShowAuthContainer] = useState(false);

    useEffect(() => {
        setWordCount(text.split(/\s|\n/g).reduce((acc, curr) => curr ? acc + 1 : acc, 0));
    }, [text]);

    useEffect(() => {
        if (session) {
            setShowAuthContainer(false);
        }
    }, [session]);

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
            <div className="flex flex-col space-between h-screen">
                {!(showAuthContainer && !session) && (
                    <textarea
                        placeholder="Write here..."
                        className="grow custom-scrollbar resize-none w-full outline-0 pt-16"
                        onChange={(e) => setText(e.target.value)}
                    ></textarea>
                )}
                {!session && showAuthContainer && (
                    <div id="auth-container" className="flex flex-col">
                        <div className="flex justify-center text-xl">Looks like you aren't signed up!</div>
                        <div className="flex justify-center">
                            <Auth supabaseClient={supabase} />
                        </div>
                    </div>
                )}
            </div>
            <div>
                <ul className="absolute top-0 right-0 m-4 text-xs list-none">
                    {session && (
                        <li>
                            <button onClick={() => supabase.auth.signOut()}>Sign out</button>
                        </li>
                    )}
                </ul>
                {!showAuthContainer && (
                    <button
                        className="absolute bottom-0 right-0 m-4 p-1 text-xs border-solid rounded border-2 border-indigo-600"
                        onClick={() => {
                            if (session) {
                                savePost();
                            } else {
                                setShowAuthContainer(true);
                            }
                        }}
                    >
                        Save
                    </button>
                )}
            </div>
        </div>
    );
};

export default Write