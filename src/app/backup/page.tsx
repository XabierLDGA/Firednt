import type { Metadata } from "next";
import { ImportForm } from "@/components/backup/import-form";
import { IconDatabase, IconDownload, IconUpload } from "@/components/icons";
import { Page } from "@/components/page";
import { buttonStyles } from "@/components/ui";
import { importBackupAction } from "./actions";

export const metadata: Metadata = {
  title: "Copia de seguridad",
};

export default function BackupPage() {
  return (
    <Page icon={<IconDatabase />} title="Copia de seguridad">
      <div className="flex max-w-2xl flex-col gap-4 p-4 md:p-6">
        <section className="rounded-md border border-line bg-page p-5">
          <h2 className="flex items-center gap-2 font-medium text-fg">
            <IconDownload size={16} />
            Exportar
          </h2>
          <p className="mt-1 mb-4 text-fg-secondary">
            Descarga un archivo con todos tus proyectos, tareas y aprendizaje. Guárdalo fuera de
            este ordenador (en la nube o en otro disco) y haz una antes de actualizar firedn&apos;t.
          </p>
          {/* A plain link: the browser downloads the file the route returns. */}
          <a href="/backup/export" download className={buttonStyles.primary}>
            <IconDownload size={14} />
            Descargar copia
          </a>
        </section>

        <section className="rounded-md border border-tag-red bg-page p-5">
          <h2 className="flex items-center gap-2 font-medium text-fg">
            <IconUpload size={16} />
            Importar
          </h2>
          <p className="mt-1 mb-4 text-fg-secondary">
            Restaura una copia descargada antes. <strong className="text-fg">Reemplaza</strong>{" "}
            todos los datos actuales: si quieres conservarlos, exporta primero. Si el archivo no es
            válido, no se cambia nada.
          </p>
          <ImportForm action={importBackupAction} />
        </section>
      </div>
    </Page>
  );
}
