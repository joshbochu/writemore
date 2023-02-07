import { Auth, ThemeSupa } from '@supabase/auth-ui-react'
import { SupabaseClient, useSession, useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import { useState, useEffect } from 'react'
import useLocalStorage from 'use-local-storage';
import { useAutosave } from 'react-autosave';

const getWordCount = (words: string) => words.split(/\s|\n/g).reduce((acc, curr) => curr ? acc + 1 : acc, 0);

const getSavedAtTime = (time: Date) => time.toLocaleString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
})

// const getStreak = async () => {
//     let sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).setHours(0, 0, 0, 0,)
//     const { data, error } = await supabase
//         .from('posts')
//         .select('inserted_at')
//         .gt('inserted_at', sevenDaysAgo)
//     console.log(data)
// }


const Write = ({ session, supabase, user }: any): JSX.Element => {
    const [text, setText] = useLocalStorage<string>('text', '')
    useAutosave({ data: text, onSave: onSave, interval: 5000 });

    const [showAuthContainer, setShowAuthContainer] = useState(false);
    const [showSavedEntry, setShowSavedEntry] = useState(false);
    const [savedPostTime, setSavedPostTime] = useState(new Date())
    const [wordCount, setWordCount] = useState(0);

    useEffect(() => {
        setWordCount(getWordCount(text));
    }, [text]);

    useEffect(() => {
        if (session) {
            setShowAuthContainer(false);
            onSave()
        }
    }, [session]);

    async function onSave() {
        if (session && wordCount > 0) {
            const { _, error } = await supabase.rpc('upsert_posts', { p_user_id: user!.id, p_post: text, p_word_count: wordCount })
            if (!error) {
                setSavedPostTime(new Date(Date.now()))
                setShowSavedEntry(true)
                setTimeout(() => {
                    setShowSavedEntry(false);
                }, 3000);
            }
        }
    }

    // const streakCount = 0;
    // const streakIconSize = 20;


    return (
        <div className="grid grid-cols-7">
            <div className="col-start-3 col-span-3 flex flex-col space-between h-screen pt-8">
                {/* <div className="flex flex-row justify-between">
                    {
                        Array.from(new Array(30), (x, i) => {
                            return i < 12 ?
                                (<Image src="/x-square.svg" height={streakIconSize} width={streakIconSize} alt="x" />) :
                                (<Image src="/square.svg" height={streakIconSize} width={streakIconSize} alt="x" />)
                        })
                    }
                </div> */}
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
                        {/* <div className="p-2 px-0 text-xs">{wordCount} words{streakCount > 0 && ` | 🔥 ${streakCount}`}</div> */}
                        <div className="p-2 px-0 text-xs">{wordCount} words {session && showSavedEntry && `• ✓ saved`}</div>
                        <div className="px-0 text-xs font-semibold">
                            {!session && wordCount >= 1 && (
                                <div className="bg-orange-100 border-orange-500 text-orange-700 p-1" role="alert">
                                    <p className="font-bold">Sign up to save!</p>
                                </div>
                            )}
                        </div>
                    </div>)}
            </div>
            <div className='pt-8'>
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