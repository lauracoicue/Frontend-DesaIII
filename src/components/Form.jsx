import React, { useEffect } from "react";
import { Link } from "react-router-dom";


const Form = () => {
    useEffect(() => {

        const email = {
            email: '',
            password: ''
        }
        const inputEmail = document.querySelector('#email');
        const inputPassword = document.querySelector('#password');
        const btnButton = document.querySelector('#botton');

        const validar = (e) => {
            if(e.target.value.trim() === ''){
                mostrarAlerta(`El campo ${e.target.id} es obligatorio`, e.target.parentElement);
                email[e.target.id] = '';
                comprobarInfo();
                return;
            }

            if(e.target.id === 'email' && !validarEmail(e.target.value)){
                mostrarAlerta(`El email no es valido`, e.target.parentElement);
                email[e.target.id] = '';
                comprobarInfo();
                return
            }
            if(e.target.id === 'password' && !validarPassword(e.target.value)){
                mostrarAlerta(`La contraseña debe tener al menos 8 caracteres,
                    incluyendo al menos un carácter especial (@, #, $, etc.).`, e.target.parentElement);
                email[e.target.id] = ''; 
                comprobarInfo();
                return;
            }
            limpiarAlerta(e.target.parentElement);

            email[e.target.id] = e.target.value.trim().toLowerCase();
            comprobarInfo();            
        };

        const mostrarAlerta = (mensaje, referencia) =>{
            limpiarAlerta(referencia);

            const error = document.createElement('P');
            error.textContent = `⚠️ ${mensaje}` ;
            error.classList.add('text-red-500', 'my-4', 'text-center', 'alerta', 'whitespace-pre-line')
            referencia.appendChild(error)

            setTimeout(() => error.remove(), 3000);

        };

        const limpiarAlerta = (referencia) =>{
            const alerta = referencia.querySelector('.alerta');
            if(alerta){
                alerta.remove();
            }
        }

        const validarEmail = (email) =>{
            const regex =  /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/ 
            return regex.test(email);
        }

        const validarPassword = (password) =>{
            const contra = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[#?!@$%^&*-])[a-zA-Z0-9!@#$%^&*]{8,}/
            return contra.test(password);
        };

        const comprobarInfo = () =>{
            if(Object.values(email).includes('')){
                btnButton.classList.add('opacity-50');
                btnButton.disabled = true;
            }else{
                btnButton.classList.remove('opacity-50');
                btnButton.disabled = false;
            }
        };

        if (inputEmail) {
            inputEmail.addEventListener('blur', validar);
        }
        if (inputPassword) {
            inputPassword.addEventListener('blur', validar);
        }

        return () => {
            if (inputEmail) {
                inputEmail.removeEventListener('blur', validar);
            }
            if (inputPassword) {
                inputPassword.removeEventListener('blur', validar);
            }
        };
        
    }, []);

    return(
        <div className="bg-white">
            <h1 className="text-4xl font-semibold text-center">Bienvenido de nuevo</h1>
            <p className="font-medium text-lg text-gray-500 text-center mt-3">Disfruta de tus compras</p>
            <div id="formulario">
                <div className="mt-16">
                    <label htmlFor="email" className="font-serif font-medium text-lg">Email Address</label>
                    <input
                        id="email"
                        className="w-full border-2 border-gray-300 p-3 rounded-xl mt-1 mx-1"
                        placeholder="Correo electrónico"
                    />
                </div>
                <div className="mt-12">
                    <label htmlFor="password" className="font-serif font-medium text-lg">Password</label>
                    <input
                        id="password"
                        type="password"
                        className="w-full border-2 border-gray-300  p-3 rounded-xl mt-1 mx-1"
                        placeholder="Contraseña"
                    />
                </div>
            </div>
                <div className="flex flex-col items-center gap-4 p-8 mt-6">
                    <div>
                        <Link to="/recoverpass" className="active:scale-[.98] font-medium text-base text-blue-950">
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </div>
                </div>
                <div className="-mt-7 flex flex-col gap-y-1">
                    <button 
                    id="botton" 
                    className="active:scale-[.98] active:duration-75 hover:scale-[1.01] ease-in-out border border-blue-950 bg-blue-950 text-white py-3 px-32 rounded-xl text-center font-bold mt-6 opacity-50" 
                    disabled>
                        Iniciar sesión
                        </button>
                    <button className="active:scale-[.98] active:duration-75 hover:scale-[1.01] ease-in-out border border-blue-950 text-black py-3 px-32 rounded-xl text-center font-bold mt-6 flex items-center justify-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="50" height="30" viewBox="0 0 48 48">
                            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
                            <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
                            <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
                            <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                        </svg>
                        Iniciar sesión con Google
                    </button>
                </div>
        </div>
    );
};

export default Form;
