import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  DialogContentText,
} from "@mui/material";
import Button from "@mui/material/Button";
import { toast } from "sonner";
import "../../styles/organization/volunteerhistoryreport.css";

const VolunteerHistoryDialog = ({
  open,
  onOpenChange,
  volunteerName,
  history,
}) => {
  const handleDownload = () => {
    if (!history || history.length === 0) {
      toast.error("No history to download");
      return;
    }

    const headers = [
      "Date",
      "Opportunity",
      "Check-In",
      "Check-Out",
      "Total Hours",
      "Status",
    ];
    const rows = history.map((entry) => [
      entry.date,
      entry.opportunity,
      entry.checkIn,
      entry.checkOut,
      entry.totalHours,
      entry.status,
    ]);

    let csvContent = "";
    csvContent += headers.join(",") + "\n";
    rows.forEach((row) => {
      csvContent += row.join(",") + "\n";
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${volunteerName}_history.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Report downloaded successfully");
  };

  return (
    <Dialog
      open={open}
      onClose={() => onOpenChange(false)}
      maxWidth="lg"
      fullWidth
      className="dialog"
      PaperProps={{ className: "dialog-paper" }}
    >
      <DialogTitle className="dialog-title">
        {volunteerName}'s History
      </DialogTitle>

      <DialogContent dividers className="dialog-content">
        <DialogContentText component="div">
          <div className="history-list">
            {history.map((entry, index) => (
              <div key={index} className="history-entry">
                <div className="history-details">
                  <p>
                    <span className="label">Date:</span> {entry.date}
                  </p>
                  <p>
                    <span className="label">Opportunity:</span>{" "}
                    {entry.opportunity}
                  </p>
                  <p>
                    <span className="label">Check-In:</span> {entry.checkIn} |{" "}
                    <span className="label">Check-Out:</span> {entry.checkOut}
                  </p>
                  <p>
                    <span className="label">Total Hours:</span>{" "}
                    {entry.totalHours}
                  </p>
                  <p className={`status ${entry.statusColor}`}>
                    <span className="label">Status:</span> {entry.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </DialogContentText>
      </DialogContent>

      <DialogActions className="dialog-actions">
        <Button
          variant="contained"
          color="primary"
          onClick={() => onOpenChange(false)}
          className="btn-navy"
        >
          Close
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={handleDownload}
          className="btn-success"
        >
          Download Report
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VolunteerHistoryDialog;
