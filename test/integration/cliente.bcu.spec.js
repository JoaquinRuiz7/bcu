"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const ClienteBCU_1 = __importDefault(require("../../src/integracion/ClienteBCU"));
const Monedas_1 = require("../../src/monedas/Monedas");
const BCUException_1 = require("../../src/exception/BCUException");
(0, globals_1.describe)('BCU client', () => {
    (0, globals_1.it)('should throw invalid date exception if date is set and is after today', () => __awaiter(void 0, void 0, void 0, function* () {
        const clienteBCU = new ClienteBCU_1.default();
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        yield (0, globals_1.expect)(clienteBCU.obtenerCotizacion(Monedas_1.Monedas.DOLAR_ESTADOUNIDENSE, tomorrow.toISOString())).rejects.toThrow(BCUException_1.BCUException);
    }));
    (0, globals_1.it)('should use last closing date if date is not set', () => __awaiter(void 0, void 0, void 0, function* () {
        const clienteBCU = new ClienteBCU_1.default();
        const lastClosingDate = new Date('2025-02-14');
        // @ts-ignore
        clienteBCU.obtenerFechaDelUltimoCierre = globals_1.jest.fn().mockResolvedValue({ fechaDeUltimoCierre: lastClosingDate });
        const cotizacion = yield clienteBCU.obtenerCotizacion(Monedas_1.Monedas.DOLAR_ESTADOUNIDENSE);
        (0, globals_1.expect)(clienteBCU.obtenerFechaDelUltimoCierre).toHaveBeenCalledTimes(1);
        (0, globals_1.expect)(cotizacion).toBeDefined();
        (0, globals_1.expect)(cotizacion.tipoCambioCompra).toBe(43.224);
        (0, globals_1.expect)(cotizacion.tipoCambioVenta).toBe(43.224);
    }));
    (0, globals_1.it)('should return currency for date', () => __awaiter(void 0, void 0, void 0, function* () {
        const clienteBCU = new ClienteBCU_1.default();
        const lastClosingDate = new Date('2025-02-14');
        const cotizacion = yield clienteBCU.obtenerCotizacion(Monedas_1.Monedas.DOLAR_ESTADOUNIDENSE, lastClosingDate.toISOString());
        (0, globals_1.expect)(cotizacion).toBeDefined();
        (0, globals_1.expect)(cotizacion.tipoCambioCompra).toBe(43.224);
        (0, globals_1.expect)(cotizacion.tipoCambioVenta).toBe(43.224);
    }));
});
