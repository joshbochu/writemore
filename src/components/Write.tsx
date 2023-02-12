/* eslint-disable react-hooks/exhaustive-deps */
import { Auth, ThemeSupa } from "@supabase/auth-ui-react";
import {
    SupabaseClient,
    useSession,
    useSupabaseClient,
    useUser,
} from "@supabase/auth-helpers-react";
import { useState, useEffect } from "react";
import useLocalStorage from "use-local-storage";
import { useAutosave } from "react-autosave";
import Image from "next/image";
import Streak from "./Streak";
import Nav from "./Nav";

const getWordCount = (words: string) =>
    words.split(/\s|\n/g).reduce((acc, curr) => (curr ? acc + 1 : acc), 0);

const Write = ({ session, supabase, user }: any): JSX.Element => {
    const [text, setText] = useLocalStorage<string>("text", "");
    useAutosave({ data: text, onSave: onSave, interval: 5000 });

    const [showAuthContainer, setShowAuthContainer] = useState(false);
    const [showSavePost, setShowSavedPost] = useState(false);
    const [wordCount, setWordCount] = useState(0);

    const daysInMonth = new Date(Date.now()).getMonth() === 1 ? 28 : 31;
    const [postsThisMonth, setPostsThisMonth] = useState<any>(
        Array(daysInMonth).fill(null)
    );

    useEffect(() => {
        setWordCount(getWordCount(text));
    }, [text]);

    useEffect(() => {
        if (session) {
            setShowAuthContainer(false);
            getPostsThisMonth();
        }
    }, [session]);

    async function onSave() {
        if (session && wordCount > 0) {
            const { _, error } = await supabase.rpc("upsert_posts", {
                p_user_id: user!.id,
                p_post: text,
                p_word_count: wordCount,
            });
            if (!error) {
                setShowSavedPost(true);
                setTimeout(() => {
                    setShowSavedPost(false);
                }, 3000);
            }
        }
    }

    async function getPostsThisMonth() {
        const { data, error } = await supabase.rpc(
            "get_posts_inserted_this_month"
        );
        if (!error) {
            const ts = Array.from(
                data,
                (x: { inserted_at_column: string }) => x.inserted_at_column
            );
            const streaks = [];
            for (let i = 1; i <= daysInMonth; i++) {
                const dayTimestamp = ts.find(
                    (t) => new Date(t).getDate() === i
                );
                streaks.push(dayTimestamp || null);
            }
            setPostsThisMonth(streaks);
        }
    }

    const noSessionItems = [
        { name: "Sign In", onClick: () => setShowAuthContainer(true) },
        // { name: "About", onClick: () => null },
    ];
    const inSessionItems = [
        { name: "Sign Out", onClick: () => supabase.auth.signOut() },
        { name: "About", onClick: () => null },
        { name: "Settings", onClick: () => null },
    ];

    const items = session ? inSessionItems : noSessionItems;

    return (
        <div className="grid grid-cols-7">
            <div className="col-start-3 col-span-3 flex flex-col space-between h-screen space-y-8 pt-8">
                <Streak
                    timestamps={postsThisMonth}
                    showStreak={session ? true : false}
                    iconSize={18}
                />
                {!(!session && showAuthContainer) && (
                    <textarea
                        placeholder="Write here..."
                        className={`bg-transparent grow custom-scrollbar resize-none w-full outline-0`}
                        onChange={(e) => setText(e.target.value)}
                        value={text}
                    ></textarea>
                )}
                {!session && showAuthContainer && (
                    <div id="auth-container" className="flex flex-col">
                        <div className="flex justify-center">
                            <Auth supabaseClient={supabase} view="sign_up" />
                        </div>
                    </div>
                )}
                {!showAuthContainer && (
                    <div className="flex flex-row justify-between">
                        <div className="p-2 px-0 text-xs">
                            {wordCount} words{" "}
                            {session && showSavePost && `• ✓ saved`}
                        </div>
                        <div className="px-0 text-xs font-semibold">
                            {!session && wordCount >= 1 && (
                                <div
                                    className="bg-orange-100 border-orange-500 text-orange-700 p-1"
                                    role="alert"
                                >
                                    <p className="font-bold">
                                        Sign up to save!
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
            <div className={`${session ? "pt-20" : "pt-16"}`}>
                {!session && !showAuthContainer && <Nav items={items} />}
                {session && <Nav items={items} />}
            </div>
        </div>
    );
};

export default Write;
