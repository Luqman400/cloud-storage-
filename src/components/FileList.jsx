import FileCard from "./FileCard";
import EmptyState from "./EmptyState";
import LoadingSpinner from "./LoadingSpinner";

export default function FileList({
  files,
  loading,
  searchTerm,
  onDownload,
  onDelete,
  onOpen,
  onPrint
}) {
  if (loading) {
    return (
      <div className="full-page-center">
        <LoadingSpinner label="Loading your files..." />
      </div>
    );
  }

  if (files.length === 0 && searchTerm) {
    return (
      <EmptyState
        title={`No files match "${searchTerm}"`}
        description="Try a different search term."
      />
    );
  }

  if (files.length === 0) {
    return (
      <EmptyState
        title="No files yet"
        description="Upload your first file to get started."
      />
    );
  }

  return (
    <div className="file-grid">
      {files.map((file) => (
        <FileCard
          key={file.name}
          file={file}
          onDownload={onDownload}
          onDelete={onDelete}
          onOpen={onOpen}
          onPrint={onPrint}
        />
      ))}
    </div>
  );
}
