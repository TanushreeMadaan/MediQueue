"use client";

import { useCallback, useState, useMemo } from "react";
import { useApi, useMutation } from "@/hooks/useApi";
import { queueApi } from "@/lib/api";
import QueueListItem from "./QueueListItem";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Button from "@/components/ui/Button";
import AddToQueueModal from "./AddToQueueModal";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { Plus, Search } from "lucide-react";

export default function QueueList() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const {
    data: queue,
    loading,
    error,
    refetch,
  } = useApi(useCallback(() => queueApi.getAll(), []));

  const { mutate: updateStatus } = useMutation(
    (params: { id: number; status: string }) =>
      queueApi.updateStatus(params.id, params.status)
  );

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      await updateStatus({ id, status });
      refetch();
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const filteredQueue = useMemo(() => {
    if (!queue) return [];
    return queue.filter((item) => {
      const matchesSearch = item.patient.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus =
        filterStatus === "all" || item.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [queue, searchTerm, filterStatus]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 p-4">Error loading queue: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
        {/* Left side: The search input */}
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by patient name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Right side: A new flex container for the filter and the button */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label
              htmlFor="status-filter"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Status:
            </label>
            <Select
              id="status-filter"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All</option>
              <option value="waiting">Waiting</option>
              <option value="with_doctor">With Doctor</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </Select>
          </div>

          <Button onClick={() => setModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add to Queue
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm dark:bg-gray-900 border dark:border-gray-800">
        {filteredQueue.length > 0 ? (
          <div className="divide-y divide-gray-200 dark:divide-gray-800">
            {filteredQueue.map((item) => (
              <QueueListItem
                key={item.id}
                item={item}
                onUpdateStatus={handleUpdateStatus}
              />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <p className="text-lg font-medium">
              {queue && queue.length > 0
                ? "No patients match your filters."
                : "The queue is currently empty."}
            </p>
            <p className="text-sm">
              {queue && queue.length > 0
                ? "Try adjusting your search or filter criteria."
                : "Add a walk-in patient to get started."}
            </p>
          </div>
        )}
      </div>
      <AddToQueueModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => {
          setModalOpen(false);
          refetch();
        }}
      />
    </div>
  );
}
