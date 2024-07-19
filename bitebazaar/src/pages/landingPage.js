import { Link } from "react-router-dom";
import { Button } from 'antd'
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
                <Link to="/login"><Button type="primary">Login</Button></Link>
            </div>
        </div>
    )
}


export default LandingPage;