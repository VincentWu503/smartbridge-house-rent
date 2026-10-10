const userSchema = require('../models/UserSchema');
const propertySchema = require('../models/PropertySchema');
const bookingSchema = require('../models/BookingSchema');
const { buildPropertyUpdate } = require('../utils/propertyUpdate');

/////////getting all users///////////////
const getAllUsersController = async (req, res) => {
  try {
    const allUsers = await userSchema.find({});
    if (!allUsers) {
      return res.status(401).send({
        success: false,
        message: 'No users presents',
      });
    } else {
      return res.status(200).send({
        success: true,
        message: 'All users',
        data: allUsers,
      });
    }
  } catch (error) {
    console.log('Error in get All Users Controller ', error);
  }
};

/////////handling status for owner/////////
const handleStatusController = async (req, res) => {
  const { userid, status } = req.body;
  try {
    const user = await userSchema.findByIdAndUpdate(
      userid,
      { granted: status },
      { new: true },
    );
    return res.status(200).send({
      success: true,
      message: `User has been ${status}`,
    });
  } catch (error) {
    console.log('Error in get All Users Controller ', error);
  }
};

/////////getting all properties in app//////////////
const getAllPropertiesController = async (req, res) => {
  try {
    const allProperties = await propertySchema.find({});
    if (!allProperties) {
      return res.status(401).send({
        success: false,
        message: 'No properties presents',
      });
    } else {
      return res.status(200).send({
        success: true,
        message: 'All properties',
        data: allProperties,
      });
    }
  } catch (error) {
    console.log('Error in get All Users Controller ', error);
  }
};

////////get all bookings////////////
const getAllBookingsController = async (req, res) => {
  try {
    const allBookings = await bookingSchema.find();
    return res.status(200).send({
      success: true,
      data: allBookings,
    });
  } catch (error) {
    console.log('Error in get All Users Controller ', error);
  }
};

const updatePropertyController = async (req, res) => {
  try {
    const property = await propertySchema.findById(req.params.propertyid);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found.',
      });
    }

    Object.assign(property, buildPropertyUpdate(req, property));
    await property.save();
    return res.status(200).json({
      success: true,
      message: 'Property updated successfully.',
    });
  } catch (error) {
    console.error('Error updating property as admin:', error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to update property.',
    });
  }
};

module.exports = {
  getAllUsersController,
  handleStatusController,
  getAllPropertiesController,
  getAllBookingsController,
  updatePropertyController,
};
