import ClienteBCU from "./integracion/ClienteBCU";
import {Monedas} from "./monedas/Monedas";


async function pruebaCotizacione() {
    const clienteBCU = new ClienteBCU();
    const data = await clienteBCU.obtenerCotizacion(Monedas.DOLAR_ESTADOUNIDENSE);
    console.log(data)
}

async function pruebaUltimoCierre() {
    const clienceBCu = new ClienteBCU();
    const data = await clienceBCu.obtenerFechaDelUltimoCierre();
    console.log(data);
}

async function pruebaMonedas() {
    const clienceBCu = new ClienteBCU();
    const data = await clienceBCu.obtenerMonedas();
    console.log(data);
}

pruebaCotizacione();