import { Box } from "lucide-react"
import { Button } from "./ui/Button"
import { useOutletContext } from "react-router"

const navbar = () => {
    const {isSignedIn,userName,signOut, signIn} =useOutletContext<AuthContext>()
    const handleAuthClick = async () => {
        if (isSignedIn){
            try {
                await signOut()
            } catch (error) {
                console.log(`Puter sign out failed: ${error}`);
            }
            return;
        }
        try {
            await signIn();
        } catch (error) {
            console.log(`Puter sign in failed: ${error}`);
        }

    }
    return (
        <header className="navbar">
            <nav className="inner">
                <div className="left">
                    <div className="brand">
                        <Box className='logo' />
                        <span className="name">Roomify</span>
                    </div>
                    <ul className="links">
                        <a href="#">Products</a>
                        <a href="#">Pricing</a>
                        <a href="#">Community</a>
                        <a href="#">Enterprise</a>
                    </ul>
                </div>
                <div className="actions">
                    {isSignedIn ? (
                        <>
                            <span className="greeting">
                                {userName ? `Hi, ${userName} !` : 'Signed In'}
                            </span>
                            <Button size="sm" variant="outline" onClick={handleAuthClick}>
                                Log Out
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button variant="ghost" onClick={handleAuthClick} size="sm" className="login">
                                Log In
                            </Button>
                            <a href="#upload" className="cta">Get started</a>
                        </>
                    )}
                </div>
            </nav>
        </header>
    )
}

export default navbar