import * as fs from "fs-extra";
import { render } from "mustache";
import { join, basename } from "path";
import { getClassName, getPascalCase } from "./utils";

type TemplateType = "controller" | "middleware" | "service";

export async function getFileTemplate(name: string, type: TemplateType, settings: Object): Promise<string> {
  return fs.readFile(join(__dirname, `/../templates/${type}.mustache`), 'utf8')
      .then((data) => {
          const className = getClassName(name);
          let view = {
              Name: className,
              LowercaseName: className.toLowerCase(),
              settings
          };
          return render(data, view);
      });
}