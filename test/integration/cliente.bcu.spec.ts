import { describe, expect, it, jest } from '@jest/globals'
import ClienteBCU from '../../src/integracion/ClienteBCU'
import { Monedas } from '../../src/monedas/Monedas'
import { BCUException } from '../../src/exception/BCUException'
import { IRespuestaObtenerCotizacion } from '../../src/interfaces/IRespuestaObtenerCotizacion'

describe('BCU client', () => {
    it('should throw invalid date exception if date is set and is after today', async () => {
        const clienteBCU = new ClienteBCU()
        const today = new Date()
        const tomorrow = new Date(today)
        tomorrow.setDate(today.getDate() + 1)
        await expect(
            clienteBCU.obtenerCotizacion(Monedas.DOLAR_ESTADOUNIDENSE, tomorrow.toISOString())
        ).rejects.toThrow(BCUException)
    })
    it('should use last closing date if date is not set', async () => {
        const clienteBCU = new ClienteBCU()
        const lastClosingDate = new Date('2025-02-14')
        // @ts-ignore
        clienteBCU.obtenerFechaDelUltimoCierre = jest.fn().mockResolvedValue({ fechaDeUltimoCierre: lastClosingDate })

        const cotizacion: IRespuestaObtenerCotizacion = await clienteBCU.obtenerCotizacion(Monedas.DOLAR_ESTADOUNIDENSE)
        expect(clienteBCU.obtenerFechaDelUltimoCierre).toHaveBeenCalledTimes(1)
        expect(cotizacion).toBeDefined()
        expect(cotizacion.tipoCambioCompra).toBe(43.224)
        expect(cotizacion.tipoCambioVenta).toBe(43.224)
    })
    it('should return currency for date', async () => {
        const clienteBCU = new ClienteBCU()
        const lastClosingDate = new Date('2025-02-14')
        const cotizacion: IRespuestaObtenerCotizacion = await clienteBCU.obtenerCotizacion(
            Monedas.DOLAR_ESTADOUNIDENSE,
            lastClosingDate.toISOString()
        )

        expect(cotizacion).toBeDefined()
        expect(cotizacion.tipoCambioCompra).toBe(43.224)
        expect(cotizacion.tipoCambioVenta).toBe(43.224)
    })
})
