import path from "path"
import { cwd } from "process"
import { test } from "vitest"

import { convertNotebook } from "../src"

/**
 * Data Analytics Notebook:
 * https://github.com/rahulbot/notebook-examples/blob/master/example-data-analysis.ipynb
 */

test("todo", async () => {
  await convertNotebook(path.join(cwd(), `tests/example/example-data-analysis.ipynb`))
})
