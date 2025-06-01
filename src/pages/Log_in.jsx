import React from "react";
import Form from "../components/Form";


const Log_in = () => {
    return(
        <div className="flex -my-2 min-h-screen bg-white">
            <div className="w-full flex justify-center lg:w-1/2 my-16">
                <Form/>
            </div>
            <div className="hidden relative lg:flex py-0 h-full w-1/2 bg-slate-100 justify-center items-center">
                <h1 className="absolute top-10 text-center text-xl font-bold text-bl">
                    Descubre todo lo que necesitas en un solo lugar. 
                    Calidad, variedad y confianza al alcance de un clic. 
                    ¡Compra con seguridad y encuentra lo que buscas sin límites!
                </h1>
                <div className="w-52 h-52 my-[335px] bg-gradient-to-tr from-blue-500 to-pink-500 rounded-full animate-bounce"/>
                <div className="w-full h-1/2 absolute bottom-0 bg-white/10 backdrop-blur-lg"/>
            </div>
        </div>
    );
}

export default Log_in 