import axios from "axios";
import React, { useState, useEffect } from "react";
import Toast from "../common/Toast";
import {
  formatPropertyDate,
  formatRupiah,
  getPropertyImages,
} from "./propertyDisplay";

const getStoredFavorites = () => {
  try {
    const storedFavorites = localStorage.getItem("favoriteProperties");
    const parsedFavorites = storedFavorites ? JSON.parse(storedFavorites) : [];
    return Array.isArray(parsedFavorites) ? parsedFavorites.map(String) : [];
  } catch (error) {
    console.error("Failed to load favorite properties:", error);
    return [];
  }
};

const AllPropertiesCards = ({ loggedIn }) => {
  const [allProperties, setAllProperties] = useState([]);
  const [filterPropertyType, setPropertyType] = useState("");
  const [filterPropertyAdType, setPropertyAdType] = useState("");
  const [filterPropertyAddress, setPropertyAddress] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState(getStoredFavorites);
  const [showModal, setShowModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [reportingProperty, setReportingProperty] = useState(null);
  const [reportReason, setReportReason] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const [reportPhone, setReportPhone] = useState("");
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [cardImageIndexes, setCardImageIndexes] = useState({});
  const [userDetails, setUserDetails] = useState({ fullName: "", phone: "" });
  const [toast, setToast] = useState({ show: false, type: "", message: "" });

  const toggleFavorite = (propertyId) => {
    const propertyIdString = String(propertyId);
    const updatedFavorites = favoriteIds.includes(propertyIdString)
      ? favoriteIds.filter((id) => id !== propertyIdString)
      : [...favoriteIds, propertyIdString];

    try {
      localStorage.setItem(
        "favoriteProperties",
        JSON.stringify(updatedFavorites)
      );
      setFavoriteIds(updatedFavorites);
    } catch (error) {
      console.error("Failed to save favorite properties:", error);
    }
  };

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
  };

  const getAllProperties = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/user/getAllProperties`,
        { withCredentials: true }
      );
      setAllProperties(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleBooking = async (status, propertyId, ownerId) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/bookinghandle/${propertyId}`,
        { userDetails, status, ownerId },
        { withCredentials: true }
      );

      if (res.data.success) {
        showToast(res.data.message);
        setShowModal(false);
      } else {
        showToast(res.data.message);
      }
    } catch (error) {
      console.log(error);
      showToast("Booking failed");
    }
  };

  const closeReportForm = () => {
    if (isSubmittingReport) return;
    setReportingProperty(null);
    setReportReason("");
    setReportDescription("");
    setReportPhone("");
  };

  const handleReportSubmit = async (event) => {
    event.preventDefault();
    if (!reportingProperty || isSubmittingReport) return;

    setIsSubmittingReport(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/reports`,
        {
          ownerId: reportingProperty.ownerId,
          reason: reportReason,
          description: reportDescription.trim(),
          userPhoneNumber: reportPhone.trim(),
        },
        { withCredentials: true }
      );

      if (!response.data.success) {
        showToast("error", response.data.message || "Unable to submit report.");
        return;
      }

      showToast("success", response.data.message || "Report submitted.");
      setReportingProperty(null);
      setReportReason("");
      setReportDescription("");
      setReportPhone("");
    } catch (error) {
      console.error("Failed to submit owner report:", error);
      showToast(
        "error",
        error.response?.data?.message || "Unable to submit report."
      );
    } finally {
      setIsSubmittingReport(false);
    }
  };

  useEffect(() => {
    getAllProperties();
  }, []);

  const filteredProperties = allProperties
    .filter(
      (property) =>
        filterPropertyAddress === "" ||
        property.propertyAddress
          .toLowerCase()
          .includes(filterPropertyAddress.toLowerCase())
    )
    .filter(
      (property) =>
        filterPropertyAdType === "" ||
        property.propertyAdType
          .toLowerCase()
          .includes(filterPropertyAdType.toLowerCase())
    )
    .filter(
      (property) =>
        filterPropertyType === "" ||
        property.propertyType
          .toLowerCase()
          .includes(filterPropertyType.toLowerCase())
    )
    .filter((property) => {
      if (minPrice === "" && maxPrice === "") return true;

      const price = Number(property.propertyAmt);
      if (!Number.isFinite(price)) return false;

      return (
        (minPrice === "" || price >= Number(minPrice)) &&
        (maxPrice === "" || price <= Number(maxPrice))
      );
    })
    .filter(
      (property) =>
        !showFavoritesOnly || favoriteIds.includes(String(property._id))
    );

  const openModal = (property) => {
    setSelectedProperty(property);
    setSelectedImageIndex(0);
    setShowModal(true);
  };
  const selectedImages = getPropertyImages(selectedProperty?.propertyImage);
  const activeModalImageIndex = selectedImages.length
    ? selectedImageIndex % selectedImages.length
    : 0;
  const selectedImage = selectedImages[activeModalImageIndex];

  const changeCardImage = (propertyId, imageCount, direction) => {
    setCardImageIndexes((indexes) => {
      const currentIndex = indexes[propertyId] || 0;
      return {
        ...indexes,
        [propertyId]: (currentIndex + direction + imageCount) % imageCount,
      };
    });
  };

  const changeModalImage = (direction) => {
    if (!selectedImages.length) return;
    setSelectedImageIndex(
      (index) => (index + direction + selectedImages.length) % selectedImages.length
    );
  };

  return (
    <div className="p-6 text-white">
      {toast.show && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center mb-6">
        <input
          type="text"
          placeholder="Search by Address"
          value={filterPropertyAddress}
          onChange={(e) => setPropertyAddress(e.target.value)}
          aria-label="Search by address"
          className="bg-gray-800/70 border border-gray-700 p-2 rounded w-full sm:w-1/3 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500"
        />
        <select
          value={filterPropertyAdType}
          onChange={(e) => setPropertyAdType(e.target.value)}
          aria-label="Filter by ad type"
          className="bg-gray-800/70 border border-gray-700 p-2 rounded text-white focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All Ad Types</option>
          <option value="sale">Sale</option>
          <option value="rent">Rent</option>
        </select>
        <select
          value={filterPropertyType}
          onChange={(e) => setPropertyType(e.target.value)}
          aria-label="Filter by property type"
          className="bg-gray-800/70 border border-gray-700 p-2 rounded text-white focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All Types</option>
          <option value="commercial">Commercial</option>
          <option value="land/plot">Land/Plot</option>
          <option value="residential">Residential</option>
        </select>
        <input
          type="number"
          min="0"
          placeholder="Minimum price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          aria-label="Minimum price"
          className="bg-gray-800/70 border border-gray-700 p-2 rounded w-full sm:w-40 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="number"
          min="0"
          placeholder="Maximum price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          aria-label="Maximum price"
          className="bg-gray-800/70 border border-gray-700 p-2 rounded w-full sm:w-40 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="button"
          onClick={() => setShowFavoritesOnly((showing) => !showing)}
          aria-pressed={showFavoritesOnly}
          className={`px-4 py-2 rounded transition ${
            showFavoritesOnly
              ? "bg-yellow-400 text-white"
              : "border border-yellow-400 text-yellow-300 hover:bg-yellow-400 hover:text-white"
          }`}
        >
          {showFavoritesOnly ? "Show All Properties" : `Favorites (${favoriteIds.length})`}
        </button>
      </div>

      {/* Property Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.length > 0 ? (
          filteredProperties.map((property) => (
            <div
              key={property._id}
              className="relative bg-gray-800/70 border border-gray-700 rounded-lg shadow-lg hover:shadow-indigo-600/40 transition transform hover:-translate-y-1 overflow-hidden"
            >
              {(() => {
                const images = getPropertyImages(property.propertyImage);
                const imageIndex = images.length
                  ? (cardImageIndexes[property._id] || 0) % images.length
                  : 0;
                const image = images[imageIndex];

                return (
                  <div className="relative">
                    {image ? (
                      <img
                        src={`${import.meta.env.VITE_API_URL}${image.path}`}
                        alt={`${property.propertyAddress || "Property"} image ${imageIndex + 1}`}
                        className="w-full h-40 object-cover"
                      />
                    ) : (
                      <div className="w-full h-40 flex items-center justify-center bg-gray-900 text-gray-400">
                        No property image
                      </div>
                    )}
                    {images.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={() => changeCardImage(property._id, images.length, -1)}
                          aria-label={`Previous image for ${property.propertyAddress || "property"}`}
                          className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/70 px-3 py-1 text-xl text-white hover:bg-black"
                        >
                        </button>
                        <button
                          type="button"
                          onClick={() => changeCardImage(property._id, images.length, 1)}
                          aria-label={`Next image for ${property.propertyAddress || "property"}`}
                          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/70 px-3 py-1 text-xl text-white hover:bg-black"
                        >
                        </button>
                        <span className="absolute bottom-2 right-2 rounded bg-black/70 px-2 py-1 text-xs text-white">
                          {imageIndex + 1} / {images.length}
                        </span>
                      </>
                    )}
                  </div>
                );
              })()}
              <button
                type="button"
                onClick={() => toggleFavorite(property._id)}
                aria-label={
                  favoriteIds.includes(String(property._id))
                    ? "Remove from favorites"
                    : "Add to favorites"
                }
                aria-pressed={favoriteIds.includes(String(property._id))}
                className={`absolute top-3 right-3 z-10 aspect-square rounded-full bg-black/70 px-2 py-1 text-2xl leading-none transition ${
                  favoriteIds.includes(String(property._id))
                    ? "text-yellow-200"
                    : "text-white hover:text-yellow-100"
                }`}
              >
                {favoriteIds.includes(String(property._id)) ? "★" : "✰"}
              </button>
              <div className="p-4">
                <h3 className="font-semibold text-lg text-white">{property.propertyAddress}</h3>
                <p className="text-gray-400 text-sm">
                  {property.propertyType} - {property.propertyAdType}
                </p>
                <p className="mt-2 text-sm">
                  <b>Price:</b> {formatRupiah(property.propertyAmt)}
                </p>
                <p className="text-sm">
                  <b>Owner:</b> {property.ownerName}
                </p>
                <div className="mt-3 space-y-1 border-t border-gray-700 pt-3 text-xs text-gray-400">
                  <p>
                    <b>Posted:</b> {formatPropertyDate(property.createdAt, property._id)}
                  </p>
                  <p>
                    <b>Last updated:</b> {formatPropertyDate(property.updatedAt)}
                  </p>
                </div>
                {property.isAvailable === "Available" ? (
                  <p className="text-center mt-2 text-green-400 text-xs">Available</p>
                ) : (
                  <p className="text-center mt-2 text-red-400 text-xs">Not Available</p>
                )}
                {property.isAvailable === "Available" ? (

                    <button
                      onClick={() => openModal(property)}
                      className="mt-3 w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
                    >
                      Get Info / Book
                    </button>
                ) : (
                    <button
                      onClick={() => openModal(property)}
                      disabled
                      className="mt-3 w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition
                        disabled:bg-gray-600 disabled:cursor-not-allowed disabled:pointer-events-none
                      "
                    >
                      Out of Order
                    </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setReportingProperty(property);
                    setReportReason("");
                    setReportDescription("");
                    setReportPhone("");
                  }}
                  className="mt-2 w-full text-sm text-red-300 underline decoration-red-300/60 underline-offset-2 hover:text-red-200"
                >
                  Report owner
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400">
            {showFavoritesOnly
              ? "No favorite properties match these filters."
              : "No properties available at the moment."}
          </p>
        )}
      </div>

      {reportingProperty && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeReportForm();
          }}
        >
          <form
            onSubmit={handleReportSubmit}
            className="w-full max-w-lg space-y-4 rounded-xl border border-gray-700 bg-gray-900 p-6 text-white shadow-2xl"
            aria-labelledby="report-owner-title"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 id="report-owner-title" className="text-xl font-bold text-red-300">
                  Report owner
                </h3>
                <p className="mt-1 text-sm text-gray-400">
                  Property: {reportingProperty.propertyAddress}
                </p>
              </div>
              <button
                type="button"
                onClick={closeReportForm}
                disabled={isSubmittingReport}
                aria-label="Close report form"
                className="text-gray-400 hover:text-white disabled:opacity-50"
              >
                ✕
              </button>
            </div>

            <fieldset>
              <legend className="mb-2 text-sm font-medium text-gray-200">
                Reason for report
              </legend>
              <div className="space-y-2">
                {[
                  { value: "scam", label: "Scam" },
                  { value: "fake post", label: "Fake post" },
                ].map((reason) => (
                  <label
                    key={reason.value}
                    className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm hover:border-red-400"
                  >
                    <input
                      type="radio"
                      name="reportReason"
                      value={reason.value}
                      checked={reportReason === reason.value}
                      onChange={(event) => setReportReason(event.target.value)}
                      required
                      className="accent-red-500"
                    />
                    <span>{reason.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <label className="block text-sm font-medium text-gray-200">
              Description
              <textarea
                value={reportDescription}
                onChange={(event) => setReportDescription(event.target.value)}
                required
                minLength={1}
                maxLength={2000}
                rows={4}
                placeholder="Describe why you are reporting this owner or property."
                className="mt-1 w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder-gray-500 focus:border-red-400 focus:outline-none"
              />
            </label>

            <label className="block text-sm font-medium text-gray-200">
              Your phone number
              <input
                type="text"
                inputMode="tel"
                value={reportPhone}
                onChange={(event) => setReportPhone(event.target.value)}
                required
                maxLength={30}
                autoComplete="tel"
                placeholder="Phone number admin can use to contact you"
                className="mt-1 w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder-gray-500 focus:border-red-400 focus:outline-none"
              />
            </label>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={closeReportForm}
                disabled={isSubmittingReport}
                className="rounded-lg border border-gray-600 px-4 py-2 hover:bg-gray-800 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmittingReport || !reportReason}
                className="rounded-lg bg-red-600 px-4 py-2 font-semibold hover:bg-red-700 disabled:cursor-wait disabled:opacity-50"
              >
                {isSubmittingReport ? "Submitting..." : "Submit report"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Booking Modal */}
      {showModal && selectedProperty && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50 backdrop-blur-sm">
          <div className="bg-gray-900 p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto relative border border-gray-700 shadow-xl">
            <button
              onClick={() => setShowModal(false)}
              type="button"
              aria-label="Close property information"
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
            >
              ✖
            </button>
            <h3 className="text-xl font-bold mb-4 text-white">Property Info</h3>
            <div className="relative mb-4">
              {selectedImage ? (
                <img
                  src={`${import.meta.env.VITE_API_URL}${selectedImage.path}`}
                  alt={`${selectedProperty.propertyAddress || "Property"} image ${selectedImageIndex + 1}`}
                  className="w-full h-64 object-cover rounded"
                />
              ) : (
                <div className="h-64 flex items-center justify-center rounded bg-gray-800 text-gray-400">
                  No property images available
                </div>
              )}
              {selectedImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => changeModalImage(-1)}
                    aria-label="Previous property image"
                    className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/70 px-3 py-2 text-white hover:bg-black"
                  >
                  ‹
                  </button>
                  <button
                  type="button"
                  onClick={() => changeModalImage(1)}
                    aria-label="Next property image"
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/70 px-3 py-2 text-white hover:bg-black"
                  >
                  ›
                  </button>
                  <span className="absolute bottom-3 right-3 rounded bg-black/70 px-2 py-1 text-xs text-white">
                  {activeModalImageIndex + 1} / {selectedImages.length}
                  </span>
                </>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
              <div>
                <p>
                  <b>Owner Contact:</b> {loggedIn ? (selectedProperty.ownerContact) : ('Please login to see owner contact info.')}
                </p>
                <p>
                  <b>Availability:</b> {selectedProperty.isAvailable}
                </p>
                <p>
                  <b>Price:</b> {formatRupiah(selectedProperty.propertyAmt)}
                </p>
              </div>
              <div>
                <p>
                  <b>Location:</b> {selectedProperty.propertyAddress}
                </p>
                <p>
                  <b>Type:</b> {selectedProperty.propertyType}
                </p>
                <p>
                  <b>Ad Type:</b> {selectedProperty.propertyAdType}
                </p>
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-300">
              <b>Additional Info:</b> {selectedProperty.additionalInfo}
            </p>
            <div className="mt-3 space-y-1 border-t border-gray-700 pt-3 text-xs text-gray-400">
              <p>
                <b>Posted:</b> {formatPropertyDate(selectedProperty.createdAt, selectedProperty._id)}
              </p>
              <p>
                <b>Last updated:</b> {formatPropertyDate(selectedProperty.updatedAt)}
              </p>
            </div>

            {/* Booking Form */}
            <form
              className="mt-4 space-y-2"
              onSubmit={(e) => {
                e.preventDefault();
                handleBooking("pending", selectedProperty._id, selectedProperty.ownerId);
              }}
            >
              <input
                type="text"
                name="fullName"
                placeholder="Your Full Name"
                required
                className="bg-gray-800 border border-gray-700 p-2 w-full rounded text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500"
                value={userDetails.fullName}
                onChange={(e) =>
                  setUserDetails({ ...userDetails, fullName: e.target.value })
                }
              />
              <input
                type="number"
                name="phone"
                placeholder="Phone Number"
                required
                className="bg-gray-800 border border-gray-700 p-2 w-full rounded text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500"
                value={userDetails.phone}
                onChange={(e) =>
                  setUserDetails({ ...userDetails, phone: e.target.value })
                }
              />

              {loggedIn ? (
                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
                  >
                    Book Property
                </button>
                ):
              (                <button
                  type="submit"
                  disabled
                  className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition
                            disabled:bg-gray-600 disabled:cursor-not-allowed disabled:pointer-events-none"
                  >
                    Please login to book
                </button>)  
            }              
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllPropertiesCards;
