import { createContext, useContext, useState } from "react";

const HistorialContext = createContext();

export const HistorialProvider = ({ children }) => {
  const [entregasAsignadas, setEntregasAsignadas] = useState([
    {
      id: 1,
      cliente: "Laura Pérez",
      direccion: "Calle 12 #44-32",
      fecha: "2025-06-05",
      productos: ["Blusa", "Jeans", "Zapatillas"],
      estado: "Pendiente"
    },
    {
      id: 2,
      cliente: "Juan Gomez",
      direccion: "Calle 39 #25-33",
      fecha: "2025-03-05",
      productos: ["Tetero", "Medias"],
      estado: "Pendiente"
    },
    {
      id: 3,
      cliente: "Lau Gonzales",
      direccion: "Calle 123, Tulua",
      fecha: "2025-09-05",
      productos: ["Pan", "Huevos"],
      estado: "Pendiente"
    }
  ]);

  const [historialEntregas, setHistorialEntregas] = useState([]);

  const avanzarEstadoEntrega = (id, estadoActual) => {
    const estados = ["Pendiente", "Enviado", "En camino", "Cerca", "Entregado"];
    const idx = estados.indexOf(estadoActual);
    const siguienteEstado = estados[idx + 1];

    setEntregasAsignadas((prev) => {
      return prev.reduce((acc, entrega) => {
        if (entrega.id === id) {
          const nuevaEntrega = { ...entrega, estado: siguienteEstado };

          if (siguienteEstado === "Entregado") {
            const entregaConFecha = {
              ...nuevaEntrega,
              fecha: new Date().toISOString().split("T")[0]
            };

            // Verificamos que no esté ya en el historial
            setHistorialEntregas((prevHistorial) => {
              const yaExiste = prevHistorial.some(e => e.id === entregaConFecha.id);
              if (!yaExiste) {
                return [...prevHistorial, entregaConFecha];
              }
              return prevHistorial;
            });

            return acc; // Se elimina de asignadas
          } else {
            acc.push(nuevaEntrega); // Sigue en entregasAsignadas
          }
        } else {
          acc.push(entrega); // Mantener las otras
        }
        return acc;
      }, []);
    });
  };

  return (
    <HistorialContext.Provider
      value={{
        entregasAsignadas,
        historialEntregas,
        avanzarEstadoEntrega
      }}
    >
      {children}
    </HistorialContext.Provider>
  );
};

export const useHistorial = () => useContext(HistorialContext);
