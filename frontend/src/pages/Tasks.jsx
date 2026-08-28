import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const fetchTasks = async () => {
  const { data } = await api.get('/tasks');
  return data;
};

const fetchLeads = async () => {
  const { data } = await api.get('/leads?limit=100');
  return data;
};

const Tasks = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [formData, setFormData] = useState({ title: '', lead: '', dueDate: '' });

  const { data: tasks, isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasks
  });

  const { data: leads } = useQuery({
    queryKey: ['leadsListForTasks'],
    queryFn: fetchLeads
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/tasks/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      handleClose();
    }
  });

  const addMutation = useMutation({
    mutationFn: (newTask) => api.post('/tasks', { ...newTask, assignedTo: user._id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      handleClose();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/tasks/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    }
  });

  const handleClose = () => {
    setOpen(false);
    setIsEditMode(false);
    setEditingTaskId(null);
    setFormData({ title: '', lead: '', dueDate: '' });
  };

  const handleMarkDone = (id) => {
    updateMutation.mutate({ id, data: { status: 'Done' } });
  };

  const handleEditClick = (task) => {
    setIsEditMode(true);
    setEditingTaskId(task._id);
    setFormData({
      title: task.title,
      lead: task.lead?._id || '',
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : ''
    });
    setOpen(true);
  };

  const handleDeleteClick = (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleSubmit = () => {
    if (isEditMode) {
      updateMutation.mutate({ id: editingTaskId, data: formData });
    } else {
      addMutation.mutate(formData);
    }
  };

  if (isLoading) return <CircularProgress />;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Tasks</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>
          + Add Task
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Lead</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks?.map((task) => {
              const isAssignedToMe = task.assignedTo?._id === user?._id;
              
              return (
                <TableRow key={task._id}>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>{task.lead?.name}</TableCell>
                  <TableCell>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</TableCell>
                  <TableCell>{task.status}</TableCell>
                  <TableCell>
                    {isAssignedToMe ? (
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Edit Task">
                          <IconButton size="small" color="primary" onClick={() => handleEditClick(task)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        
                        <Tooltip title="Mark Done">
                          <span>
                            <IconButton 
                              size="small" 
                              color="success" 
                              onClick={() => handleMarkDone(task._id)}
                              disabled={task.status === 'Done'}
                            >
                              <CheckCircleOutlineIcon />
                            </IconButton>
                          </span>
                        </Tooltip>

                        <Tooltip title="Delete Task">
                          <IconButton size="small" color="error" onClick={() => handleDeleteClick(task._id)}>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    ) : (
                      <Typography variant="body2" color="textSecondary">
                        Not Assigned to You
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{isEditMode ? 'Edit Task' : 'Add Task'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Title"
            fullWidth
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <TextField
            margin="dense"
            select
            label="Lead"
            fullWidth
            required
            value={formData.lead}
            onChange={(e) => setFormData({ ...formData, lead: e.target.value })}
          >
            {leads?.map((l) => (
              <MenuItem key={l._id} value={l._id}>
                {l.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            margin="dense"
            label="Due Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleSubmit}
            disabled={!formData.title || !formData.lead}
          >
            {isEditMode ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Tasks;
