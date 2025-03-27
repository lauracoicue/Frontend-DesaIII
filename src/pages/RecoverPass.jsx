import React, { useEffect, useRef } from 'react';
import Button from '../components/Button';

const RecoverPass = () => {
    const inputCorreoRef = useRef(null); // Referencia al input

    useEffect(() => {
        const inputCorreo = inputCorreoRef.current;

        const validar = (e) => {
            limpiarAlerta(e.target.parentElement);

            if(e.target.value.trim() === ''){
                mostrarAlerta(`El campo ${e.target.id} es obligatorio`, e.target.parentElement);
                return;
            }

            if(e.target.id === 'correo' && !validarCorreo(e.target.value)){
                mostrarAlerta(`El correo no es válido`, e.target.parentElement);
                return;
            }
        };

        const mostrarAlerta = (mensaje, referencia) => {
            limpiarAlerta(referencia);

            const error = document.createElement('p');
            error.textContent = `⚠️ ${mensaje}`;
            error.classList.add('text-red-500', 'my-4', 'text-center', 'alerta', 'whitespace-pre-line');
            referencia.appendChild(error);

            setTimeout(() => error.remove(), 3000);
        };

        const limpiarAlerta = (referencia) => {
            const alerta = referencia.querySelector('.alerta');
            if(alerta) {
                alerta.remove();
            }
        };

        const validarCorreo = (correo) => {
            const regex =  /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
            return regex.test(correo);
        };

        if (inputCorreo) {
            inputCorreo.addEventListener('blur', validar);
        }

        return () => {
            if (inputCorreo) {
                inputCorreo.removeEventListener('blur', validar);
            }
        };

    }, []);

    return (
        <div className="flex justify-center my-32 w-full ">
            <div className="w-[90%] max-w-[900px] h-[590px] bg-white rounded-lg shadow-lg sm:w-[80%] md:w-[70%] lg:w-1/2 p-6">
                <h2 className="text-center text-2xl font-semibold text-blue-950 mb-4">
                    Recuperar Contraseña
                </h2>
                <hr className="border-t-2 border-gray-300 mb-6"/>
                <div className="mt-20">
                    <label className="font-medium text-lg">
                        Ingresa tu correo electrónico de recuperación, te llegará un correo de verificación.
                    </label>
                    <input 
                        ref={inputCorreoRef}
                        id="correo"
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
