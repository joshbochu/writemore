import Image from "next/image"

interface IStreak {
    timestamps: (string | null)[],
    showStreak: boolean,
    iconSize: number
}

const Streak = ({ timestamps, showStreak, iconSize }: IStreak) => {
    return (
        <div className={`flex flex-row justify-between ${showStreak ? '' : 'hidden'}`}>
            {
                timestamps.map(
                    (item: string | null, i: number) => {
                        const icon = item === null ? '/square.svg' : '/x-square.svg'
                        const alt = item === null ? '-' : 'x'
                        return <Image key={i} src={icon} height={iconSize} width={iconSize} alt={alt} />
                    }
                )
            }
        </div>
    )
}

export default Streak