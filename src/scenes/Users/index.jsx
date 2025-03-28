import React, { useState, useEffect } from "react";
import { tokens } from "../../theme";
import {
  Modal,
  Box,
  Typography,
  Button,
  TextField,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  MenuItem,
  IconButton,
  Snackbar,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputAdornment,
} from "@mui/material";
import { fetchLoginRoles, fetchUserDetails, UpdateUser, deleteUser, PostUser } from "../../services/apiService.js";
import { useTheme } from "@mui/material/styles";
import {
  AdminPanelSettingsOutlined as AdminIcon,
  SecurityOutlined as SuperAdminIcon,
  LockOpenOutlined as UserIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Phone as PhoneIcon,
} from "@mui/icons-material";

const Team = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [userData, setUserData] = useState([]);
  const [roles, setRoles] = useState([]);
  const [formData, setFormData] = useState({
    uname: "",
    email: "",
    phone: "",
    countryCode: "+1",
    role: "",
    password: "",
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [userError, setUserError] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);

  const countryCodes = [
    { code: "+1", label: "US (+1)" },
    { code: "+91", label: "India (+91)" },
    { code: "+44", label: "UK (+44)" },
    { code: "+33", label: "France (+33)" },
    { code: "+81", label: "Japan (+81)" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rolesResponse = await fetchLoginRoles();
        setRoles(rolesResponse);

        const usersResponse = await fetchUserDetails();
        setUserData(usersResponse);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpen = (mode, row = null) => {
    if (mode === "edit" && row) {
      setSelectedRow(row);
      const mobileMatch = row.mobile.match(/(\+\d{1,3})(\d+)/);
      const countryCode = mobileMatch ? mobileMatch[1] : "+1";
      const phoneNumber = mobileMatch ? mobileMatch[2] : row.mobile;
      
      setFormData({
        loginCredentialsId: row.loginCredentialsId,
        uname: row.userName,
        email: row.email,
        phone: phoneNumber,
        countryCode: countryCode,
        role: row.role,
        password: "",
      });
    } else {
      setSelectedRow(null);
      setFormData({
        uname: "",
        email: "",
        phone: "",
        countryCode: "+1",
        role: "",
        password: "",
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRow(null);
    setUserError("");
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const validateForm = () => {
    const phoneRegex = /^\d{10}$/;
    const emailRegex = /^[^\s@]+@gmail\.com$/;

    if (!formData.uname) return "Username is required.";
    if (!isEditing && !formData.password) return "Password is required.";
    if (!formData.email) return "Email is required.";
    if (!emailRegex.test(formData.email)) return "Email must end with @gmail.com.";
    if (!formData.phone) return "Phone number is required.";
    if (!phoneRegex.test(formData.phone)) return "Phone number must be exactly 10 digits.";
    if (!formData.role) return "Role is required.";
    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const isEditing = !!selectedRow;

    const validationError = validateForm();
    if (validationError) {
      setUserError(validationError);
      return;
    }

    const fullPhoneNumber = `${formData.countryCode}${formData.phone}`;
    const data = {
      role: formData.role,
      lstLoginCredentials: [
        {
          ...(selectedRow && { id: formData.loginCredentialsId }),
          userName: formData.uname,
          password: formData.password,
          mobile: fullPhoneNumber,
          email: formData.email,
          accessPermissions: {
            dashBoard: true,
            reportsHistorical: true,
          },
        },
      ],
    };

    try {
      const response = selectedRow ? await UpdateUser(data) : await PostUser(data);

      if (response.value === 0) {
        setUserError(response.message);
        setSnackbar({ open: true, message: response.message, severity: "error" });
      } else {
        fetchUserData();
        handleClose();
        setSnackbar({
          open: true,
          message: selectedRow ? "User updated successfully!" : "User added successfully!",
          severity: "success",
        });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error submitting user data";
      setUserError(errorMessage);
      setSnackbar({ open: true, message: errorMessage, severity: "error" });
    }
  };

  const handleDeleteClick = (id) => {
    setUserIdToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setUserIdToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteUser(userIdToDelete);
      fetchUserData();
      setSnackbar({ open: true, message: "User deleted successfully!", severity: "success" });
    } catch (error) {
      console.error("Error deleting user:", error);
      setSnackbar({ open: true, message: "Error deleting user", severity: "error" });
    } finally {
      handleDeleteDialogClose();
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await fetchUserDetails();
      setUserData(response);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const isEditing = !!selectedRow;

  return (
    <Box m="15px">
      <Button
        onClick={() => handleOpen("add")}
        variant="contained"
        sx={{ background: "linear-gradient(to bottom, #d82b27, #f09819)", color: "white" }}
      >
        Add User
      </Button>

      <UserTable
        userData={userData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
        handleOpen={handleOpen}
        handleDelete={handleDeleteClick}
        colors={colors}
      />

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={userData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <UserModal
        open={open}
        handleClose={handleClose}
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        roles={roles}
        userError={userError}
        isEditing={isEditing}
        colors={colors}
        countryCodes={countryCodes}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this user? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

const UserTable = ({ userData, handleOpen, handleDelete, colors }) => (
  <Box m="30px 0 0 0" sx={{ border: "1px solid black", borderRadius: "6px", boxShadow: "0 4px 10px rgba(19, 17, 17, 0.5)" }}>
    <Table>
      <TableHead>
        <TableRow>
          {["User ID", "User Name", "Phone Number", "Email", "Access Level", "Actions"].map((header) => (
            <TableCell key={header} sx={{ fontWeight: "bold", textAlign: "center", background: "linear-gradient(to bottom, #d82b27, #f09819)", color: "#ffffff", padding: "12px" }}>
              {header}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {userData.map((row) => (
          <TableRow key={row.loginCredentialsId}>
            <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>{row.loginCredentialsId}</TableCell>
            <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>{row.userName}</TableCell>
            <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>{row.mobile}</TableCell>
            <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>{row.email}</TableCell>
            <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>
              <Box
                display="flex"
                justifyContent="center"
                backgroundColor={
                  row.role === "ADMIN"
                    ? colors.greenAccent[600]
                    : row.role === "SUPERADMIN"
                    ? colors.greenAccent[700]
                    : colors.greenAccent[700]
                }
                borderRadius="4px"
              >
                {row.role === "ADMIN" && <AdminIcon />}
                {row.role === "SUPERADMIN" && <SuperAdminIcon />}
                {row.role === "USER" && <UserIcon />}
                <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
                  {row.role}
                </Typography>
              </Box>
            </TableCell>
            <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>
              <IconButton onClick={() => handleOpen("edit", row)}><EditIcon /></IconButton>
              <IconButton color="error" onClick={() => handleDelete(row.loginCredentialsId)}><DeleteIcon /></IconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </Box>
);

const UserModal = ({ open, handleClose, formData, setFormData, handleSubmit, roles, userError, isEditing, colors, countryCodes }) => (
  <Modal open={open} onClose={handleClose}>
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        width: "500px",
        backgroundColor: colors.primary[500],
        margin: "auto",
        padding: "30px",
        borderRadius: "12px",
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        position: "absolute",
      }}
    >
      <Typography variant="h5" sx={{ marginBottom: "24px", textAlign: "center", color: colors.grey[50] }}>
        {isEditing ? "Edit User" : "Add User"}
      </Typography>
      {userError && <Typography color="error" sx={{ textAlign: "center" }}>{userError}</Typography>}
      
      <TextField
        required
        margin="dense"
        id="uname"
        name="uname"
        label="Username"
        type="text"
        fullWidth
        variant="outlined"
        value={formData.uname}
        onChange={(e) => setFormData({ ...formData, uname: e.target.value })}
        sx={{ marginBottom: "16px" }}
      />
      
      {!isEditing && (
        <TextField
          required
          margin="dense"
          id="password"
          name="password"
          label="Password"
          type="password"
          fullWidth
          variant="outlined"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          sx={{ marginBottom: "16px" }}
        />
      )}
      
      <TextField
        required
        margin="dense"
        id="email"
        name="email"
        label="Email"
        type="email"
        fullWidth
        variant="outlined"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        sx={{ marginBottom: "16px" }}
      />
      
      <Box sx={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
        <TextField
          select
          required
          margin="dense"
          id="countryCode"
          name="countryCode"
          label="Code"
          value={formData.countryCode}
          onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
          variant="outlined"
          sx={{ width: "120px" }}
        >
          {countryCodes.map((option) => (
            <MenuItem key={option.code} value={option.code}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          required
          margin="dense"
          id="phone"
          name="phone"
          label="Phone Number"
          type="text"
          fullWidth
          variant="outlined"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, "") })}
          inputProps={{ maxLength: 10 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PhoneIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      
      <TextField
        select
        required
        margin="dense"
        id="role"
        name="role"
        label="Role"
        value={formData.role}
        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
        fullWidth
        variant="outlined"
        sx={{ marginBottom: "24px" }}
      >
        {roles.map((role, index) => (
          <MenuItem key={index} value={role}>{role}</MenuItem>
        ))}
      </TextField>
      
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Button onClick={handleClose} variant="outlined" sx={{ background: "linear-gradient(to bottom, #d82b27, #f09819)", color: "white" }}>
          Cancel
        </Button>
        <Button type="submit" variant="contained" sx={{ background: "linear-gradient(to bottom, #d82b27, #f09819)", color: "white" }}>
          {isEditing ? "Save Changes" : "Add User"}
        </Button>
      </Box>
    </Box>
  </Modal>
);

export default Team;