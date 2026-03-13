# PRD — Plataforma de Gestión de Concilios e Iglesias (Web + Mobile)

## 1) Resumen
Plataforma **multi-tenant** (por concilio) con **web + mobile** para administrar:
- Estructura organizacional (concilio, iglesias madre/hijas/nietas, sociedades)
- Miembros, roles y directivas
- **Servicios** (calendario, categorías configurables, asignaciones, reemplazos)
- **Actividades** (calendario, visibilidad)
- Cumpleaños + mensajería interna
- Registro de aportes (donaciones/ofrendas/diezmos) con reportes

---

## 2) Objetivos
1. Centralizar gestión del concilio y sus iglesias/sociedades (estructura jerárquica).
2. Gestionar servicios y actividades con calendario, evitando conflictos y mejorando planificación.
3. Formalizar asignaciones y cambios/reemplazos en servicios.
4. Visibilizar cumpleaños y permitir felicitaciones internas.
5. Tener trazabilidad de aportes (quién/cuándo/para qué) y reportes.
6. Ser reutilizable por otros concilios mediante **branding** y **dominio propio**.

---

## 3) No objetivos
- No exportación a Excel/PDF.
- No mensajería externa (WhatsApp/SMS/email) en esta fase.
- No contabilidad avanzada, conciliación bancaria o facturación.
- No streaming ni LMS.

---

## 4) Usuarios, identidad y permisos

### 4.1 Autenticación
Soporta:
- Email + contraseña
- Número de identificación + contraseña

### 4.2 Reglas de membresía
- Un miembro pertenece a **una sola iglesia**.
- Se permite **traslado de iglesia con fecha efectiva** y **histórico** (dentro del mismo concilio).

### 4.3 Invitados
- Invitados (predicadores externos): registrar **nombre y apellido**.
- No se crea usuario para invitados.

### 4.4 Roles (fijos, no configurables por tenant)
**Administrativos**
- Administrador de concilio
- Administrador de iglesia
- Administrador de sociedad
- Administrador de miembros
- Administrador de servicios/actividades

**Funcionales/ministeriales**
- Pastor asignado
- Ujier
- Líder jóvenes
- Líder alabanza
- Líder niños
- Adorador
- Líder damas
- Líder caballeros
- Servidor

**Reglas**
- Un usuario puede tener múltiples roles.
- Solo existe **un Pastor Presidente del Concilio** por tenant.

---

## 5) Estructura organizacional

### 5.1 Concilio (Tenant)
- Unidad multi-tenant de la plataforma.
- Incluye sociedades (jóvenes/caballeros/damas/pastores/alabanza, etc.).

### 5.2 Iglesias (árbol)
- Jerarquía: madre → hijas → nietas.
- Registrar **pastor asignado** y su **histórico** (rotaciones/observaciones).

### Criterios de aceptación (estructura)
- Visualización del árbol de iglesias.
- Consulta del historial de pastores por iglesia.
- Traslado de un miembro con fecha efectiva y registro de histórico.

---

## 6) Reglas globales del calendario

### 6.1 Definición de cruce
- Hay cruce solo si existe **misma fecha y hora exacta**.

### 6.2 Prioridad
- Eventos del **Concilio** tienen prioridad sobre Iglesia/Sociedad.

### 6.3 Resolución de cruces
- El sistema **bloquea** la creación/edición del evento en conflicto y obliga a reprogramar manualmente.

### 6.4 Conflicto de asignación de personas
- Se permite asignar con **warning** si el conflicto es con eventos **no concilio**.
- Se **bloquea** la asignación **solo** si la persona ya está asignada a un **evento del concilio** en la misma fecha/hora.

### Criterios de aceptación (calendario)
- Si intento crear un evento de iglesia/sociedad en fecha/hora exacta de un evento de concilio → **bloqueo**.
- Si asigno una persona ya asignada a un evento del concilio en esa fecha/hora → **bloqueo**.
- Si asigno una persona con otro evento no concilio en esa fecha/hora → **warning** y se permite.

---

## 7) Módulo 1: Servicios

### 7.1 Definición
Entidad para programar servicios por iglesia/sociedad/concilio con categoría y asignaciones.

### 7.2 Categorías de servicio (configurables por concilio)
Cada concilio puede:
- Cambiar el **nombre** de la categoría.
- Definir/modificar la **plantilla de roles requeridos** por categoría.

Ejemplos base:
- Servicio de semana
- Jóvenes
- Evangelístico (con dirección/ciudad)
- Escuela dominical
- Pastores
- Santa cena

### 7.3 Plantillas por categoría
Una categoría define:
- Roles requeridos (ej. predicador, director, grupo de adoración/alabanza)
- Cantidad por rol
- Reglas opcionales (ej. “si no hay grupo, seleccionar 2 miembros”)

### 7.4 Servicio evangelístico
- Debe permitir registrar **punto geográfico/dirección/ciudad**.

### 7.5 Asignaciones
- Asignación de miembros a roles.
- Predicador puede ser:
  - miembro del concilio
  - invitado (nombre/apellido)

### 7.6 Solicitud de reemplazo / cambio
- La solicita el miembro asignado.
- El reemplazo lo propone el miembro, pero puede existir un responsable que asigne el reemplazo.
- Aprobación:
  - pastor de la iglesia que realiza el servicio **o**
  - líder creador del servicio

### Criterios de aceptación (Servicios)
- Crear/editar categoría y plantilla (roles + cantidades).
- Crear servicio y visualizar roles requeridos según plantilla.
- Asignar miembros e invitados a roles.
- Solicitud de reemplazo desde app por miembro asignado.
- Aprobación/rechazo por pastor o creador del servicio.
- Registro de historial de cambios.
- Aplicación de reglas de conflicto (bloqueo por cruce concilio y bloqueo de asignación por evento concilio).

---

## 8) Módulo 2: Actividades

### 8.1 Definición
Eventos no “servicio” (aseo, donaciones, canasta familiar, etc.) con calendarización y visibilidad configurable.

### 8.2 Visibilidad
- Visible solo para la iglesia que la crea **o**
- Visible para todo el concilio

### 8.3 Recurrencia
- Semanal / mensual / anual / día único (según necesidad del evento)

### Criterios de aceptación (Actividades)
- Crear actividad con visibilidad (solo iglesia / concilio).
- Ver actividades en calendario según permisos y visibilidad.
- Si cruza con evento concilio en fecha/hora exacta → **bloqueo** y reprogramación manual.

---

## 9) Cumpleaños y mensajería interna

### 9.1 Cumpleaños
- Visible por defecto a nivel concilio.
- Filtro por iglesia.

### 9.2 Mensajería
- Mensajería interna tipo chat/comentario.

### Criterios de aceptación
- Ver próximos cumpleaños (vista lista o mensual).
- Enviar mensaje interno a un miembro.

---

## 10) Donaciones / ofrendas / diezmos

### 10.1 Registro
- Trazabilidad: quién, cuándo, para qué.
- Permite aportes anónimos o privados.

### 10.2 Permisos
- Detalle por aportante: solo **Tesorería**.

### 10.3 Reportes
- Reportes por sociedad / iglesia / concilio.
- No se requiere exportación a Excel/PDF.

### Criterios de aceptación
- Tesorería registra un aporte (tipo, monto, fecha, propósito, aportante opcional/anónimo).
- Usuario no tesorería no puede ver detalle por aportante.
- Reportes agregados consultables por filtros.

---

## 11) Multitenancy, branding y personalización

### 11.1 Creación de tenant
- Solo por super-admin.

### 11.2 Branding del tenant
Incluye:
- Logo
- Colores
- Nombre
- Tipografía
- Dominio propio

### 11.3 Paleta por usuario
- Aplica solo a UI personal.
- No cambia elementos compartidos (calendario, reportes).

### Criterios de aceptación
- Aislamiento de datos estricto entre tenants.
- Branding aplicado por tenant.
- Preferencia de paleta guardada y aplicada en web/mobile.

---

## 12) Modelo de datos mínimo (MVP)

### Tenancy
- `Tenant (Concilio)`: id, nombre, branding (logo, colores, tipografía, dominio)

### Organización
- `Church (Iglesia)`: id, tenantId, name, parentChurchId (nullable), location
- `Society (Sociedad)`: id, tenantId, type, name

### Personas y pertenencia
- `Member`: id, tenantId, churchId (actual), identificacion, nombre, apellido, fechaNacimiento, contacto
- `MemberChurchHistory`: id, memberId, fromChurchId, toChurchId, effectiveDate, notes
- `Role` (enum fijo)
- `MemberRole`: memberId, role, scope (tenant/church/society), scopeId

### Pastores e histórico
- `PastorAssignmentHistory`: id, churchId, memberId, startDate, endDate, notes
- `ConcilioPresident`: tenantId, memberId (único)

### Servicios
- `ServiceCategory`: id, tenantId, name
- `ServiceTemplate`: id, categoryId, rolesRequired[] (roleName, qty, optionalRules)
- `ServiceEvent`: id, tenantId, scopeType (concilio/iglesia/sociedad), scopeId, categoryId, dateTime, location, createdBy
- `ServiceAssignment`: id, serviceEventId, roleName, memberId (nullable), guestName (nullable), status
- `ReplacementRequest`: id, serviceAssignmentId, requestedByMemberId, proposedReplacementMemberId, assignedResolverMemberId (nullable), status, approvedByMemberId (nullable), notes, timestamps

### Actividades
- `ActivityEvent`: id, tenantId, scopeType, scopeId, visibility (churchOnly/concilio), dateTime, recurrence, createdBy, optionalResponsibleMembers[]

### Mensajería
- `MessageThread` (opcional MVP): id, tenantId, type (direct/system), participants[]
- `Message`: id, threadId, senderId, content, createdAt

### Finanzas
- `Contribution`: id, tenantId, type (donación/ofrenda/diezmo), amount, date, purpose, isAnonymous, isPrivate, memberId (nullable), scopeType/scopeId

---

## 13) Backlog MVP (priorizado)

### MVP-1 (Core)
1. Multitenancy + creación de tenant por super-admin + branding
2. Iglesias (árbol) + sociedades
3. Miembros + roles + Pastor Presidente único
4. Traslado de miembro con fecha efectiva + histórico
5. Servicios:
   - categorías configurables por concilio
   - plantillas configurables por categoría
   - crear servicio + asignaciones (miembros/invitados)
   - cruce (fecha/hora exacta) + bloqueo
   - conflicto de asignación: bloquear solo si evento concilio
   - solicitudes de reemplazo + aprobación (pastor o creador)
6. Actividades:
   - crear actividad + visibilidad + recurrencia básica
   - cruces con concilio: bloqueo
7. Cumpleaños + mensajería interna básica
8. Aportes:
   - registro (incluye anónimo/privado)
   - permisos tesorería
   - reportes agregados por sociedad/iglesia/concilio

### MVP-2 (Mejoras)
- Auditoría completa (historial de cambios por entidad)
- Mejor UX de calendario (vistas, filtros avanzados, “mi agenda”)
- Mejoras de mensajería (hilos, menciones, notificaciones)
- Reglas avanzadas de recurrencia/excepciones

---

## 14) Definition of Done (MVP)
- Aislamiento por tenant verificado.
- Flujos end-to-end:
  - Crear servicio → asignar → solicitar reemplazo → aprobar → reflejar agenda
  - Crear evento concilio → intentar crear iglesia misma fecha/hora → bloqueo
  - Registrar aporte → visible en reportes → detalle solo tesorería
  - Traslado con fecha efectiva → histórico consultable
- Web + mobile muestran agenda/cumpleaños y permiten acciones clave (solicitud de reemplazo, mensajes).