const VALID_TYPES = ['image/jpeg', 'image/png'];

/**
 * Function for getting the URL of a file
 * @param owner The element owning the files
 * @returns url of the file if found null otherwise
 */
export const extractFilesAsURL = (owner: DataTransfer | HTMLInputElement) =>
{
	const files = owner.files;
	if (files !== null && files.length)
	{
		var file = files[0];
		if (validateImage(file))
		{
			const url = URL.createObjectURL(file);
			return url;
		}
	}
	return null;
}

/**
 * Function for validating that a file is an image
 * @param file being checked
 * @returns boolean value defining image validaty
 */
const validateImage = (file: File) =>
{
	return VALID_TYPES.indexOf(file.type) !== -1;
}