
import { Auth, ThemeSupa } from '@supabase/auth-ui-react'
import { SupabaseClient, useSession, useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import { useState, useEffect } from 'react'
import useLocalStorage from 'use-local-storage';
import { useAutosave } from 'react-autosave';
import Image from 'next/image'

const getWordCount = (words: string) => words.split(/\s|\n/g).reduce((acc, curr) => curr ? acc + 1 : acc, 0);

const Write = ({ session, supabase, user }: any): JSX.Element => {
    const [text, setText] = useLocalStorage<string>('text', '')
    useAutosave({ data: text, onSave: onSave, interval: 5000 });

    const [showAuthContainer, setShowAuthContainer] = useState(false);
    const [showSavePost, setShowSavedPost] = useState(false);
    const [wordCount, setWordCount] = useState(0);

    const daysInMonth = new Date(Date.now()).getMonth() === 1 ? 28 : 31;
    const [postsThisMonth, setPostsThisMonth] = useState<any>(Array(daysInMonth).fill(null));


    useEffect(() => {
        setWordCount(getWordCount(text));
    }, [text]);

    useEffect(() => {
        if (session) {
            setShowAuthContainer(false);
            getPostsThisMonth()
        }
    }, [session]);


    async function onSave() {
        if (session && wordCount > 0) {
            const { _, error } = await supabase.rpc('upsert_posts', { p_user_id: user!.id, p_post: text, p_word_count: wordCount })
            if (!error) {
                setShowSavedPost(true)
                setTimeout(() => {
                    setShowSavedPost(false);
                }, 3000);
            }
        }
    }

    async function getPostsThisMonth() {
        if (session) {
            const { data, error } = await supabase.rpc('get_posts_inserted_this_month')
            if (!error) {
                const timestamps = Array.from(data, (x: { inserted_at_column: string }) => x.inserted_at_column);
                const streaks = [];
                const daysInMonth = new Date(Date.now()).getMonth() === 1 ? 28 : 31;
                for (let i = 1; i <= daysInMonth; i++) {
                    const dayTimestamp = timestamps.find(ts => new Date(ts).getDate() === i);
                    streaks.push(dayTimestamp || null);
                }
                setPostsThisMonth(streaks);
            }
        }
    }


    const streakIconSize = 18;


    return (
        <div className="grid grid-cols-7">
            <div className="col-start-3 col-span-3 flex flex-col space-between h-screen space-y-8 pt-8">
                <div className="flex flex-row justify-between">
                    {
                        postsThisMonth.map((p: string | null, i: number) =>
                            p === null ?
                                <Image className={`${session ? '' : 'hidden'}`} key={i} src="/square.svg" height={streakIconSize} width={streakIconSize} alt="-" /> :
                                <Image className={`${session ? '' : 'hidden'}`} key={i} src="/x-square.svg" height={streakIconSize} width={streakIconSize} alt="x" />)
                    }
                </div>
                {!(!session && showAuthContainer) && (
                    <textarea
                        placeholder='Write here...'
                        className={`bg-transparent grow custom-scrollbar resize-none w-full outline-0`}
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
                        <div className="p-2 px-0 text-xs">{wordCount} words {session && showSavePost && `• ✓ saved`}</div>
                        <div className="px-0 text-xs font-semibold">
                            {!session && wordCount >= 1 && (
                                <div className="bg-orange-100 border-orange-500 text-orange-700 p-1" role="alert">
                                    <p className="font-bold">Sign up to save!</p>
                                </div>
                            )}
                        </div>
                    </div>)
                }
            </div >
            <div className={`${session ? 'pt-20' : 'pt-16'}`}>
                <ul className="list-none space-y-2">
                    {(!session && !showAuthContainer) && (
                        <li>
                            <button
                                className="mx-8 px-1 text-xs border-solid border-2 border-black"
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
                </ul>
            </div>
        </div >
    );
};

export default Write
