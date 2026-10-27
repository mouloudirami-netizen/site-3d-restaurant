/** Chemin d'un fichier de public/media, compatible avec un site servi depuis un sous-dossier. */
export const mediaUrl = (file: string) => `${import.meta.env.BASE_URL}media/${file}`;
