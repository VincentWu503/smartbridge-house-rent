import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import Toast from '../common/Toast';

const REPORTS_URL = `${import.meta.env.VITE_API_URL}/api/reports`;

const getRequestErrorMessage = (error, fallback) => {
  if (error.response?.status === 404) {
    return 'Reports API not found.';
  }
  return error.response?.data?.message || fallback;
};

const AllReport = () => {
  const [reports, setReports] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [toast, setToast] = useState({ show: false, type: '', message: '' });
  const showToast = useCallback((type, message) => {
    setToast({ show: true, type, message });
  }, []);

  const closeToast = useCallback(() => {
    setToast((currentToast) => ({ ...currentToast, show: false }));
  }, []);

  const getAllReports = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(REPORTS_URL, {
        withCredentials: true,
      });
      if (response.data.success) {
        setReports(response.data.data);
        setSelectedStatuses(
          Object.fromEntries(
            response.data.data.map((report) => [report._id, report.status]),
          ),
        );
      } else {
        showToast('error', response.data.message || 'Unable to load reports');
      }
    } catch (error) {
      console.error('Failed to fetch reports:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        showToast('error', 'Admin access is required to view reports');
      } else {
        showToast(
          'error',
          getRequestErrorMessage(error, 'Failed to fetch reports'),
        );
      }
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    getAllReports();
  }, [getAllReports]);

  const handleStatusChange = (reportId, status) => {
    setSelectedStatuses((currentStatuses) => ({
      ...currentStatuses,
      [reportId]: status,
    }));
  };

  const handleStatusUpdate = async (reportId) => {
    const status = selectedStatuses[reportId];
    setProcessingId(reportId);
    try {
      const response = await axios.patch(
        `${REPORTS_URL}/${reportId}`,
        { status },
        { withCredentials: true },
      );

      if (!response.data.success) {
        showToast('error', response.data.message || 'Failed to update status');
        return;
      }

      setReports((currentReports) =>
        currentReports.map((report) =>
          report._id === reportId ? { ...report, status } : report,
        ),
      );
      showToast('success', 'Report status updated');
    } catch (error) {
      console.error('Failed to update report status:', error);
      showToast(
        'error',
        getRequestErrorMessage(error, 'Failed to update status'),
      );
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (reportId) => {
    if (!window.confirm('Delete this report? This action cannot be undone.')) {
      return;
    }

    setProcessingId(reportId);
    try {
      const response = await axios.delete(`${REPORTS_URL}/${reportId}`, {
        withCredentials: true,
      });

      if (!response.data.success) {
        showToast('error', response.data.message || 'Failed to delete report');
        return;
      }

      setReports((currentReports) =>
        currentReports.filter((report) => report._id !== reportId),
      );
      setSelectedStatuses((currentStatuses) => {
        const nextStatuses = { ...currentStatuses };
        delete nextStatuses[reportId];
        return nextStatuses;
      });
      showToast('success', 'Report deleted');
    } catch (error) {
      console.error('Failed to delete report:', error);
      showToast(
        'error',
        getRequestErrorMessage(error, 'Failed to delete report'),
      );
    } finally {
      setProcessingId(null);
    }
  };

  const getPersonLabel = (person) => {
    if (!person) return 'Anonymous';
    if (typeof person === 'string') return person;
    return person.name ? `${person.name} (${person._id})` : person._id;
  };

  return (
    <div className="relative mt-6">
      {toast.show && (
        <Toast type={toast.type} message={toast.message} onClose={closeToast} />
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-700 bg-gray-900/80 shadow-2xl">
          <thead className="bg-indigo-600/80 text-white">
            <tr>
              <th className="px-4 py-3 text-left">Owner</th>
              <th className="px-4 py-3 text-left">Reported by</th>
              <th className="px-4 py-3 text-left">Phone</th>
              <th className="px-4 py-3 text-left">Reason</th>
              <th className="px-4 py-3 text-left">Description</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="7" className="py-6 text-center text-gray-400">
                  Loading reports...
                </td>
              </tr>
            ) : reports.length > 0 ? (
              reports.map((report, index) => {
                const isProcessing = processingId === report._id;
                const selectedStatus =
                  selectedStatuses[report._id] || report.status;

                return (
                  <tr
                    key={report._id}
                    className={`transition hover:bg-indigo-500/20 ${
                      index % 2 === 0 ? 'bg-gray-800/60' : 'bg-gray-300/60'
                    }`}
                  >
                    <td className="max-w-xs break-all border-b border-gray-700 px-4 py-3 text-gray-200">
                      {getPersonLabel(report.ownerId)}
                    </td>
                    <td className="max-w-xs break-all border-b border-gray-700 px-4 py-3 text-gray-300">
                      {getPersonLabel(report.userId)}
                    </td>
                    <td className="border-b border-gray-700 px-4 py-3 text-gray-300">
                      {report.userPhoneNumber}
                    </td>
                    <td className="border-b border-gray-700 px-4 py-3 text-indigo-300">
                      {report.reason}
                    </td>
                    <td className="max-w-sm whitespace-pre-wrap border-b border-gray-700 px-4 py-3 text-gray-300">
                      {report.description}
                    </td>
                    <td className="border-b border-gray-700 px-4 py-3 text-center">
                      <select
                        aria-label={`Status for report ${report._id}`}
                        value={selectedStatus}
                        onChange={(event) =>
                          handleStatusChange(report._id, event.target.value)
                        }
                        disabled={isProcessing}
                        className="rounded-md border border-gray-600 bg-gray-800 px-2 py-1 text-gray-100 disabled:opacity-60"
                      >
                        <option value="in progress">In progress</option>
                        <option value="settled">Settled</option>
                      </select>
                    </td>
                    <td className="border-b border-gray-700 px-4 py-3 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleStatusUpdate(report._id)}
                          disabled={
                            isProcessing || selectedStatus === report.status
                          }
                          className="rounded-lg bg-indigo-600 px-3 py-1 text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isProcessing ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(report._id)}
                          disabled={isProcessing}
                          className="rounded-lg bg-red-600 px-3 py-1 text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="py-6 text-center font-medium italic text-gray-400"
                >
                  No reports found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllReport;
