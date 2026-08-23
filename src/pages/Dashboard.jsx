import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase, BUCKET_NAME } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import UploadArea from "../components/UploadArea";
import FileList from "../components/FileList";
import ErrorMessage from "../components/ErrorMessage";
import { formatBytes, getUniqueFileName, sanitizeFileName } from "../utils/fileHelpers";

export default function Dashboard() {
  const { user } = useAuth();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [uploadingFiles, setUploadingFiles] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");

  const userFolder = user?.id;

  const loadFiles = useCallback(async () => {
    if (!userFolder) return;
    setLoading(true);
    setError("");

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .list(userFolder, {
        limit: 200,
        sortBy: { column: "created_at", order: "desc" }
      });

    if (error) {
      setError(`Could not load your files: ${error.message}`);
      setLoading(false);
      return;
    }

    const mapped = (data ?? [])
      // Supabase can include a hidden placeholder object for empty folders.
      .filter((item) => item.name !== ".emptyFolderPlaceholder")
      .map((item) => ({
        name: item.name,
        size: item.metadata?.size ?? 0,
        mimetype: item.metadata?.mimetype ?? "",
        createdAt: item.created_at
      }));

    setFiles(mapped);
    setLoading(false);
  }, [userFolder]);

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  const filteredFiles = useMemo(() => {
    if (!searchTerm.trim()) return files;
    const term = searchTerm.trim().toLowerCase();
    return files.filter((file) => file.name.toLowerCase().includes(term));
  }, [files, searchTerm]);

  const totalSize = useMemo(
    () => files.reduce((sum, file) => sum + (file.size || 0), 0),
    [files]
  );

  async function handleFilesSelected(selectedFiles) {
    if (!userFolder) return;
    setError("");

    const existingNames = files.map((f) => f.name);

    for (const file of selectedFiles) {
      const uploadId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const safeName = sanitizeFileName(file.name);
      const finalName = getUniqueFileName(safeName, existingNames);
      existingNames.push(finalName); // avoid collisions within the same batch

      setUploadingFiles((prev) => [
        ...prev,
        { id: uploadId, name: finalName, status: "uploading" }
      ]);

      const path = `${userFolder}/${finalName}`;
      const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(path, file, { cacheControl: "3600", upsert: false });

      if (error) {
        setUploadingFiles((prev) =>
          prev.map((item) =>
            item.id === uploadId
              ? { ...item, status: "error", error: error.message }
              : item
          )
        );
        setError(`Failed to upload "${file.name}": ${error.message}`);
        continue;
      }

      setUploadingFiles((prev) => prev.filter((item) => item.id !== uploadId));
    }

    await loadFiles();
  }

  async function handleDownload(file) {
    setError("");
    const path = `${userFolder}/${file.name}`;
    const { data, error } = await supabase.storage.from(BUCKET_NAME).download(path);

    if (error) {
      setError(`Could not download "${file.name}": ${error.message}`);
      return;
    }

    const url = URL.createObjectURL(data);
    const link = document.createElement("a");
    link.href = url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  async function handleDelete(file) {
    setError("");
    const path = `${userFolder}/${file.name}`;
    const { error } = await supabase.storage.from(BUCKET_NAME).remove([path]);

    if (error) {
      setError(`Could not delete "${file.name}": ${error.message}`);
      return;
    }

    setFiles((prev) => prev.filter((f) => f.name !== file.name));
  }

  async function getSignedUrl(file) {
    const path = `${userFolder}/${file.name}`;
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(path, 60);

    if (error) {
      setError(`Could not open "${file.name}": ${error.message}`);
      return null;
    }
    return data.signedUrl;
  }

  async function handleOpen(file) {
    setError("");
    const url = await getSignedUrl(file);
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  }

  async function handlePrint(file) {
    setError("");
    const url = await getSignedUrl(file);
    if (!url) return;

    const printWindow = window.open(url, "_blank", "noopener,noreferrer");
    if (!printWindow) return;

    // Best effort: browsers control printing of cross-origin content, so this
    // works reliably for PDFs and images but may just open the file for
    // other types, letting the user print manually (e.g. Ctrl/Cmd+P).
    printWindow.addEventListener("load", () => {
      try {
        printWindow.focus();
        printWindow.print();
      } catch {
        // Silently ignore - the file is still open for the user to print manually.
      }
    });
  }

  const sectionTitles = {
    dashboard: "Dashboard",
    files: "My Files",
    settings: "Settings"
  };

  return (
    <div className="app-shell">
      <Sidebar
        activeSection={activeSection}
        onNavigate={setActiveSection}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="app-main">
        <Header
          title={sectionTitles[activeSection]}
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          onUploadClick={() => document.getElementById("dashboard-upload-input")?.click()}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="content">
          <ErrorMessage message={error} onDismiss={() => setError("")} />

          {activeSection === "settings" ? (
            <SettingsSection user={user} totalSize={totalSize} fileCount={files.length} />
          ) : (
            <>
              <UploadArea
                onFilesSelected={handleFilesSelected}
                uploadingFiles={uploadingFiles}
              />

              <div className="content-header-row">
                <h2 className="section-heading">
                  {searchTerm ? "Search results" : "All files"}
                </h2>
                <span className="storage-summary">
                  {files.length} file{files.length === 1 ? "" : "s"} &middot;{" "}
                  {formatBytes(totalSize)} used
                </span>
              </div>

              <FileList
                files={filteredFiles}
                loading={loading}
                searchTerm={searchTerm}
                onDownload={handleDownload}
                onDelete={handleDelete}
                onOpen={handleOpen}
                onPrint={handlePrint}
              />
            </>
          )}
        </main>
      </div>
    </div>
  );
}

function SettingsSection({ user, totalSize, fileCount }) {
  return (
    <div className="settings-section">
      <div className="settings-card">
        <h3>Account</h3>
        <p className="settings-row">
          <span>Email</span>
          <span>{user?.email}</span>
        </p>
        <p className="settings-row">
          <span>User ID</span>
          <span className="settings-mono">{user?.id}</span>
        </p>
      </div>

      <div className="settings-card">
        <h3>Storage</h3>
        <p className="settings-row">
          <span>Files stored</span>
          <span>{fileCount}</span>
        </p>
        <p className="settings-row">
          <span>Space used</span>
          <span>{formatBytes(totalSize)}</span>
        </p>
      </div>
    </div>
  );
}
