import { Link } from "react-router-dom";
import './landingPage.css'

function LandingPage() {
    return(
        <div className='landingPageHolder'>
            <div className='landingPageName'>
                BiteBazaar
            </div>

            <div className='backgroundImage'></div>

            <div className='landingPageTag'>
                <div className='landingPageTagLarge landingPageTagText'>
                    Share your culinary creations with the world
                </div>
                <div className='landingPageTagSmall landingPageTagText'>
                    one recipe at a time!
                </div>
            </div>

            <div className='landingPageLogin'>
                <Link to="/login"><button>Login</button></Link>
            </div>
        </div>
    )
}


export default LandingPage;