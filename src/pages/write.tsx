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
            onSave()
        }
    }, [session]);

    const getLastSavedTime = () => savedPost.toLocaleString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    })

    const getStreak = async () => {
        let sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).setHours(0, 0, 0, 0,)
        const { data, error } = await supabase
            .from('posts')
            .select('inserted_at')
            .gt('inserted_at', sevenDaysAgo)
        console.log(data)
    }


    const onSave = async () => {
        if (session) {
            if (wordCount > 0) {
                const { data, error } = await supabase.rpc('upsert_posts', { p_user_id: user!.id, p_post: text, p_word_count: wordCount })
                console.log(data, error)
            }
            setSavedPost(new Date(Date.now()))
        } else {
            setShowAuthContainer(true);
        }
    }

    return (
        <div className="grid grid-cols-3">
            <div></div>
            <div className="flex flex-col space-between h-screen pt-16">
                {!(!session && showAuthContainer) && (
                    <textarea
                        placeholder='Write here...'
                        className="bg-transparent grow custom-scrollbar resize-none w-full outline-0"
                        onChange={(e) => setText(e.target.value)}
                        value={text}
                    ></textarea>
                )}
                {!session && showAuthContainer && (
                    <div id="auth-container" className="flex flex-col">
                        <div className="flex justify-center">
                            <Auth supabaseClient={supabase} view='sign_up' />
                        </div>
                    </div>
                )}
                {!showAuthContainer && (
                    <div className="flex flex-row justify-between">
                        <div className="p-2 px-0 text-xs">{wordCount} words</div>
                        <div className="px-0 text-xs font-semibold">
                            {!session && wordCount >= 1 && (
                                <div className="bg-orange-100 border-orange-500 text-orange-700 p-1" role="alert">
                                    <p className="font-bold">Sign up to save!</p>
                                </div>
                            )}
                        </div>
                    </div>)}

            </div>
            <div className='pt-16'>
                <ul className="list-none space-y-2">
                    {!showAuthContainer && (
                        <></>
                        // <li className='flex flex-row'>
                        //     <button onClick={onSave}
                        //         className="mx-4 px-1 text-xs border-solid border-2 border-black">
                        //         Save
                        //     </button>
                        // </li>
                    )}
                    {(!session && !showAuthContainer) && (
                        <li>
                            <button
                                className="mx-4 px-1 text-xs border-solid border-2 border-black"
                                onClick={() => setShowAuthContainer(true)}>Sign Up</button>
                        </li>
                    )}
                    {session && (
                        <>
                            <li>
                                <button
                                    className="mx-4 px-1 text-xs border-solid border-2 border-black"
                                    onClick={() => supabase.auth.signOut()}>Sign Out</button>
                            </li>
                        </>
                    )}
                    {/* {!showAuthContainer && (
                        <li>
                            <button
                                className="mx-4 px-1 text-xs border-solid border-2 border-black"
                                onClick={() => null}>
                                About
                            </button>
                        </li>
                    )} */}
                </ul>
            </div>
        </div >
    );
};

export default Write