import "./estilo.css"
const CuentaVerificada = () => {
    return (
        <>
            <div className={"header2"}>
                <img className={"img2"} src={"/logo.png"} alt="logo "/>
            </div>
            <div>
                <h1 className={"text-center2"}>Tu Cuenta está verificada</h1>
                <p>Aquí te mostramos como funciona la aplicación 3D MOTOR's para que puedas sacarle el máximo provecho</p>
                <p className={"text-center2"}><a href={"https://www.youtube.com/watch?v=ouxXyP89rcc"}>Ir al link de Youtube</a> </p>
            </div>
        </>
    );
}
export default CuentaVerificada;