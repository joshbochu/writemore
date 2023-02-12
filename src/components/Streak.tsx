import Image from "next/image";

interface IStreak {
    timestamps: (string | null)[];
    showStreak: boolean;
    iconSize: number;
}

const Streak = ({ timestamps, showStreak, iconSize }: IStreak) => {
    return (
        <div
            className={`flex flex-row justify-between ${
                showStreak ? "" : "hidden"
            }`}
        >
            {timestamps.map((item: string | null, i: number) => (
                <Image
                    src={item === null ? "/square.svg" : "/x-square.svg"}
                    alt={item === null ? "-" : "x"}
                    height={iconSize}
                    width={iconSize}
                    key={i}
                />
            ))}
        </div>
    );
};

export default Streak;
