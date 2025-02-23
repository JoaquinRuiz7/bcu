# Cliente SOAP para Obtener Cotizaciones del Banco Central del Uruguay

Este es un cliente SOAP para obtener cotizaciones (tipos de cambio) del **Banco Central del Uruguay (BCU)**. Permite obtener las cotizaciones de diferentes monedas y también proporciona funcionalidades para obtener la última fecha de cierre o cotizaciones para una fecha específica. Ahora también permite obtener cotizaciones para múltiples monedas y diferentes grupos de cotización.

---

### Cómo Usar:

#### 1. Obtener la Cotización de la Última Fecha de Cierre:

Para obtener la cotización para la fecha de cierre más reciente, simplemente llama al método `obtenerCotizacion` sin especificar una fecha:

```typescript
import ClienteBCU from './ClienteBCU'
import {Moneda} from "./Moneda";

const clienteBCU: ClienteBCU = new ClienteBCU()
const cotizaciones = await clienteBCU.obtenerCotizacion({codigoDeMonedas: [Moneda.DOLAR_ESTADOUNIDENSE,Moneda.EURO]})
console.log(cotizaciones)
```

#### 2. Obtener la Cotización para una Fecha Específica:

```typescript
import ClienteBCU from './ClienteBCU'

const clienteBCU: ClienteBCU = new ClienteBCU()
const cotizacion = await clienteBCU.obtenerCotizacion({ codigoDeMonedas: [Moneda.DOLAR_ESTADOUNIDENSE], fecha: '2025-02-14' })
console.log(cotizacion)
```

#### 3. Obtener Cotización para un Grupo Específico:

```typescript
import ClienteBCU from './ClienteBCU'
import {Grupo} from './Grupo'
import {Moneda} from "./Moneda";

const clienteBCU: ClienteBCU = new ClienteBCU()
const cotizacion = await clienteBCU.obtenerCotizacion({
    codigoDeMonedas: [Moneda.DOLAR_ESTADOUNIDENSE],
    fecha: '2025-02-14',
    grupo: Grupo.TASAS_LOCALES
})
console.log(cotizacion)
```

#### 4. Obtener el Listado de Monedas Disponibles:

```typescript
import ClienteBCU from './ClienteBCU'

const clienteBCU: ClienteBCU = new ClienteBCU()
const monedas = await clienteBCU.obtenerMonedas() // Grupo 0 por defecto
console.log(monedas)
```

### Monedas disponibles

El enum Moneda contiene un conjunto de códigos de moneda predefinidos. Algunos ejemplos incluyen:

```typescript
Moneda.DOLAR_ESTADOUNIDENSE //(Dólar Estadounidense)
Moneda.PESO_ARGENTINO //(Peso Argentino)
Moneda.EURO //(Euro)
Moneda.PESO_CHILENO //(Peso Chileno)
```

Puedes ver la lista completa de monedas disponibles en el enum Moneda.