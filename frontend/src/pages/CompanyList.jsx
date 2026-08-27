import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress,
  Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField
} from '@mui/material';
import api from '../api/axios';

const fetchCompanies = async () => {
  const { data } = await api.get('/companies');
  return data;
};

const CompanyList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', industry: '', location: '' });

  const { data: companies, isLoading } = useQuery({
    queryKey: ['companies'],
    queryFn: fetchCompanies
  });

  const mutation = useMutation({
    mutationFn: (newCompany) => api.post('/companies', newCompany),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      setOpen(false);
      setFormData({ name: '', industry: '', location: '' });
    }
  });

  if (isLoading) return <CircularProgress />;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Companies</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>
          + Add Company
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Company Name</TableCell>
              <TableCell>Industry</TableCell>
              <TableCell>Location</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {companies?.map((company) => (
              <TableRow 
                key={company._id} 
                hover 
                onClick={() => navigate(`/companies/${company._id}`)}
                sx={{ cursor: 'pointer' }}
              >
                <TableCell>{company.name}</TableCell>
                <TableCell>{company.industry}</TableCell>
                <TableCell>{company.location}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add Company</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            fullWidth
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Industry"
            fullWidth
            value={formData.industry}
            onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Location"
            fullWidth
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={() => mutation.mutate(formData)}
            disabled={!formData.name}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CompanyList;
