# Tools

## Simulador local

`simulate.js` permite validar rápidamente la lógica principal sin Teams/Power Automate.

### Uso

```bash
node tools/simulate.js
```

### Qué prueba

- Asignación `/next` por líder.
- Cambio de estado.
- Reinserción `busy -> available` con `boostMode`.
- Normalización de `queueOrder`.
