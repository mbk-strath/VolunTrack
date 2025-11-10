import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  DialogContentText,
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  Grid,
} from "@mui/material";
import { toast } from "sonner";
import "../../styles/organization/createopportunityform.css";

const CreateOpportunityDialog = ({ open, onOpenChange }) => {
  const [cvRequired, setCvRequired] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Opportunity created successfully!");
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onClose={() => onOpenChange(false)}
      maxWidth="lg"
      fullWidth
      PaperProps={{ className: "create-dialog-paper" }}
    >
      <DialogTitle className="create-dialog-title">
        Organization Name
        <FormControlLabel
          control={
            <Checkbox
              checked={cvRequired}
              onChange={(e) => setCvRequired(e.target.checked)}
              size="small"
            />
          }
          label="CV Required"
          className="cv-checkbox"
        />
      </DialogTitle>

      <DialogContent dividers className="create-dialog-content">
        <DialogContentText component="div">
          <form onSubmit={handleSubmit} className="create-form">
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder="Opportunity Title"
                  className="rounded-input"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="number"
                  placeholder="Number of Volunteers"
                  className="rounded-input"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder="Working Hours"
                  className="rounded-input"
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="date"
                  label="Start Date"
                  InputLabelProps={{ shrink: true }}
                  className="rounded-input"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="date"
                  label="End Date"
                  InputLabelProps={{ shrink: true }}
                  className="rounded-input"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder="Location"
                  className="rounded-input"
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  multiline
                  minRows={4}
                  placeholder="Skills Required"
                  className="rounded-textarea"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  multiline
                  minRows={4}
                  placeholder="Benefits"
                  className="rounded-textarea"
                />
              </Grid>
            </Grid>

            <TextField
              fullWidth
              multiline
              minRows={5}
              placeholder="Description"
              className="rounded-textarea"
            />

            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="date"
                  label="Application Deadline"
                  InputLabelProps={{ shrink: true }}
                  className="rounded-input"
                />
              </Grid>
            </Grid>

            <DialogActions className="create-dialog-actions">
              <Button
                type="submit"
                variant="contained"
                className="btn-create"
              >
                Create New Opportunity
              </Button>
            </DialogActions>
          </form>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
};

export default CreateOpportunityDialog;
