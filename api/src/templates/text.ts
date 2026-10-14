export const escapeXml = (value: string) => value.replace(/[<>&"']/g, (char) => `&#${char.charCodeAt(0)};`);

export const format = (value: string, maxLength: number) => escapeXml(value.toUpperCase().slice(0, maxLength));
