
import { Auth, ThemeSupa } from '@supabase/auth-ui-react'
import { SupabaseClient, useSession, useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import { useState, useEffect } from 'react'
import useLocalStorage from 'use-local-storage';
import { useAutosave } from 'react-autosave';
import Image from 'next/image'

const getWordCount = (words: string) => words.split(/\s|\n/g).reduce((acc, curr) => curr ? acc + 1 : acc, 0);

const getSavedAtTime = (time: Date) => time.toLocaleString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
})

const getDaysThisMonth = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    return new Date(year, month + 1, 0).getDate();
};


// const getStreak = async () => {
//     let sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).setHours(0, 0, 0, 0,)
//     const { data, error } = await supabase
//         .from('posts')
//         .select('inserted_at')
//         .gt('inserted_at', sevenDaysAgo)
//     console.log(data)
// }


// function jsTimestampToPostgresTimestampUTC(jsTimestamp: string | number | Date) {
//     const date = new Date(jsTimestamp);
//     const offset = -date.getTimezoneOffset() / 60;
//     date.setHours(date.getHours() + offset);
//     return date.toISOString().slice(0, 19).replace('T', ' ');
// }

// function firstDayOfCurrentMonthAndNextMonth() {
//     const now = new Date();
//     const currentMonth = now.getMonth();
//     const currentYear = now.getFullYear();

//     const firstDayOfCurrentMonth = new Date(currentYear, currentMonth, 1, 0, 0, 0, 0);
//     const firstDayOfNextMonth = new Date(currentYear, currentMonth + 1, 1, 0, 0, 0, 0);

//     return [firstDayOfCurrentMonth.getTime(), firstDayOfNextMonth.getTime()];
// }


// async function getPostsThisMonth() {
//     const [curr, next] = firstDayOfCurrentMonthAndNextMonth();
//     const start = jsTimestampToPostgresTimestampUTC(curr)
//     const end = jsTimestampToPostgresTimestampUTC(next)
//     const { data, error } = await supabase
//         .from('posts')
//         .select()
//         .gte('inserted_at', start)
//         .lt('inserted_at', end)
// }

const Write = ({ session, supabase, user }: any): JSX.Element => {
    const [text, setText] = useLocalStorage<string>('text', '')
    useAutosave({ data: text, onSave: onSave, interval: 5000 });

    const [showAuthContainer, setShowAuthContainer] = useState(false);
    const [showSavePost, setShowSavedPost] = useState(false);
    const [savedPostTime, setSavedPostTime] = useState(new Date())
    const [wordCount, setWordCount] = useState(0);

    const [postsThisMonth, setPostsThisMonth] = useState<any>([]);


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
                setSavedPostTime(new Date(Date.now()))
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
    const daysThisMonth = getDaysThisMonth();


    return (
        <div className="grid grid-cols-7">
            <div className="col-start-3 col-span-3 flex flex-col space-between h-screen pt-4">
                <div className="flex flex-row justify-between">
                    {session && postsThisMonth && (
                        postsThisMonth.map((p: string | null, i: number) => p === null ?
                            (<Image key={i} src="/square.svg" height={streakIconSize} width={streakIconSize} alt="x" />) :
                            (<Image key={i} src="/x-square.svg" height={streakIconSize} width={streakIconSize} alt="x" />)))
                    }
                </div>
                {!(!session && showAuthContainer) && (
                    <textarea
                        placeholder='Write here...'
                        className={`bg-transparent grow custom-scrollbar resize-none w-full outline-0 pt-${session ? "12" : "16"}`}
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
            <div className='pt-20'>
                <ul className="list-none space-y-2">
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
                </ul>
            </div>
        </div >
    );
};

export default Write
