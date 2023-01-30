import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import {EmailIcon} from "react-share";
import {RiNumber1} from "react-icons/ri";
import {TbNumber1, TbNumber2, TbNumber3, TbNumber4, TbNumber5, TbNumber6, TbNumber7, TbNumber8} from "react-icons/tb";
import "./Timeline.css"

const Timeline =() =>{

    return (
        <VerticalTimeline layout={"1-column-left"}>

            <VerticalTimelineElement
                position={"right"}
                className="vertical-timeline-element--work"
                contentStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
                contentArrowStyle={{ borderRight: '7px solid  rgb(33, 150, 243)' }}
                iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
                icon={<TbNumber1 />}
            >
                <h3 className="vertical-timeline-element-title">Descarga la app de 3D MOTORS</h3>

                <p>
                    <div className={"image-container2"} >
                        <a href={"https://play.google.com/store/apps/details?id=com.threedspaceinc.appmotors"} target="_blank"> <img src={"../../../getonplay.png"} alt={"fe"}/></a>

                    </div>

                </p>
            </VerticalTimelineElement>
            <VerticalTimelineElement
                position={"right"}
                className="vertical-timeline-element--work"
                iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
                icon={<TbNumber2 />}
            >
                <h3 className="vertical-timeline-element-title">Abra la app y cree una cuenta</h3>
                <div className={"image-container2"} >
                    <img className={"imagen"} src={"../../../crearCuenta.jpeg"} alt={"fe"}/>
                </div>
                <p>
                    Un mensaje de verificación se enviara al correo electronico registrado, de click en el enlace para validar su cuenta.
                </p>
                <p>Una cuenta en Marketa 3D se creara automaticamente</p>
                <div className={"image-container2"} >
                    <img style={{width:"400px"}} src={"../../../marketaCorreo.png"} alt={"fe"}/>
                </div>

            </VerticalTimelineElement>

            <VerticalTimelineElement
                position={"right"}
                className="vertical-timeline-element--work"
                iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
                icon={<TbNumber3 />}
            >
                <h3 className="vertical-timeline-element-title">Inicie sesion y cree un nuevo objeto vehiculo</h3>
                <p>
                    Siga las instrucciones mostradas en la aplicacion para crear el vehiculo
                </p>
                <div className={"image-container2"} >
                    <img style={{width:"400px"}} src={"../../../vehiculos.jpeg"} alt={"fe"}/>
                </div>
                <p>
                    Inserte la informacion requerida correctamente, esta información sera visible en la publicación de Marketa 3D
                </p>
            </VerticalTimelineElement>
            <VerticalTimelineElement
                position={"right"}
                className="vertical-timeline-element--work"
                iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
                icon={<TbNumber4 />}
            >
                <h3 className="vertical-timeline-element-title">El vehiculo se creará en Marketa 3D</h3>
                <p>Una vez que el procesamiento haya terminado el vehiculo se creara en el Marketa 3D de manera automatica</p>
                <div className={"image-container2"} >
                    <img style={{width:"400px"}} src={"../../../autoMarketa.png"} alt={"fe"}/>
                </div>

            </VerticalTimelineElement>

            <VerticalTimelineElement
                contentStyle={{ background: 'rgb(16, 204, 82)', color: '#fff' }}
                position={"right"}
                className="vertical-timeline-element--education"
                iconStyle={{ background: 'rgb(16, 204, 82)', color: '#fff' }}
                icon={<TbNumber5 />}
            >
                <h3 className="vertical-timeline-element-title">Listo tu vehiculo esta ahora publicado en Marketa 3D</h3>

            </VerticalTimelineElement>

        </VerticalTimeline>
    );
}

export default Timeline;