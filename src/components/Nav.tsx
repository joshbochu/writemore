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
    return (<div>
        { }
    </div>)
}

export default Nav