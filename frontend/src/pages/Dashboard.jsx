import { useQuery } from '@tanstack/react-query';
import { Grid, Card, CardContent, Typography, Box, CircularProgress } from '@mui/material';
import api from '../api/axios';

const fetchDashboardStats = async () => {
  const { data } = await api.get('/dashboard');
  return data;
};

const Dashboard = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: fetchDashboardStats
  });

  if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>;
  if (error) return <Typography color="error">Error loading dashboard stats</Typography>;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Leads
              </Typography>
              <Typography variant="h5">
                {data.totalLeads}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Qualified Leads
              </Typography>
              <Typography variant="h5">
                {data.qualifiedLeads}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Tasks Due Today
              </Typography>
              <Typography variant="h5">
                {data.tasksDueToday}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Completed Tasks
              </Typography>
              <Typography variant="h5">
                {data.completedTasks}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
