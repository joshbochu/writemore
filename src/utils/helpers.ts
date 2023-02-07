export async function onSave() {
    console.log('savin')
    if (session) {
        if (wordCount > 0) {
            const { data, error } = await supabase.rpc('upsert_posts', { p_user_id: user!.id, p_post: text, p_word_count: wordCount })
            if (!error) {
                setShowSavedEntry(true)
                setTimeout(() => {
                    setShowSavedEntry(false);
                }, 3000);
            }
        }
        setSavedPostTime(new Date(Date.now()))
    } else {
        setShowAuthContainer(true);
    }
}