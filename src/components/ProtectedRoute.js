import {Navigate, useParams} from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const { id } = useParams();
    if (localStorage.getItem("token") ) {
        return children;
    }else{
        return <Navigate to={`/visualizador/view/${id}`} replace />;
    }
};

export default ProtectedRoute;