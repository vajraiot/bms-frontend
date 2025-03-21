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
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  AdminPanelSettingsOutlined as AdminIcon,
  SecurityOutlined as SuperAdminIcon,
  LockOpenOutlined as UserIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import axios from "axios";

const BASE_URL = "http://localshost:51270";
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add JWT token to every request via interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

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
    role: "",
    password: "",
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [userError, setUserError] = useState("");

  // Fetch roles and user data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const rolesResponse = await apiClient.get(`${BASE_URL}/getListofLoginRoles`);
        const rolesData = await rolesResponse.json();
        setRoles(rolesData);

        const usersResponse = await apiClient.get(`${BASE_URL}/GetAllLoginDetailsInPlainLoginDetailFormate`);
        if (!usersResponse.ok) throw new Error("Failed to fetch users");
        const usersData = await usersResponse.json();
        setUserData(usersData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Pagination handlers
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Open modal for add/edit
  const handleOpen = (mode, row = null) => {
    if (mode === "edit" && row) {
      setFormData({
        loginCredentialsId: row.loginCredentialsId,
        uname: row.userName,
        email: row.email,
        phone: row.mobile,
        role: row.role,
        password: row.password,
      });
    } else {
      setFormData({
        uname: "",
        email: "",
        phone: "",
        role: "",
        password: "",
      });
    }
    setOpen(true);
  };

  // Close modal
  const handleClose = () => {
    setOpen(false);
    setSelectedRow(null);
    setUserError("");
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validation
    if (!formData.uname || !formData.password || !formData.email || !formData.phone || !formData.role) {
      setUserError("All fields are required.");
      return;
    }

    const url = selectedRow
      ? `${BASE_URL}/PostUpdateLoginUser`
      : `${BASE_URL}/PostCreateNewLoginUser`;

    const data = {
      role: formData.role,
      lstLoginCredentials: [
        {
          ...(selectedRow && { id: formData.loginCredentialsId }),
          userName: formData.uname,
          password: formData.password,
          mobile: formData.phone,
          email: formData.email,
          accessPermissions: {
            dashBoard: true,
            reportsHistorical: true,
          },
        },
      ],
    };

    try {
      const response = await axios.post(url, data);
      if (response.data.value === 0) {
        setUserError(response.data.message);
      } else {
        fetchUserData();
        handleClose();
      }
    } catch (error) {
      setUserError(error.response?.data?.message || "Error submitting user data");
    }
  };

  // Handle user deletion
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`${BASE_URL}/DeleteLoginUserByLoginCredId?loginCredId=${id}`);
        fetchUserData();
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  // Fetch user data
  const fetchUserData = async () => {
    try {
      const response = await fetch(`${BASE_URL}/GetAllLoginDetailsInPlainLoginDetailFormate`);
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

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
        handleDelete={handleDelete}
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
        isEditing={!!selectedRow}
        colors={colors}
      />
    </Box>
  );
};

// Reusable UserTable component
const UserTable = ({ userData, handleOpen, handleDelete, colors }) => (
  <Box m="30px 0 0 0" sx={{ border: "1px solid black", borderRadius: "6px", boxShadow: "0 4px 10px rgba(19, 17, 17, 0.5)" }}>
    <Table>
      <TableHead>
        <TableRow>
          {["User ID", "User Name", "Phone Number", "Email", "Access Level", "Actions"].map((header) => (
            <TableCell key={header} sx={{ fontWeight: "bold", textAlign:"center",  background: "linear-gradient(to bottom, #d82b27, #f09819)", color: "#ffffff", padding: "12px" }}>
              {header}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {userData.map((row) => (
          <TableRow key={row.loginCredentialsId}>
            <TableCell sx={{textAlign:"center",fontWeight: "bold"}} >{row.loginCredentialsId}</TableCell>
            <TableCell sx={{textAlign:"center",fontWeight: "bold"}}>{row.userName}</TableCell>
            <TableCell sx={{textAlign:"center",fontWeight: "bold"}}>{row.mobile}</TableCell>
            <TableCell sx={{textAlign:"center",fontWeight: "bold"}}>{row.email}</TableCell>
            <TableCell sx={{textAlign:"center",fontWeight: "bold"}}>
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
            <TableCell sx={{textAlign:"center",fontWeight: "bold"}}>
              <IconButton onClick={() => handleOpen("edit", row)}><EditIcon /></IconButton>
              <IconButton color="error" onClick={() => handleDelete(row.loginCredentialsId)}><DeleteIcon /></IconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </Box>
);

// Reusable UserModal component
const UserModal = ({ open, handleClose, formData, setFormData, handleSubmit, roles, userError, isEditing, colors }) => (
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
      {["uname", "password", "email", "phone"].map((field) => (
        <TextField
          key={field}
          required
          margin="dense"
          id={field}
          name={field}
          label={field.charAt(0).toUpperCase() + field.slice(1)}
          type={field === "password" ? "password" : "text"}
          fullWidth
          variant="outlined"
          value={formData[field]}
          onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
          sx={{ marginBottom: "16px" }}
        />
      ))}
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