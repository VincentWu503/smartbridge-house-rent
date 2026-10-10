export const formatRupiah = (amount) => {
  const numericAmount = Number(amount);
  const safeAmount = Number.isFinite(numericAmount) ? numericAmount : 0;

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(safeAmount);
};

export const getPropertyImages = (propertyImage) => {
  if (Array.isArray(propertyImage)) {
    return propertyImage.filter((image) => image && image.path);
  }

  return propertyImage && propertyImage.path ? [propertyImage] : [];
};

export const formatPropertyDate = (value, objectId) => {
  let dateValue = value;

  if (
    !dateValue &&
    typeof objectId === 'string' &&
    /^[a-f\d]{24}$/i.test(objectId)
  ) {
    dateValue = Number.parseInt(objectId.slice(0, 8), 16) * 1000;
  }

  if (!dateValue) {
    return 'Not recorded';
  }

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) {
    return 'Not recorded';
  }

  return new Intl.DateTimeFormat('en-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
};
