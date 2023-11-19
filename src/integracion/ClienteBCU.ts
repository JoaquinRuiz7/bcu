import * as soap from 'soap';
import {IRespuestaObtenerFechaDeUltimoCierre} from "../interfaces/IRespuestaObtenerFechaDeUltimoCierre";
import {IRespuestaObtenerCotizacion} from "../interfaces/IRespuestaObtenerCotizacion";
import {IRespuestaMoneda} from "../interfaces/IRespuestaMoneda";

export default class ClienteBCU {

    private readonly WSDL_COTIZACIONES = 'https://cotizaciones.bcu.gub.uy/wscotizaciones/servlet/awsbcucotizaciones?wsdl';
    private readonly WSDL_ULTIMO_CIERRE = 'https://cotizaciones.bcu.gub.uy/wscotizaciones/servlet/awsultimocierre?wsdl';
    private readonly WSDL_MONEDAS = 'https://cotizaciones.bcu.gub.uy/wscotizaciones/servlet/awsbcumonedas?wsdl';

    public async obtenerCotizacion(codigoDelaMoneda: number, fecha?: string): Promise<IRespuestaObtenerCotizacion> {

        if (!fecha) {
            const fechaUltimoCierre: IRespuestaObtenerFechaDeUltimoCierre = await this.obtenerFechaDelUltimoCierre();
            fecha = fechaUltimoCierre.fechaDeUltimoCierre.toISOString().substring(0, 10);
        }

        const inputData = {
            'Entrada': {
                Moneda: {item: [codigoDelaMoneda]},
                FechaDesde: fecha,
                FechaHasta: fecha,
                Grupo: '0',
            }
        };

        const client = await soap.createClientAsync(this.WSDL_COTIZACIONES);
        const result = await client.ExecuteAsync(inputData);
        const tipoCambioCompra = result[0].Salida.datoscotizaciones['datoscotizaciones.dato'][0].TCC;
        const tipoCambioventa = result[0].Salida.datoscotizaciones['datoscotizaciones.dato'][0].TCV;
        const codigoIso = result[0].Salida.datoscotizaciones['datoscotizaciones.dato'][0].CodigoISO;

        return {
            tipoCambioCompra: tipoCambioCompra,
            tipoCambioVenta: tipoCambioventa,
            codigoIso: codigoIso
        };
    }

    public async obtenerFechaDelUltimoCierre(): Promise<IRespuestaObtenerFechaDeUltimoCierre> {
        const cliente = await soap.createClientAsync(this.WSDL_ULTIMO_CIERRE);
        const respuesta = await cliente.ExecuteAsync({});
        return {fechaDeUltimoCierre: respuesta[0].Salida.Fecha};
    }

    public async obtenerMonedas(grupo?: number): Promise<IRespuestaMoneda[]> {

        if (!grupo) {
            grupo = 0;
        }

        const cliente = await soap.createClientAsync(this.WSDL_MONEDAS);
        const parametros = {
            Entrada: {Grupo: grupo}
        };

        const respuesta = await cliente.ExecuteAsync(parametros);
        let monedas: IRespuestaMoneda[] = [];

        respuesta[0].Salida['wsmonedasout.Linea'].forEach((m: { Codigo: number, Nombre: string }) => {
            const moneda: IRespuestaMoneda = {codigo: m.Codigo, nombre: m.Nombre};
            monedas.push(moneda);
        })

        return monedas;
    }
    
}