import React from "react";
import Form from "../components/Form";


const Log_in = () => {
    return(
        <div className="flex w-full h-screen bg-white">
            <div className="w-full flex justify-center lg:w-1/2 my-32">
                <Form/>
            </div>
            <div className="hidden relative lg:flex h-full w-1/2 bg-gray-200 justify-center items-center">
                <h1 className="absolute top-10 text-center text-xl font-bold text-bl">
                    Descubre todo lo que necesitas en un solo lugar. 
                    Calidad, variedad y confianza al alcance de un clic. 
                    ¡Compra con seguridad y encuentra lo que buscas sin límites!
                </h1>
                <div className="w-60 h-60 bg-gradient-to-tr from-blue-500 to-pink-500 rounded-full animate-bounce"/>
                <div className="w-full h-1/2 absolute bottom-0 bg-white/10 backdrop-blur-lg"/>
            </div>
        </div>
    );
}

export default Log_in 