import { Button } from "bootstrap"
import { useHistory } from "react-router-dom";
const NotFound =()=>{
    let history = useHistory();
    return(
        <div className="notFound"  style="backgroundColor: #145259;color:white;font-size:4vw;">
            Oops! <br></br>
            This page does not exist.
            <Button type="button" onClick={history.push("/")}>Login</Button>
            <Button type="button" onClick={history.goBack}>Go back to website</Button>
        </div> 
    );
}
export default NotFound;