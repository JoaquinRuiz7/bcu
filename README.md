# Cliente SOAP obtener cotizaciones del Banco central del Uruguay 

### Como usar:

#### Para obtener la cotizacion de la ultima fecha de cierre simplemente se hace asi:
```typescript
import ClienteBCU from "./ClienteBCU";
import {Monedas} from "./Monedas";

const clienteBCU: ClienteBCU = new ClienteBCU();
const cotizacion = clienteBCU.obtenerCotizacion(Monedas.DOLAR_ESTADOUNIDENSE);
console.log(cotizacion);

```

#### Para obtener la fecha de cotizacion en una fecha especifica se hace asi:


```typescript
import ClienteBCU from "./ClienteBCU";
import {Monedas} from "./Monedas";

const clienteBCU: ClienteBCU = new ClienteBCU();
const cotizacion = clienteBCU.obtenerCotizacion(Monedas.DOLAR_ESTADOUNIDENSE,'2025-02-14');
console.log(cotizacion);
```

### Para obtener el listado de monedas se hace asi:

```typescript
import ClienteBCU from "./ClienteBCU";
import {Monedas} from "./Monedas";

const clienteBCU: ClienteBCU = new ClienteBCU();
const monedas = await clienceBCu.obtenerMonedas();
console.log(monedas);
```