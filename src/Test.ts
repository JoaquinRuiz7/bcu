import ClienteBCU from "./integracion/ClienteBCU";


async function pruebaCotizacione() {
    const clienteBCU = new ClienteBCU();
    const data = await clienteBCU.obtenerCotizacion(2222);
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

pruebaMonedas();