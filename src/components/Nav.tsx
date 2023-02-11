interface INav {
    inSession: boolean
}

interface INavItem {
    name: string
}

const NavItem = ({ }: INavItem) => {
    return <></>
}

const Nav = ({ inSession }: INav) => {
    const noSessionItems = [{ name: 'Sign In' }, { name: 'About' }]
    const inSessionItems = [{ name: 'Sign Out' }, { name: 'About' }, { name: 'Settings' }]
    const items = inSession ? inSessionItems : noSessionItems
    return (
        <div>
            <ul>
                {
                    items.map((item: INavItem) => <li>{item.name}</li>)
                }
            </ul>
        </div>
    )
}

export default Nav