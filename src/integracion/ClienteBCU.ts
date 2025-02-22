import * as soap from 'soap'
import {IRespuestaObtenerFechaDeUltimoCierre} from '../interfaces/IRespuestaObtenerFechaDeUltimoCierre'
import {IRespuestaObtenerCotizacion} from '../interfaces/IRespuestaObtenerCotizacion'
import {IRespuestaMoneda} from '../interfaces/IRespuestaMoneda'
import {BCUException} from '../exception/BCUException'
import {Moneda} from '../moneda/Moneda'
import {Grupo} from '../cotizacion/Grupo'

type PeticionCotizacion = {
    codigoDeMonedas: number[]
    fecha?: string
    grupo?: Grupo
}
export default class ClienteBCU {
    private readonly WSDL_COTIZACIONES: string =
        'https://cotizaciones.bcu.gub.uy/wscotizaciones/servlet/awsbcucotizaciones?wsdl'
    private readonly WSDL_ULTIMO_CIERRE: string =
        'https://cotizaciones.bcu.gub.uy/wscotizaciones/servlet/awsultimocierre?wsdl'
    private readonly WSDL_MONEDAS: string = 'https://cotizaciones.bcu.gub.uy/wscotizaciones/servlet/awsbcumonedas?wsdl'
    private readonly GRUPOS_MONEDAS = [0, 1]

    public async obtenerCotizacion(peticion: PeticionCotizacion): Promise<IRespuestaObtenerCotizacion> {

        peticion.codigoDeMonedas.forEach(codigo=>{
            if(!Moneda[codigo]){
                throw new BCUException('El codigo de la moneda no existe, verifique las moneda habilitadas.')
            }
        });

        if (peticion.fecha && !this.esFechaValidaParaCotizacion(peticion.fecha)) {
            throw new BCUException('La fecha de cotizacion debe ser anterior o igual a la fecha actual')
        }

        if (!peticion.fecha) {
            const fechaUltimoCierre: IRespuestaObtenerFechaDeUltimoCierre = await this.obtenerFechaDelUltimoCierre()
            peticion.fecha = fechaUltimoCierre.fechaDeUltimoCierre.toISOString().substring(0, 10)
        }

        const inputData = {
            Entrada: {
                Moneda: { item: [peticion.codigoDeMonedas.join(',')] },
                FechaDesde: peticion.fecha,
                FechaHasta: peticion.fecha,
                Grupo: peticion.grupo ?? 0,
            },
        }

        const client = await soap.createClientAsync(this.WSDL_COTIZACIONES)
        const result = await client.ExecuteAsync(inputData)
        const cotizaciones = result[0].Salida.datoscotizaciones['datoscotizaciones.dato']
        return cotizaciones.map((cotizacion) => ({
            fecha: cotizacion.Fecha,
            tipoCambioCompra: cotizacion.TCC,
            tipoCambioVenta: cotizacion.TCV,
            codigoIso: cotizacion.CodigoISO,
            nombre: cotizacion.Nombre,
            emisor: cotizacion.Emisor
        }));
    }

    public async obtenerFechaDelUltimoCierre(): Promise<IRespuestaObtenerFechaDeUltimoCierre> {
        const cliente = await soap.createClientAsync(this.WSDL_ULTIMO_CIERRE)
        const respuesta = await cliente.ExecuteAsync({})
        return { fechaDeUltimoCierre: respuesta[0].Salida.Fecha }
    }

    public async obtenerMonedas(grupo?: number): Promise<IRespuestaMoneda[]> {
        if (!grupo) {
            grupo = 0
        }

        if (!this.GRUPOS_MONEDAS.includes(grupo)) {
            throw new BCUException('El grupo de moneda debe ser 0 o 1')
        }

        const cliente = await soap.createClientAsync(this.WSDL_MONEDAS)
        const parametros = {
            Entrada: { Grupo: grupo },
        }

        const respuesta = await cliente.ExecuteAsync(parametros)
        let monedas: IRespuestaMoneda[] = []

        respuesta[0].Salida['wsmonedasout.Linea'].forEach((m: { Codigo: number; Nombre: string }) => {
            const moneda: IRespuestaMoneda = { codigo: m.Codigo, nombre: m.Nombre }
            monedas.push(moneda)
        })

        return monedas
    }

    private esFechaValidaParaCotizacion(fecha: string): boolean {
        const hoy: Date = new Date()
        const fechaElegida: Date = new Date(fecha)
        return fechaElegida <= hoy
    }
}
