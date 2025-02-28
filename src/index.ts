import { readFile } from "fs/promises"
import type * as nbformat from "@jupyterlab/nbformat"

export async function convertNotebook(filePath: string) {
  const fileContent = await readFile(filePath, { encoding: "utf-8" })

  const contentAsJson = JSON.parse(fileContent) as nbformat.INotebookContent

  const content = []
  // console.dir({ contentAsJson }, { depth: null })

  for (const cell of contentAsJson.cells) {
    switch (cell.cell_type) {
      case "code":
        content.push(handleCodeCell(cell as nbformat.ICodeCell, contentAsJson.metadata))
        break
      case "markdown":
        if (Array.isArray(cell.source)) {
          content.push(cell.source.join(""))
        } else {
          content.push(cell.source)
        }
        content.push("")
        break
    }
  }

  //console.dir({ content }, { depth: null })
}

function handleCodeCell(cell: nbformat.ICodeCell, notebookMetadata: nbformat.INotebookMetadata) {
  if (cell.source.length > 0 && cell.outputs.length == 0) {
    return renderSource(cell, notebookMetadata)
  }

  if (cell.source.length == 0 && cell.outputs.length > 0) {
    return renderOutput(cell.outputs, notebookMetadata)
  }

  return [
    renderSource(cell, notebookMetadata),
    "",
    renderOutput(cell.outputs, notebookMetadata),
  ].join("")
}

function renderSource(cell: nbformat.ICodeCell, notebookMetadata: nbformat.INotebookMetadata) {
  const syntax = getCodeLanguage(cell, notebookMetadata)

  return `
\`\`\`${syntax}
${cell.source}
\`\`\`
  `
}

function getCodeLanguage(
  cell: nbformat.ICodeCell,
  notebookMetadata: nbformat.INotebookMetadata,
): string {
  //@ts-expect-error unknown `languageId`
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return cell.metadata.vscode?.languageId ?? notebookMetadata.language_info?.name ?? "python"
}

function renderOutput(cell: nbformat.IOutput[], _notebookMetadata: nbformat.INotebookMetadata) {
  // eslint-disable-next-line no-console
  console.dir({ cell }, { depth: null })
}
