import { ResponseError } from "@/types/shared";
import * as Yup from "yup";

/**
 * Validates all fields in the provided form data using the specified Yup schema.
 *
 * This function runs full-form validation (i.e., all fields are validated even if some fail).
 * It returns an object containing error messages for each field, or empty strings if all fields are valid.
 *
 * @template T - The shape of the form data object.
 *
 * @param formSchema - A Yup schema defining validation rules for the form fields.
 * @param formData - An object representing the current values of the form fields.
 *
 * @returns An object containing:
 *  - `outputResult`: A record where each key corresponds to a form field and maps to either an error message (if invalid) or an empty string (if valid).
 *  - `isInvalid`: A boolean indicating whether the form contains any validation errors.
 *
 * @example
 * const schema = Yup.object({
 *   name: Yup.string().required("Name is required"),
 *   age: Yup.number().required("Age is required").min(18, "Must be at least 18")
 * });
 *
 * const data = { name: "", age: 15 };
 *
 * const { outputResult, isInvalid } = await validateAllInputs(schema, data);
 * // outputResult = { name: "Name is required", age: "Must be at least 18" }
 * // isInvalid = true
 */
export const validateAllInputs = async <T>(
    formSchema: Yup.Schema,
    formData: T
) => {
    const outputResult: { [key in keyof T]: string } = {} as {
        [key in keyof T]: string;
    };

    let invalid = true;

    try {
        // Validate the entire form data; don't stop at the first error.
        await formSchema.validate(formData, { abortEarly: false });

        invalid = false;

        // If validation passes, set all fields to empty string (no errors).
        for (const paramName in formData) {
            const key = paramName as keyof T;
            outputResult[key] = "";
        }
    } catch (err) {
        // If the error is not a Yup validation error, exit early.
        if (!(err instanceof Yup.ValidationError)) return;

        // err.inner contains all validation errors.
        err.inner.forEach((error) => {
            if (error.path) {
                const keyPath = error.path as keyof T;
                outputResult[keyPath] = error.message;
            }
        });
    }

    return {
        outputResult: {
            ...outputResult,
        },
        isInvalid: invalid,
    };
};

/**
 * Validates a single input field in the form.
 *
 * @param formSchema - The Yup schema that includes validation rules.
 * @param inputName - The name of the input field to validate.
 * @param newValue - The new value for that specific input.
 * @returns An empty string if valid, or an error message if invalid.
 */
export const validateInput = async (
    formSchema: Yup.Schema,
    inputName: string,
    newValue: string
) => {
    try {
        // Construct a minimal form data object with just the field to validate.
        const newFormDataToCheck = { [inputName]: newValue };

        // Log the current input being validated for debugging.
        // console.log("shared", { ...newFormDataToCheck });

        // Validate only the specified field.
        await formSchema.validateAt(inputName, newFormDataToCheck);

        return ""; // No error.
    } catch (err) {
        // Return nothing if the error is not a Yup validation error.
        if (err instanceof Yup.ValidationError == false) return;

        return err.message; // Return the validation error message.
    }
};
/**
 * errorHandler Utility Function
 * Purpose:
 *    This function standardizes error handling across the application.
 *    It extracts and returns a user-friendly error message from an error object,
 *    typically coming from Axios or Fetch API requests.
 * Usage:
 *    Use this function inside service functions to normalize error messages
 *    before throwing them to the UI layer.
 *
 * @param {any} error - The error object caught in a catch block.
 * @returns {string} - A user-friendly error message.
 */
export const errorHandler = (error: any): string => {
    // Check if server responded with a message
    if (error.response?.data?.message) return error.response.data.message;

    // If a generic error message exists, return it
    if (error.message) return error.message;

    // Default fallback message
    return "Something went wrong. Please try again.";
};
/**
 * Handles and throws descriptive error messages from a failed HTTP response.
 *
 * This utility function is typically used in service layers to extract and throw
 * appropriate error messages from a response object, often returned from a `fetch` request.
 *
 * @async
 * @function
 * @param {Response} response - The HTTP response object returned by a failed request.
 * @param {string} serviceMessage - A custom fallback message describing the service action (e.g., "fetch user data").
 *
 * @throws {Error} - Throws an error with one of the following messages:
 * - A concatenated string of messages from `errorData.errors` if it exists and is an object.
 * - A single error message from `errorData.message` if it exists.
 * - A fallback message using the provided `serviceMessage` if no detailed error is available.
 *
 * @example
 * try {
 *   const response = await fetch('/api/some-endpoint');
 *   if (!response.ok) {
 *     await responseErrorServiceHandler(response, 'fetch data');
 *   }
 * } catch (error) {
 *   console.error(error.message);
 * }
 */
export const responseErrorServiceHandler = async (
    response: Response,
    serviceMessage: string
) => {
    const contentType = response.headers.get("content-type");

    if (!contentType?.includes("json")) {
        console.log("not json");
        throw new Error(`Failed to ${serviceMessage}!`);
    }

    const errorData = (await response.json()) as ResponseError;

    // if (errorData && errorData.errors && typeof errorData.errors === "object") {
    //     const messages = [...Object.values(errorData.errors)].join(", ");
    //     throw new Error(messages);
    // }
    if (errorData && errorData.error?.message) {
        throw new Error(errorData.error.message);
    }
    throw new Error(`Failed to ${serviceMessage}!`);
};
