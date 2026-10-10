const editableFields = [
  'propertyType',
  'propertyAdType',
  'propertyAddress',
  'ownerContact',
  'additionalInfo',
  'isAvailable',
];

const buildPropertyUpdate = (req, property) => {
  const body = req.body || {};
  const updates = {};

  editableFields.forEach((field) => {
    if (body[field] !== undefined) {
      updates[field] = body[field];
    }
  });

  if (body.propertyAmt !== undefined) {
    const amount = Number(body.propertyAmt);
    if (!Number.isFinite(amount) || amount < 0) {
      const error = new Error('Price must be a valid non-negative number.');
      error.statusCode = 400;
      throw error;
    }
    updates.propertyAmt = amount;
  }

  if (
    updates.isAvailable !== undefined &&
    !['Available', 'Unavailable'].includes(updates.isAvailable)
  ) {
    const error = new Error('Availability must be Available or Unavailable.');
    error.statusCode = 400;
    throw error;
  }

  return updates;
};

module.exports = {
  buildPropertyUpdate,
};
