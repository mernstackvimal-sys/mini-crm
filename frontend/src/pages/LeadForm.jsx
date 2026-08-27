import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Box, Typography, TextField, Button, Paper, MenuItem } from '@mui/material';
import api from '../api/axios';

const fetchCompanies = async () => {
  const { data } = await api.get('/companies');
  return data;
};

const LeadForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'New',
    company: '',
    assignedTo: '' 
  });

  const { data: companies } = useQuery({
    queryKey: ['companies'],
    queryFn: fetchCompanies
  });

  useEffect(() => {
    if (isEditMode) {
      const fetchLead = async () => {
        try {
          const { data } = await api.get(`/leads/${id}`);
          setFormData({
            name: data.name || '',
            email: data.email || '',
            phone: data.phone || '',
            status: data.status || 'New',
            company: data.company || '',
            assignedTo: data.assignedTo || ''
          });
        } catch (error) {
          console.error('Failed to fetch lead', error);
        }
      };
      fetchLead();
    }
  }, [id, isEditMode]);

  const mutation = useMutation({
    mutationFn: (newLead) => {
      if (isEditMode) {
        return api.put(`/leads/${id}`, newLead);
      } else {
        return api.post('/leads', newLead);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      navigate('/leads');
    }
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSubmit = { ...formData };
    
    // Remove empty string fields that expect ObjectIds
    if (!dataToSubmit.company) delete dataToSubmit.company;
    if (!dataToSubmit.assignedTo) delete dataToSubmit.assignedTo;

    mutation.mutate(dataToSubmit);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {isEditMode ? 'Edit Lead' : 'Add Lead'}
      </Typography>
      <Paper sx={{ p: 3, maxWidth: 600 }}>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField name="name" label="Name" required value={formData.name} onChange={handleChange} />
          <TextField name="email" label="Email" type="email" required value={formData.email} onChange={handleChange} />
          <TextField name="phone" label="Phone" value={formData.phone} onChange={handleChange} />
          
          <TextField select name="status" label="Status" value={formData.status} onChange={handleChange}>
            <MenuItem value="New">New</MenuItem>
            <MenuItem value="Contacted">Contacted</MenuItem>
            <MenuItem value="Qualified">Qualified</MenuItem>
            <MenuItem value="Lost">Lost</MenuItem>
          </TextField>

          <TextField select name="company" label="Company" value={formData.company} onChange={handleChange}>
            <MenuItem value="">None</MenuItem>
            {companies?.map(c => (
              <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>
            ))}
          </TextField>

          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Button type="submit" variant="contained" disabled={mutation.isLoading}>
              Save
            </Button>
            <Button variant="outlined" onClick={() => navigate('/leads')}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default LeadForm;
