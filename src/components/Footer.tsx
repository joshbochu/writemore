interface IFooter {
    wordCount: number;
    session: boolean;
    showSavePost: boolean;
}

const Footer = ({ wordCount, session, showSavePost }: IFooter) => {
    return (
        <div className="flex flex-row justify-between">
            <div className="p-2 px-0 text-xs">
                {wordCount} words {session && showSavePost && `• ✓ saved`}
            </div>
            <div className="px-0 text-xs font-semibold">
                {!session && wordCount >= 1 && (
                    <div
                        className="bg-orange-100 border-orange-500 text-orange-700 p-1"
                        role="alert"
                    >
                        <p className="font-bold">Sign up to save!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Footer;
