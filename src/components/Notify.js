//Author: Fenil Shah
//Created on: 21st July,2021
import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export const  Notify = async (text,isError) =>{
    if(isError)
    {
        toast.error(text,{
            position:"top-right",
            autoClose:1000,
            hideProgressBar:true,
            newestOnTop:false,
            closeOnClick:true,
            rtl:false,
            pauseOnFocusLoss:true,
            draggable : false,
            pauseOnHover:true,
        });
    }
    else
    {
        toast.success(text,
        {
            position:"top-right",
            autoClose:1000,
            hideProgressBar:true,
            newestOnTop:false,
            closeOnClick:true,
            rtl:false,
            pauseOnFocusLoss:true,
            draggable : false,
            pauseOnHover:true,
        });
    }

}