import React from 'react';
import Button from '../components/Button';

const RecoverPass = () => {
    return (
        <div className="flex justify-center my-32 w-full h-screen">
            <div className="w-[90%] max-w-[900px] h-[590px] bg-white rounded-lg shadow-lg sm:w-[80%] md:w-[70%] lg:w-1/2 p-6">
                
                <h2 className="text-center text-2xl font-semibold text-blue-950 mb-4">
                    Recuperar Contraseña
                </h2>
                <hr className="border-t-2 border-gray-300 mb-6"/>
                <div className="mt-20">
                    <label htmlFor="" className="font-medium text-lg">Ingresa tu correo electronico de recuperación, te llegara un correo de berificación</label>
                    <input 
                        className="w-full border-2 border-gray-300 p-5 rounded-xl mt-10 mx-1"
                        placeholder="Correo electrónico"
                    />
                </div>
                <hr className="border-t-2 border-gray-300 mt-20"/>
                <div className="flex justify-center gap-6 mt-7 w-full">
                    <Button text="Cancelar" onClick={() => console.log('Cancelar')} />
                    <Button text="Enviar" href="" />
                </div>
            </div>
        </div>
    );
}

export default RecoverPass;
