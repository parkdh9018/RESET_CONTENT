import Teachable from "components/teachable/Teachable";
import { Link, Outlet } from "react-router-dom";

const MainSimple = () => {
    return (<>
        <div>
            <h1>MainPage</h1>
            <Link to="rooms">rooms</Link>
            <Outlet>
                
            </Outlet>
            {/* <Teachable myurl="/heart_model/" /> */}
        </div>
    </>)
}

export default MainSimple;