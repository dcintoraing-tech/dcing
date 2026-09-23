/** Normaliza un celular mexicano a formato internacional sin signos. */
export function telefonoInternacional(celular: string) {
  const digitos = celular.replace(/\D/g, "");
  if (digitos.length === 10) return `52${digitos}`;
  if (digitos.length === 12 && digitos.startsWith("52")) return digitos;
  if (digitos.length === 13 && digitos.startsWith("521")) return `52${digitos.slice(3)}`;
  return digitos;
}

/** Enlace wa.me con el mensaje listo: el administrador solo lo envía. */
export function enlaceWhatsApp(celular: string, mensaje: string) {
  return `https://wa.me/${telefonoInternacional(celular)}?text=${encodeURIComponent(mensaje)}`;
}
