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
