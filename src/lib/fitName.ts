import type { CSSProperties } from 'react'

// Nombre de caractères d'un nom affiché en très grand : la CSS (.fit-name) en déduit
// une taille de police qui tient toujours dans la largeur de son conteneur.
export const fitStyle = (name: string) => ({ '--chars': Math.max(4, [...name].length) }) as CSSProperties
