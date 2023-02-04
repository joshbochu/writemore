import { Auth, ThemeSupa } from '@supabase/auth-ui-react'
import { SupabaseClient, useSession, useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import { useState, useEffect } from 'react'


const Write = ({ session, supabase }: any): JSX.Element => {
    const user = useUser();
    const [savedPost, setSavedPost] = useState(new Date())
    const [wordCount, setWordCount] = useState(0);
    const [text, setText] = useState('');
    const [showAuthContainer, setShowAuthContainer] = useState(false);

    useEffect(() => {
        setWordCount(text.split(/\s|\n/g).reduce((acc, curr) => curr ? acc + 1 : acc, 0));
    }, [text]);

    useEffect(() => {
        if (session) {
            setShowAuthContainer(false);
            savePost()
            setSavedPost(new Date(Date.now()))
        }
    }, [session]);

    const getLastSavedTime = () => savedPost.toLocaleString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    })

    async function savePost() {
        if (wordCount > 0) {
            const { data, error } = await supabase.rpc('upsert_posts', { p_user_id: user!.id, p_post: text, p_word_count: wordCount })
            console.log(data, error)
        }
    }

    return (
        <div className="grid grid-cols-3">
            <div></div>
            <div className="flex flex-col space-between h-screen">
                {!(!session && showAuthContainer) && (
                    <textarea
                        placeholder="Write here..."
                        className="grow custom-scrollbar resize-none w-full outline-0 pt-16"
                        onChange={(e) => setText(e.target.value)}
                    ></textarea>
                )}
                {!session && showAuthContainer && (
                    <div id="auth-container" className="flex flex-col">
                        {/* <div className="flex justify-center text-xl">Looks like you aren't signed up!</div> */}
                        <div className="flex justify-center">
                            <Auth supabaseClient={supabase} />
                        </div>
                    </div>
                )}
            </div>
            <div>
                {(!session && !showAuthContainer) && (
                    <ul className="absolute top-0 right-0 m-4 text-xs list-none">
                        <li>
                            <button onClick={() => setShowAuthContainer(true)}>Sign In</button>
                        </li>
                    </ul>)}
                {session && (
                    <ul className="absolute top-0 right-0 m-4 text-xs list-none">
                        <li>
                            <button onClick={() => supabase.auth.signOut()}>Sign out</button>
                        </li>
                        <li>{getLastSavedTime()}</li>
                    </ul>
                )}
                {!showAuthContainer && (
                    <button
                        className="absolute bottom-0 right-0 m-4 p-1 text-xs border-solid rounded border-2 border-indigo-600"
                        onClick={() => {
                            if (session) {
                                savePost();
                                setSavedPost(new Date(Date.now()))
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