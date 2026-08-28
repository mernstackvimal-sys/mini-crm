import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Box, Typography, Paper, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import api from '../api/axios';

const fetchCompanyDetails = async (id) => {
  const { data } = await api.get(`/companies/${id}`);
  return data;
};

const CompanyDetail = () => {
  const { id } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: ['company', id],
    queryFn: () => fetchCompanyDetails(id)
  });

  if (isLoading) return <CircularProgress />;
  if (!data) return <Typography>Company not found</Typography>;

  const { company, leads } = data;

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h4" gutterBottom>{company.name}</Typography>
        <Typography><strong>Industry:</strong> {company.industry}</Typography>
        <Typography><strong>Location:</strong> {company.location}</Typography>
      </Paper>

      <Typography variant="h5" gutterBottom>Associated Leads</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leads.length > 0 ? leads.map(lead => (
              <TableRow key={lead._id}>
                <TableCell>{lead.name}</TableCell>
                <TableCell>{lead.email}</TableCell>
                <TableCell>{lead.status}</TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={3} align="center">No leads associated</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CompanyDetail;
