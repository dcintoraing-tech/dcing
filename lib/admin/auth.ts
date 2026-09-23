import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE = "dcing_admin";
const DURACION_MS = 7 * 24 * 60 * 60 * 1000;

function secreto() {
  const valor = process.env.ADMIN_SESSION_SECRET;
  if (!valor || valor.length < 16) {
    throw new Error(
      "Falta ADMIN_SESSION_SECRET (mínimo 16 caracteres). Genera uno con: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\"",
    );
  }
  return valor;
}

export function adminConfigurado() {
  return Boolean(process.env.ADMIN_PASSWORD && process.env.ADMIN_SESSION_SECRET);
}

function comparaSegura(a: string, b: string) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

function firma(expira: number) {
  return createHmac("sha256", secreto()).update(String(expira)).digest("hex");
}

export function passwordCorrecta(intento: string) {
  const esperada = process.env.ADMIN_PASSWORD;
  if (!esperada) return false;
  return comparaSegura(intento, esperada);
}

export async function abrirSesion() {
  const expira = Date.now() + DURACION_MS;
  const almacen = await cookies();
  almacen.set(COOKIE, `${expira}.${firma(expira)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: DURACION_MS / 1000,
  });
}

export async function cerrarSesion() {
  const almacen = await cookies();
  almacen.delete(COOKIE);
}

export async function haySesion() {
  if (!process.env.ADMIN_SESSION_SECRET) return false;

  const valor = (await cookies()).get(COOKIE)?.value;
  if (!valor) return false;

  const [expiraTexto, recibida] = valor.split(".");
  const expira = Number(expiraTexto);
  if (!expira || Number.isNaN(expira) || expira < Date.now()) return false;
  if (!recibida) return false;

  return comparaSegura(recibida, firma(expira));
}

/** Puerta para páginas y acciones del panel. */
export async function requiereSesion() {
  if (!(await haySesion())) redirect("/admin/login");
}
