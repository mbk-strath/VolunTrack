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
    toast.success("Report downloaded successfully");
  };

  return (
    <Dialog
      open={open}
      onClose={() => onOpenChange(false)}
      maxWidth="lg"
      fullWidth
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
                    <span className="label">Opportunity:</span> {entry.opportunity}
                  </p>
                  <p>
                    <span className="label">Check-In:</span> {entry.checkIn} |{" "}
                    <span className="label">Check-Out:</span> {entry.checkOut}
                  </p>
                  <p>
                    <span className="label">Total Hours:</span> {entry.totalHours}
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
