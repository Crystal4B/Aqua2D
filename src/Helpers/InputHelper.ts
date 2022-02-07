const VALID_TYPES = ['image/jpeg', 'image/png'];

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

const validateImage = (file: File) =>
{
	return VALID_TYPES.indexOf(file.type) !== -1;
}