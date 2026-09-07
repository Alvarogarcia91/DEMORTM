# RTM Demo — Calidad v4 · Ejecución con validación previa

## Propósito

Este documento es el **instructivo corto de ejecución** para aplicar `docs/calidad-demo-v4-cierre-cartita-alicia.md` sin duplicar trabajo si otro agente/Codex ya avanzó parte del refinamiento.

La fuente funcional sigue siendo:

- `docs/calidad-demo-v4-cierre-cartita-alicia.md`
- `docs/calidad-demo-v3-refinamiento.md`
- implementación actual de `alvaro01`

No reemplaza el alcance funcional del v4; agrega una regla obligatoria de **validación antes de modificar código**.

---

# 1. PRIMERO VALIDAR, DESPUÉS IMPLEMENTAR

Antes de tocar código:

1. Confirmar que se está trabajando en `alvaro01`.
2. Revisar el HEAD actual y commits recientes.
3. Auditar la implementación actual de Calidad y Producción.
4. Comparar lo implementado contra **cada P0/P1/P2** de `calidad-demo-v4-cierre-cartita-alicia.md`.
5. Revisar si alguno de esos puntos ya fue implementado por una ejecución previa de Codex/Anti.
6. No duplicar componentes, mocks, estados, modales, tabs ni flujos que ya existan.
7. No sobreescribir trabajo nuevo con una versión anterior del plan.

Si el código actual ya contiene parte del refinamiento, **continuar desde ahí y completar únicamente los huecos**.

No asumir que el estado visto en una ejecución anterior sigue vigente: validar el repo actual.

---

# 2. Resultado esperado de la validación

Antes de implementar, construir internamente una matriz rápida:

```text
REQUERIMIENTO                         ESTADO
Producción no auto-libera QA          OK / FALTA / PARCIAL
Estado compartido Producción-Calidad  OK / FALTA / PARCIAL
Dashboard accionable                  OK / FALTA / PARCIAL
Captura periódica                     OK / FALTA / PARCIAL
Nueva auditoría                       OK / FALTA / PARCIAL
Incoming                              OK / FALTA / PARCIAL
Remanentes                            OK / FALTA / PARCIAL
Checklist por operación               OK / FALTA / PARCIAL
Auditoría final completa              OK / FALTA / PARCIAL
Baches / muestras                     OK / FALTA / PARCIAL
Preview Zebra                         OK / FALTA / PARCIAL
Desviaciones automáticas              OK / FALTA / PARCIAL
4M → ICAR                             OK / FALTA / PARCIAL
Revisión mensual SGC                  OK / FALTA / PARCIAL
Requisitos cliente accionables        OK / FALTA / PARCIAL
Plan de Control                       OK / FALTA / PARCIAL
Audit trail / cambios                 OK / FALTA / PARCIAL
Permisos                              OK / FALTA / PARCIAL
Integridad / respaldos demo           OK / FALTA / PARCIAL
Serigrafía                            OK / FALTA / PARCIAL
```

No es necesario entregar esta matriz como artefacto al usuario; sirve para no repetir trabajo.

---

# 3. Regla de ejecución

Después de validar:

- implementar los `FALTA`;
- completar los `PARCIAL`;
- conservar los `OK`;
- corregir inconsistencias entre Producción y Calidad;
- priorizar primero P0, después P1 y por último P2;
- mantener el flujo operativo definido en el v4.

Si una ejecución previa ya implementó un punto de manera mejor o más completa que el MD, **no degradarlo**: conservarlo y ajustar solamente lo necesario para alinearlo funcionalmente.

---

# 4. Narrativa que debe sobrevivir a cualquier refinamiento

```text
Calidad ve trabajo pendiente
→ [Capturar] / [Auditar]
→ captura medición o ejecuta checklist
→ emite dictamen
→ Conforme: libera gate / OP / material
→ No Conforme: HOLD / MNC
→ desviación cuando aplique
→ análisis 4M
→ acción correctiva / ICAR
→ trazabilidad completa
```

El usuario debe poder **hacer acciones**. No convertir Calidad en un dashboard pasivo ni en una lista de requisitos IATF.

---

# 5. Reglas técnicas

- Trabajar exclusivamente en `alvaro01`.
- `src/` es la fuente canónica.
- No mantener manualmente dos copias de código.
- Seguir `docs/design-system.md`.
- Usar Requisiciones como referencia UI/UX.
- No copiar visualmente Access.
- No crear backend/API/migraciones.
- No dejar botones principales muertos.
- Preservar responsive y theme dinámico.

Al finalizar:

```bash
npm run build
npm run sync:frontend
```

Corregir errores antes de terminar.
