import { registerDecorator } from "class-validator";

export function IsNotEmptyArray(message?: string) {
  return (object: Record<string, any>, propertyName: string) => {
    registerDecorator({
      name: "isNotEmptyArray",
      target: object.constructor,
      propertyName: propertyName,
      constraints: [message],
      options: { message: message || "The array must not be empty" }, // Use the custom error message or a default one
      validator: {
        validate<T>(value: T) {
          return Array.isArray(value) && value.length > 0;
        },
      },
    });
  };
}
