import { Dialog } from '@headlessui/react';
import { XMarkIcon, DocumentIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

const PdfViewer = ({ isOpen, onClose, pdfUrl, candidateName, error }) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

        <div className="relative bg-white rounded-lg w-full max-w-4xl mx-4 h-[90vh] flex flex-col">
          {/* Modal Header */}
          <div className="flex justify-between items-center p-4 border-b">
            <Dialog.Title className="text-lg font-semibold">
              {candidateName}'s Resume
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* PDF Viewer or Error Message */}
          <div className="flex-1 p-4">
            {error ? (
              <div className="flex flex-col items-center justify-center h-full">
                <ExclamationCircleIcon className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-600 text-lg mb-2">{error}</p>
                <p className="text-gray-500 text-sm">
                  The candidate has not uploaded their resume yet.
                </p>
              </div>
            ) : pdfUrl ? (
              <iframe
                src={`${pdfUrl}#toolbar=0`}
                className="w-full h-full rounded-md"
                title="Resume PDF Viewer"
              >
                <p>Your browser doesn't support PDF viewing.</p>
              </iframe>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="p-4 border-t flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Close
            </button>
            {pdfUrl && !error && (
              <a
                href={pdfUrl}
                download={`${candidateName}_resume.pdf`}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Download
              </a>
            )}
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default PdfViewer; 