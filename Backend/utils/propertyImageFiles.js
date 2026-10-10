const fs = require('fs/promises');
const path = require('path');

const uploadDirectory = path.resolve(__dirname, '..', 'uploads');
const uploadUrlPrefix = '/uploads/';

const getImages = (value) => {
  if (Array.isArray(value)) return value.filter((image) => image?.path);
  return value?.path ? [value] : [];
};

const getSafeUploadPath = (imagePath) => {
  if (typeof imagePath !== 'string' || !imagePath.startsWith(uploadUrlPrefix)) {
    return null;
  }

  const filename = imagePath.slice(uploadUrlPrefix.length);
  if (
    !filename ||
    filename === '.' ||
    filename === '..' ||
    filename.includes('/') ||
    filename.includes('\\')
  ) {
    return null;
  }

  const absolutePath = path.resolve(uploadDirectory, filename);
  if (path.dirname(absolutePath) !== uploadDirectory) return null;
  return absolutePath;
};

const removeUnreferencedPropertyImages = async (propertyModel, images) => {
  const candidateImages = getImages(images);
  if (!candidateImages.length) return [];

  let properties;
  try {
    properties = await propertyModel.find({}).select('propertyImage').lean();
  } catch (error) {
    console.error(
      'Could not verify property image references before cleanup:',
      error,
    );
    return candidateImages.map((image) => image.path);
  }
  const referencedPaths = new Set(
    properties.flatMap((property) =>
      getImages(property.propertyImage).map((image) => image.path),
    ),
  );
  const failures = [];

  for (const image of candidateImages) {
    if (referencedPaths.has(image.path)) continue;

    const absolutePath = getSafeUploadPath(image.path);
    if (!absolutePath) {
      failures.push(image.path);
      console.error(
        'Skipped deleting an unsafe property image path:',
        image.path,
      );
      continue;
    }

    try {
      await fs.unlink(absolutePath);
    } catch (error) {
      if (error.code !== 'ENOENT') {
        failures.push(image.path);
        console.error(`Failed to delete property image ${image.path}:`, error);
      }
    }
  }

  return failures;
};

module.exports = {
  removeUnreferencedPropertyImages,
};
