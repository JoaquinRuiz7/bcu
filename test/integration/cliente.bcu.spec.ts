import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import ClienteBCU from '../../src/integracion/ClienteBCU'
import { Moneda } from '../../src'
import { BCUException } from '../../src/exception/BCUException'
import { IRespuestaObtenerCotizacion } from '../../src/interfaces/IRespuestaObtenerCotizacion'
import { Grupo } from '../../src/cotizacion/Grupo'

describe('BCU client', () => {
    let clienteBCU: ClienteBCU
    const lastClosingDate = new Date('2025-02-14')

    beforeEach(() => {
        clienteBCU = new ClienteBCU()
    })

    it('should throw exception if invalid currency code is sent', async () => {
        await expect(clienteBCU.obtenerCotizacion({ codigoDeMonedas: [-1] })).rejects.toThrowError(
            new BCUException('El codigo de la moneda no existe, verifique las moneda habilitadas.')
        )
    })

    it('should throw invalid date exception if date is set and is after today', async () => {
        const today: Date = new Date()
        const tomorrow: Date = new Date(today)
        tomorrow.setDate(today.getDate() + 1)

        await expect(
            clienteBCU.obtenerCotizacion({
                codigoDeMonedas: [Moneda.DOLAR_ESTADOUNIDENSE],
                fecha: tomorrow.toISOString(),
            })
        ).rejects.toThrowError(new BCUException('La fecha de cotizacion debe ser anterior o igual a la fecha actual'))
    })

    it('should use last closing date if date is not set', async () => {
        jest.spyOn(clienteBCU, 'obtenerFechaDelUltimoCierre').mockResolvedValue({
            fechaDeUltimoCierre: lastClosingDate,
        })

        const cotizacion: IRespuestaObtenerCotizacion = await clienteBCU.obtenerCotizacion({
            codigoDeMonedas: [Moneda.DOLAR_ESTADOUNIDENSE],
        })

        expect(clienteBCU.obtenerFechaDelUltimoCierre).toHaveBeenCalledTimes(1)
        expect(cotizacion).toBeDefined()
        expect(cotizacion[0].tipoCambioCompra).toBe(43.224)
        expect(cotizacion[0].tipoCambioVenta).toBe(43.224)
    })

    it('should return quotation for date', async () => {
        const quotation: IRespuestaObtenerCotizacion = await clienteBCU.obtenerCotizacion({
            codigoDeMonedas: [Moneda.DOLAR_ESTADOUNIDENSE],
            fecha: lastClosingDate.toISOString(),
        })
        expect(quotation).toBeDefined()
        expect(quotation[0].tipoCambioCompra).toBe(43.224)
        expect(quotation[0].tipoCambioVenta).toBe(43.224)
        expect(quotation[0].codigoIso).toBe('USD')
        expect(quotation[0].nombre).toBe('DOLAR USA')
    })

    it('should return quotation for international market', async () => {
        const quotation = await clienteBCU.obtenerCotizacion({
            grupo: Grupo.MERCADO_INTERNACIONAL,
            fecha: lastClosingDate.toISOString(),
            codigoDeMonedas: [Moneda.DOLAR_ESTADOUNIDENSE],
        })
        expect(quotation).toBeDefined()
        expect(quotation[0].tipoCambioCompra).toBe(43.224)
        expect(quotation[0].tipoCambioVenta).toBe(43.224)
    })

    it('should return quotation for local quotations', async () => {
        const quotation = await clienteBCU.obtenerCotizacion({
            grupo: Grupo.COTIZACIONES_LOCALES,
            fecha: lastClosingDate.toISOString(),
            codigoDeMonedas: [Moneda.DOLAR_ESTADOUNIDENSE],
        })
        expect(quotation).toBeDefined()
        expect(quotation[0].tipoCambioCompra).toBe(0)
        expect(quotation[0].tipoCambioVenta).toBe(0)
    })

    it('should return quotation for local tases', async () => {
        const quotation = await clienteBCU.obtenerCotizacion({
            grupo: Grupo.TASAS_LOCALES,
            fecha: lastClosingDate.toISOString(),
            codigoDeMonedas: [Moneda.DOLAR_ESTADOUNIDENSE, Moneda.EURO],
        })
        expect(quotation).toBeDefined()
        expect(quotation[0].tipoCambioCompra).toBe(0)
        expect(quotation[0].tipoCambioVenta).toBe(0)
    })

    it('should return available currencies', async () => {
        const currencies = await clienteBCU.obtenerMonedas()

        expect(currencies).toBeDefined()
        expect(currencies.length).toBeGreaterThan(0)
    })

    it('should return available currencies group 1', async () => {
        const currencies = await clienteBCU.obtenerMonedas(1)

        expect(currencies).toBeDefined()
        expect(currencies.length).toBeGreaterThan(0)
    })
})
