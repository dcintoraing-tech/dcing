"use client";

import { useEffect } from "react";

/**
 * Anima el favicon al cargar la página, con la misma secuencia del hero.
 *
 * Los navegadores no ejecutan la animación de un SVG puesto como favicon: lo
 * dibujan como imagen fija. La única vía que funciona es generar cada cuadro
 * en un canvas y reemplazar el href del <link>, que es lo que hace esto.
 *
 * Corre una sola vez y termina en el logo quieto; un favicon en bucle es
 * ruido permanente en la pestaña. Al acabar se devuelven los <link> originales
 * para que el icono vuelva a ser el SVG nítido en cualquier resolución.
 */

const LADO = 64;
/** Alto del monograma dentro del cuadro, en píxeles de canvas. */
const ALTO_MARCA = 40;
const ESCALA = ALTO_MARCA / 806;
const DESPLAZA_X = (LADO - 694 * ESCALA) / 2;
const DESPLAZA_Y = (LADO - ALTO_MARCA) / 2;

/** Mismos extremos que el hero: el aro se cierra exactamente en el disco. */
const ARO = { r: 430, grosor: 3 };
const DISCO = { r: 145.5, grosor: 291 };

const ANILLO = { inicio: 0, duracion: 780 };
const ASTA = { inicio: 360, duracion: 560 };
const FIN = ASTA.inicio + ASTA.duracion;

/** Salida suave, parecida a la curva que usa el resto del sitio. */
const suave = (t: number) => 1 - Math.pow(1 - t, 4);

function tramo(ahora: number, inicio: number, duracion: number) {
  return suave(Math.min(1, Math.max(0, (ahora - inicio) / duracion)));
}

function dibuja(ctx: CanvasRenderingContext2D, ahora: number) {
  ctx.clearRect(0, 0, LADO, LADO);

  ctx.fillStyle = "#141413";
  ctx.beginPath();
  if (typeof ctx.roundRect === "function") {
    ctx.roundRect(0, 0, LADO, LADO, 16);
  } else {
    ctx.rect(0, 0, LADO, LADO);
  }
  ctx.fill();

  ctx.save();
  ctx.translate(DESPLAZA_X, DESPLAZA_Y);
  ctx.scale(ESCALA, ESCALA);
  ctx.fillStyle = "#faf9f5";
  ctx.strokeStyle = "#faf9f5";

  const a = tramo(ahora, ANILLO.inicio, ANILLO.duracion);
  const radio = ARO.r + (DISCO.r - ARO.r) * a;
  const grosor = ARO.grosor + (DISCO.grosor - ARO.grosor) * a;

  // El aro se recorta al cuadro: al principio desborda el logo a propósito.
  ctx.save();
  ctx.beginPath();
  ctx.rect(-DESPLAZA_X / ESCALA, -DESPLAZA_Y / ESCALA, LADO / ESCALA, LADO / ESCALA);
  ctx.clip();
  ctx.beginPath();
  ctx.arc(291, 515, radio, 0, Math.PI * 2);
  ctx.lineWidth = grosor;
  ctx.stroke();
  ctx.restore();

  const b = tramo(ahora, ASTA.inicio, ASTA.duracion);
  if (b > 0) ctx.fillRect(515, 0, 179, 806 * b);

  ctx.restore();
}

export function AnimatedFavicon() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = document.createElement("canvas");
    canvas.width = LADO;
    canvas.height = LADO;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const originales = Array.from(
      document.querySelectorAll<HTMLLinkElement>('link[rel~="icon"]'),
    );
    originales.forEach((link) => link.remove());

    const link = document.createElement("link");
    link.rel = "icon";
    link.type = "image/png";
    document.head.appendChild(link);

    let cuadro = 0;
    let ultimo = -Infinity;
    const arranque = performance.now();
    let vivo = true;

    const paso = (ahora: number) => {
      if (!vivo) return;
      const t = ahora - arranque;

      // A 16 px no hace falta 60 fps, y cada cuadro cuesta un toDataURL.
      if (t - ultimo >= 45 || t >= FIN) {
        ultimo = t;
        dibuja(ctx, Math.min(t, FIN));
        link.href = canvas.toDataURL("image/png");
      }

      if (t < FIN) {
        cuadro = requestAnimationFrame(paso);
      } else {
        // Terminada la secuencia, el SVG original vuelve a mandar.
        link.remove();
        originales.forEach((original) => document.head.appendChild(original));
      }
    };

    cuadro = requestAnimationFrame(paso);

    return () => {
      vivo = false;
      cancelAnimationFrame(cuadro);
      link.remove();
      originales.forEach((original) => {
        if (!original.isConnected) document.head.appendChild(original);
      });
    };
  }, []);

  return null;
}
