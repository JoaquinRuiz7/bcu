import { describe, expect, it, jest, beforeEach } from '@jest/globals'
import ClienteBCU from '../../src/integracion/ClienteBCU'
import { Moneda } from '../../src'
import { BCUException } from '../../src/exception/BCUException'
import { IRespuestaObtenerCotizacion } from '../../src/interfaces/IRespuestaObtenerCotizacion'

describe('BCU client', () => {
    let clienteBCU: ClienteBCU
    const lastClosingDate = new Date('2025-02-14')

    beforeEach(() => {
        clienteBCU = new ClienteBCU()
    })

    it('should throw exception if invalid currency code is sent', async () => {
        await expect(clienteBCU.obtenerCotizacion(-1)).rejects.toThrowError(
            new BCUException('El codigo de la moneda no existe, verifique las moneda habilitadas.')
        )
    })

    it('should throw invalid date exception if date is set and is after today', async () => {
        const today: Date = new Date()
        const tomorrow: Date = new Date(today)
        tomorrow.setDate(today.getDate() + 1)

        await expect(
            clienteBCU.obtenerCotizacion(Moneda.DOLAR_ESTADOUNIDENSE, tomorrow.toISOString())
        ).rejects.toThrowError(new BCUException('La fecha de cotizacion debe ser anterior o igual a la fecha actual'))
    })

    it('should use last closing date if date is not set', async () => {
        jest.spyOn(clienteBCU, 'obtenerFechaDelUltimoCierre').mockResolvedValue({
            fechaDeUltimoCierre: lastClosingDate,
        })

        const cotizacion: IRespuestaObtenerCotizacion = await clienteBCU.obtenerCotizacion(Moneda.DOLAR_ESTADOUNIDENSE)

        expect(clienteBCU.obtenerFechaDelUltimoCierre).toHaveBeenCalledTimes(1)
        expect(cotizacion).toBeDefined()
        expect(cotizacion.tipoCambioCompra).toBe(43.224)
        expect(cotizacion.tipoCambioVenta).toBe(43.224)
    })

    it('should return currency for date', async () => {
        const cotizacion: IRespuestaObtenerCotizacion = await clienteBCU.obtenerCotizacion(
            Moneda.DOLAR_ESTADOUNIDENSE,
            lastClosingDate.toISOString()
        )

        expect(cotizacion).toBeDefined()
        expect(cotizacion.tipoCambioCompra).toBe(43.224)
        expect(cotizacion.tipoCambioVenta).toBe(43.224)
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
