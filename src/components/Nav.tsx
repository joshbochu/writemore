interface INav {
    items: INavItem[];
}

interface INavItem {
    name: string;
    onClick: () => void;
}

const NavItem = ({ name, onClick }: INavItem) => {
    return (
        <li>
            <button
                className="mx-8 px-1 text-xs border-solid border-2 border-black"
                onClick={onClick}
            >
                {name}
            </button>
        </li>
    );
};

const Nav = ({ items }: INav) => {
    return (
        <div>
            <ul>
                {items.map((item: INavItem, i: number) => (
                    <NavItem key={i} name={item.name} onClick={item.onClick} />
                ))}
            </ul>
        </div>
    );
};

export default Nav;
