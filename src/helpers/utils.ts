import { Position } from "vscode";
import { ISettingsContainer } from "../settings";

export function getPascalCase(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getCamelCase(str: string): string {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

export function getClassName(fileName: string): string
{
    const specialCharIndex = fileName.indexOf('-');
    if (specialCharIndex !== -1) {
        return getPascalCase(fileName.substring(0, specialCharIndex))
                    .concat(getPascalCase(fileName.substring(specialCharIndex + 1, fileName.length)));
    } 
    else
    {
        return getPascalCase(fileName);
    }
}

export const invalidFileNames = /^(\d|\-)|[\\\s+={}\(\)\[\]"`/;,:.*?'<>|#$%^@!~&]|\-$/;

export function getLineNoFromString(str: string, match: string): Position {
  const array = str.substring(0, str.indexOf(match) + match.length).split('\n');
  console.log("Array");
  console.log(array)
  //const charPosition = str.split('\n')[array.length - 1].indexOf('\n');
  //console.log("Char pos");
  //console.log(charPosition)
  return new Position(array.length, 0);
}

export function transformModuleName(name: string, config: ISettingsContainer) {
  let transform = name.split("");
  if (config.configuration.naming.includes("upper")) {
    transform[0] = transform[0].toUpperCase();
  } else {
    transform[0] = transform[0].toLowerCase();
  }

  if (config.configuration.naming.includes("dot")) {
    transform.unshift(".");
  }

  return transform.join("");
}