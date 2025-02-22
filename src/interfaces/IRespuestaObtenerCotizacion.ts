export interface IRespuestaObtenerCotizacion {
    cotizaciones: Cotizacion[]
}

export interface Cotizacion {
    fecha: string;
    moneda: number;
    nombre: string;
    codigoIso: string;
    emisor: string;
    tcc: number;
    tcv: number;
    arbAct: number;
    formaArbitrar: string;
}
