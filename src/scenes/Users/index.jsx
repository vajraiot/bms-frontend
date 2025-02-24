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
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import MenuItem from "@mui/material/MenuItem";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import axios from "axios";

const BASE_URL = "http://122.175.45.16:51270";

const Team = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [userData, setUserData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [userError, setUserError] = useState("");
  const [roles, setRoles] = useState([]); // Store roles from backend
  const [formData, setFormData] = useState({
    uname: "",
    email: "",
    phone: "",
    role: "",
    password: "",
  });

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch(`${BASE_URL}/getListofLoginRoles`);
        const data = await response.json();
        setRoles(data); // Since data is an array of strings, store it directly
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    fetchRoles();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/GetAllLoginDetailsInPlainLoginDetailFormate`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const result = await response.json();
      setUserData(result); // Store the response data in state
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchUserData(); // Fetch the user data when the component mounts
  }, []);

  // Handle pagination page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to the first page when rows per page changes
  };

  // Calculate the current rows to display
  const currentRows = userData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleOpen = (mode, row = null) => {
    if (mode === "edit" && row) {
      // Edit mode
      setIsEditing(true);
      setSelectedRow(row);
      setFormData({
        loginCredentialsId: row.loginCredentialsId,
        uname: row.userName || "",
        email: row.email || "",
        phone: row.mobile || "",
        role: row.role || "",
        password: row.password || "",
      });
    } else if (mode === "add") {
      // Add mode
      setIsEditing(false);
      setSelectedRow(null);
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

  const handleClose = () => {
    setOpen(false);
    setSelectedRow(null);
  };

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitted(true);

    // Validation checks
    if (
      !formData.uname ||
      /\s/.test(formData.uname) ||
      !formData.password ||
      /\s/.test(formData.password) ||
      !formData.email ||
      /\s/.test(formData.email) ||
      !formData.phone ||
      /\s/.test(formData.phone) ||
      !formData.role
    ) {
      return; // Prevent submission if validation fails
    }

    const url = isEditing
      ? `${BASE_URL}/PostUpdateLoginUser`
      : `${BASE_URL}/PostCreateNewLoginUser`;

    const data = {
      role: formData.role,
      lstLoginCredentials: [
        {
          ...(isEditing && { id: formData.loginCredentialsId }), // Include 'id' only if editing
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
      setUserError("");
      const response = await axios.post(url, data);
      const result = response.data;
      if (result.value == 0) {
        setUserError(result.message);
      } else {
        fetchUserData(); // Refresh the data grid
        setIsSubmitted(false);
        handleClose();
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error submitting user data";
      setUserError(errorMessage);
    }
  };

  const handleDeleteClick = async (loginCredentialsId) => {
    const confirmation = window.confirm("Are you sure you want to delete this user?");
    if (confirmation) {
      try {
        const response = await fetch(
          `${BASE_URL}/DeleteLoginUserByLoginCredId?loginCredId=${loginCredentialsId}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete user");
        }

        const result = await response.json();
        console.log("User deleted successfully:", result);
        fetchUserData(); // Refresh the data grid after deletion
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  return (
    <Box m="15px">
      <Button
        onClick={() => handleOpen("add")}
        color="primary"
        variant="contained"
        sx={{
          marginRight: 1,
          background: "linear-gradient(to bottom, #d82b27, #f09819) !important",
          color: "white",
          "&:hover": {
            backgroundColor: "#a1221f",
          },
        }}
      >
        Add User
      </Button>
      <Box
        m="30px 0 0 0"
        sx={{
          border: "1px solid black",
          borderRadius: "6px",
          boxShadow: "0 4px 10px rgba(19, 17, 17, 0.5)",
          overflow: "auto",
        }}
      >
        <Table>
          <TableHead >
            <TableRow>
              <TableCell  sx={{
                        fontWeight: "bold",
                        background: "linear-gradient(to bottom, #d82b27, #f09819) !important",
                        color: "#ffffff",
                        padding: '3px',
                        minWidth: "150px",
                        whiteSpace: "nowrap",
                      }}>User ID</TableCell>
              <TableCell  sx={{
                        fontWeight: "bold",
                        background: "linear-gradient(to bottom, #d82b27, #f09819) !important",
                        color: "#ffffff",
                        padding: '3px',
                        minWidth: "150px",
                        whiteSpace: "nowrap",
                      }}>User Name</TableCell>
              <TableCell  sx={{
                        fontWeight: "bold",
                        background: "linear-gradient(to bottom, #d82b27, #f09819) !important",
                        color: "#ffffff",
                        padding: '3px',
                        minWidth: "150px",
                        whiteSpace: "nowrap",
                      }}>Phone Number</TableCell>
              <TableCell  sx={{
                        fontWeight: "bold",
                        background: "linear-gradient(to bottom, #d82b27, #f09819) !important",
                        color: "#ffffff",
                        padding: '3px',
                        minWidth: "150px",
                        whiteSpace: "nowrap",
                      }}>Email</TableCell>
              <TableCell  sx={{
                        fontWeight: "bold",
                        background: "linear-gradient(to bottom, #d82b27, #f09819) !important",
                        color: "#ffffff",
                        padding: '3px',
                        minWidth: "150px",
                        whiteSpace: "nowrap",
                      }}>Access Level</TableCell>
              <TableCell  sx={{
                        fontWeight: "bold",
                        background: "linear-gradient(to bottom, #d82b27, #f09819) !important",
                        color: "#ffffff",
                        padding: '3px',
                        minWidth: "150px",
                        whiteSpace: "nowrap",
                      }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentRows.map((row) => (
              <TableRow key={row.loginCredentialsId}>
                <TableCell   sx={{ 
                            border: '1px solid #ccc',
                            padding: '3px',
                            fontWeight: 'bold',
                            whiteSpace: "nowrap",
                          }}>{row.loginCredentialsId}</TableCell>
                <TableCell  sx={{ 
                            border: '1px solid #ccc',
                            padding: '3px',
                            fontWeight: 'bold',
                            whiteSpace: "nowrap",
                          }}>{row.userName}</TableCell>
                <TableCell  sx={{ 
                            border: '1px solid #ccc',
                            padding: '3px',
                            fontWeight: 'bold',
                            whiteSpace: "nowrap",
                          }}>{row.mobile}</TableCell>
                <TableCell  sx={{ 
                            border: '1px solid #ccc',
                            padding: '3px',
                            fontWeight: 'bold',
                            whiteSpace: "nowrap",
                          }}>{row.email}</TableCell>
                <TableCell   sx={{ 
                            border: '1px solid #ccc',
                            padding: '3px',
                            fontWeight: 'bold',
                            whiteSpace: "nowrap",
                          }}>
                  <Box
                    width="100%"
                    mt="5px"
                    // p="5px"
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
                    {row.role === "ADMIN" && <AdminPanelSettingsOutlinedIcon />}
                    {row.role === "SUPERADMIN" && <SecurityOutlinedIcon />}
                    {row.role === "USER" && <LockOpenOutlinedIcon />}
                    <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
                      {row.role}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="flex-start"
                    gap={1}
                    width="100%"
                  >
                   <IconButton
                      sx={{ color: "black" }}
                      onClick={() => handleOpen("edit", row)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteClick(row.loginCredentialsId)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={userData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>

      {/* Modal for Add/Edit User */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="edit-user-modal"
        aria-describedby="edit-user-description"
      >
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
          <Typography variant="h5" sx={{ marginBottom: "24px", textAlign: "center", color: "red" }}>
            {userError}
          </Typography>
          <TextField
            required
            margin="dense"
            id="uname"
            name="uname"
            label="User Name"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.uname}
            onChange={(e) => setFormData({ ...formData, uname: e.target.value })}
            error={isSubmitted && (!formData.uname || /\s/.test(formData.uname))}
            helperText={
              isSubmitted &&
              (!formData.uname
                ? "User Name is required"
                : /\s/.test(formData.uname)
                ? "User Name should not contain spaces"
                : "")
            }
            sx={{ marginBottom: "16px" }}
          />
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
            error={isSubmitted && (!formData.password || /\s/.test(formData.password))}
            helperText={
              isSubmitted &&
              (!formData.password
                ? "Password is required"
                : /\s/.test(formData.password)
                ? "Password should not contain spaces"
                : "")
            }
            sx={{ marginBottom: "16px" }}
          />
          <TextField
            required
            margin="dense"
            id="email"
            name="email"
            label="Email Address"
            type="email"
            fullWidth
            variant="outlined"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={isSubmitted && (!formData.email || /\s/.test(formData.email))}
            helperText={
              isSubmitted &&
              (!formData.email
                ? "Email Address is required"
                : /\s/.test(formData.email)
                ? "Email Address should not contain spaces"
                : "")
            }
            sx={{ marginBottom: "16px" }}
          />
          <TextField
            required
            margin="dense"
            id="phone"
            name="phone"
            label="Phone Number"
            type="tel"
            fullWidth
            variant="outlined"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            error={isSubmitted && (!formData.phone || /\s/.test(formData.phone))}
            helperText={
              isSubmitted &&
              (!formData.phone
                ? "Phone Number is required"
                : /\s/.test(formData.phone)
                ? "Phone Number should not contain spaces"
                : "")
            }
            sx={{ marginBottom: "16px" }}
          />
          <TextField
            select
            required
            margin="dense"
            id="access"
            name="role"
            label="Role"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            fullWidth
            variant="outlined"
            error={isSubmitted && !formData.role}
            helperText={isSubmitted && !formData.role ? "Role is required" : ""}
            sx={{ marginBottom: "24px" }}
          >
            {roles.length > 0 ? (
              roles.map((role, index) => (
                <MenuItem key={index} value={role}>
                  {role}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>Loading...</MenuItem>
            )}
          </TextField>
          <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
            <Button
              onClick={handleClose}
              variant="outlined"
              sx={{
                marginRight: 1,
                background: "linear-gradient(to bottom, #d82b27, #f09819) !important",
                color: "white",
                "&:hover": {
                  backgroundColor: "#a1221f",
                },
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              color="primary"
              variant="contained"
              sx={{
                marginRight: 1,
                background: "linear-gradient(to bottom, #d82b27, #f09819) !important",
                color: "white",
                "&:hover": {
                  backgroundColor: "#a1221f",
                },
              }}
            >
              {isEditing ? "Save Changes" : "Add User"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default Team;