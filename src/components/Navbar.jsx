import React from 'react'


const Navbar = () => {
    return(
        <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] bg-blue-950 flex justify-between'>
            <h1 className='text-white p-5'>Bienvenidos a esta pagina web</h1>
            <ul className='hidden sm:flex gap-5 text-white'>
                <a href="" className='px-4 py-4'>iniciar</a>
                <a href="" className='px-4 py-4 '>nosotros</a>
                <a href="" className='px-4 py-4'>Registrarse</a>
            </ul>
        </div>
    )
}

export default Navbar