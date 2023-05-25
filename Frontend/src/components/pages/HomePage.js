
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory, } from "react-router-dom";
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { FormControl } from 'react-bootstrap';
import Star from '@material-ui/icons/Star';
import Text from '@material-ui/core/Button';
import jwt_decode from 'jwt-decode';
import BackgroundImage from '../../assets/images/homeWalp.jpg'
import BackgroundImage2 from '../../assets/images/homeWalp2.jpg'
import profileImg from '../../assets/images/profile.png';
import polymov from '../../assets/images/polymov.png';
import { Edit, Delete, Visibility } from '@material-ui/icons';
import {Table,TableContainer, TableHead,TableRow,TableCell,TableBody,Paper,TablePagination,
        Button,IconButton,Dialog,DialogActions,DialogContent,DialogTitle,TextField, } from '@material-ui/core';
  
  

export default function HomePage() {
  const [title, setTitle] = useState('');
  const [image, setImage] = useState(null);
  const [isImageUploaded, setIsImageUploaded] = useState(false);
  const [genre, setGenre] = useState('');
  const [rate, setRate] = useState('');
  const [duration, setDuration] = useState('');
  const [director, setDirector] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [open, setOpen] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);
  const [description, setDescription] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [user, setUser] = useState(null);
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const token = localStorage.getItem('token');
  const history = useHistory();
    
    const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    movie.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    movie.director.toLowerCase().includes(searchQuery.toLowerCase()) ||
    movie.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    movie.releaseDate.toString().includes(searchQuery) ||
    movie.duration.toString().includes(searchQuery)||
    movie.rate.toString().includes(searchQuery) 
  );
    const handleFileChange = (e) => {
      setImage(e.target.files[0]);
      setIsImageUploaded(true);
    };

    const handleOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };
    const handleClosePreview = () => {
      setOpenPreview(false);
      setSelectedMovie(null);
    };
    function handleLogout() {
      // Remove the JWT token from local storage
      localStorage.removeItem('token');
      
      // Redirect the user to the login page
      history.push('/login');
    }
    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
    const handleDeleteClick = () => {
      setDeleteDialogOpen(true);
    };
    const handleDeleteCancel = () => {
      setDeleteDialogOpen(false);
      setSelectedMovie(null);
    };
    const handleUpdateClick = () => {
      setUpdateDialogOpen(true);

      
    };
    const handleUpdateCancel = () => {
      setUpdateDialogOpen(false);
      setSelectedMovie(null);
      
    };
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };
    const handleDelete = async (id) => {
      try {
        await axios.delete(`http://localhost:5000/api/movie/${id}`);
        setMovies(movies.filter((movie) => movie._id !== id));
        setDeleteDialogOpen(false);
        setSelectedMovie(null);
        
      } catch (error) {
        console.error(error);
        alert('Error Deleteing the movie');
      }
    };



    const handleUpdateMovie = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('image', image);
    formData.append('genre', genre);
    formData.append('rate', rate);
    formData.append('description', description);
    formData.append('duration', duration);
    formData.append('releaseDate', releaseDate);
    formData.append('director', director);
    formData.append('userId', user.id);
    
    axios
      .patch(`http://localhost:5000/api/movie/${selectedMovie._id}`, formData)
      .then((response) => {
        setMessage('Movie updated successfully');
        setUpdateDialogOpen(false);
        axios.get(`http://localhost:5000/api/movie/${user.id}`)
        .then(response => {
          setMovies(response.data);
          setTitle('');
          setImage('');
          setGenre('');
          setRate('');
          setDescription('');
          setDuration('');
          setReleaseDate('');
          setDirector('');
          setIsImageUploaded(false);
        })
        .catch(error => {
          console.error(error);
        });
      })
      .catch((error) => {
        console.log(error);
        alert('Error updating the movie');
      })
  };

  //Gett user Api 
  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwt_decode(token);
        const userId = decodedToken.id;
        

        // Fetch user data using user ID
        axios.get(`http://localhost:5000/api/user/${userId}`, {
         
        })
        .then(response => {
          console.log(response.data);
          setUser(response.data);
          axios.get(`http://localhost:5000/api/movie/${userId}`)
      .then(response => {
        setMovies(response.data);
      })
      .catch(error => {
        console.error(error);
      });
        })
        .catch(error => {
          console.error(error);
          // Handle error fetching user data, e.g. log out user or display error message
        });
      } catch (error) {
        console.error(error);
        // Handle error decoding token, e.g. log out user or display error message
      }
    } else {
      history.push('/login');
      // Handle case where user is not logged in, e.g. redirect to login page
    }
  }, [token]);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
 
  // Add Movie API
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append('title', title);
    formData.append('image', image);
    formData.append('genre', genre);
    formData.append('rate', rate);
    formData.append('description', description);
    formData.append('duration', duration);
    formData.append('releaseDate', releaseDate);
    formData.append('director', director);
    formData.append('userId', user.id);
    setIsImageUploaded(false);

    try {
      await axios.post('http://localhost:5000/api/movie/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setOpen (false) ;
      try {
        const decodedToken = jwt_decode(token);
        const userId = decodedToken.id;
        

        // Fetch user data using user ID
        axios.get(`http://localhost:5000/api/user/${userId}`, {
         
        })
        .then(response => {
          console.log(response.data);
          setTitle(''); setImage('');setGenre('');setRate('');setDescription('');
          setDuration('');setReleaseDate('');setDirector('');setUser(response.data);
          axios.get(`http://localhost:5000/api/movie/${userId}`)
        .then(response => {
        setMovies(response.data);
        })
        .catch(error => {
        console.error(error);
        });
        })
        .catch(error => {
          console.error(error);
        });
      } catch (error) {
        console.error(error);
      }
      //alert('Movie added successfully!');
      
    } catch (err) { 
      console.error(err);
      alert('Error adding movie');
    }
  };
  return (
    
    <div >
      {
        /* check if the user exist */
      user ? (
        <div 

        /* Background image*/ 

        style={{ backgroundImage: `url(${BackgroundImage2})`, backgroundRepeat: 'no-repeat',backgroundSize: 'cover',
        height: '100vh', display: 'flex',  flexDirection: 'column'
        }}>

    {/* Navbar */} 

              <Navbar variant="dark" bg="dark">
              <Navbar.Brand href="#home">
              <img src={polymov}  style={{ maxWidth: '25px', maxHeight:'25px'}}  />
              <a> </a> 
              Polymov</Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto">
              <Nav.Link href="#profile" onClick={handleOpenDialog}>Profile</Nav.Link>
              </Nav>
        
    {/* on pressing on the profile button dialog will appear */} 

              <Dialog open={openDialog} onClose={handleCloseDialog}>
              <DialogContent  >
              <p> <img src={profileImg} alt="Profile"  style={{ maxWidth: "50%", display: 'block', margin: '0 auto',}}/></p>
              <div>
              <p   className='profile-div text-center' style={{   color: '#333' }} > <a>{user?.name}</a> <a>{user?.lastName}</a></p>
                
              <p className=' text-center' style={{ color: '#333' }}>  {user?.email} </p> 
              </div>
              </DialogContent>
              <DialogActions>
            { /* <Button onClick={handleCloseDialog} color="#333">Close</Button> */}
              </DialogActions>
              </Dialog>

     {/* Option button*/} 
        
              <Nav style={{ paddingRight: '65px' }}>
              <NavDropdown title="Options" id="basic-nav-dropdown">
              <NavDropdown.Item className="dropdown-item" >
              </NavDropdown.Item >
              <NavDropdown.Item  href="#action/3.3"><Text onClick={handleLogout}>Logout</Text></NavDropdown.Item>
              </NavDropdown>
              </Nav>

     {/*Seach field */} 

                <FormControl  type="text" placeholder="Search" value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}style={{ width: '200px' }}/>

                </Navbar.Collapse>
                </Navbar>

     {/*Add Movie Button*/} 

                <Button variant="contained" color="#333"  onClick={handleOpen} style={{ position: "absolute", top: "60px", right: "70px"}}>
                Add movie
                </Button>

     {/*Header image*/} 

                
                <div> 
                <div className="center-screen ">
                <div className="container">

     {/*Movie dashboard*/} 

                <TableContainer component={Paper}>
                <Table>
                <TableHead>
                <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Genre</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Rate</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Options</TableCell>
                </TableRow>
                </TableHead>

                {/*Check if there's movie otherwize display a message*/} 
                {movies.length > 0 ? (
                <TableBody>
                  {(rowsPerPage > 0
                    ? filteredMovies.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    : filteredMovies
                   ).map((movie) => (
                    <TableRow key={movie._id}>
                    <TableCell>{movie.title}</TableCell>
                    <TableCell>{movie.genre}</TableCell>
                    <TableCell>{movie.duration} mins </TableCell>
                    <TableCell>{movie.rate} <Star  style={{ color: '#F5C518' }} ></Star></TableCell>
                    <TableCell>
                    <img src={`http://localhost:5000`+movie.image} alt={movie.title} style={{ maxWidth: '50px', maxHeight:'50px' }}/>
                    </TableCell>
                    <TableCell>
                    <IconButton style={{ color: '#333' }} onClick={() => { setSelectedMovie(movie); setOpenPreview(true); }}>
                    <Visibility />
                    </IconButton>
                    <IconButton>
                    <Edit style={{ color: '#333' }} onClick={() => {setSelectedMovie(movie); handleUpdateClick()}} />
                    </IconButton>
                    <IconButton>
                    <Delete style={{ color: '#E50914' }} onClick={() => {setSelectedMovie(movie); handleDeleteClick()}}/>
                    </IconButton>
                    </TableCell>
                    </TableRow>
                  ))}
                    </TableBody>
                  ) : (
                   <TableBody>
                   <TableRow>
                   <TableCell colSpan={6} >
                   <a style={{ fontWeight: 'bold', color: '#333' }} >
                    There are no movies yet. Click the "Add Movie" button to create one.
                   </a>
                   </TableCell>
                   </TableRow>
                   </TableBody>
                   )}
                  </Table>

                <TablePagination  rowsPerPageOptions={[3,5]} component="div"
                  count={movies.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onChangePage={handleChangePage}
                  onChangeRowsPerPage={handleChangeRowsPerPage}/>
                </TableContainer>
                </div>

    {/*Add Movie dialog*/} 

                  <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                  <DialogTitle id="form-dialog-title" > <a style={{ fontWeight: 'bold', color: '#333' }}>Add Movie</a></DialogTitle>
                  <DialogContent>

                  <form onSubmit={handleSubmit}>

                  <TextField autoFocus margin="dense" id="title" label="Title" type="text" fullWidth required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  />

                  <TextField margin="dense"  id="genre" label="Genre" type="text" fullWidth required
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  />

                  <TextField margin="dense" id="rate" label="Rate" type="number" fullWidth required
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  inputProps={{ min: 0, max: 10, defaultValue: 0}}
                  readOnly={true}
                  />

                  <TextField margin="dense" id="description" label="Description" type="text" fullWidth required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  />

                  <TextField margin="dense" id="director" label="Director" type="text" fullWidth required
                  value={director}
                  onChange={(e) => setDirector(e.target.value)}
                  />

                  <TextField margin="dense" id="releaseDate" label="ReleaseDate" type="number" fullWidth required
                  value={releaseDate}
                  onChange={(e) => setReleaseDate(e.target.value)}
                  inputProps={{min: 1900,max: 2023,defaultValue: 2023}}
                  />

                  <TextField
                  margin="dense" id="duration" label="Duration" type="number" fullWidth required
                  value={duration}
                  inputProps={{min: 30,max: 300,defaultValue: 100}}
                  onChange={(e) => setDuration(e.target.value)}
                  />

                  <input accept="image/*" id="image" type="file"  style={{ display: 'none' }}
                  onChange={handleFileChange} 
                  />
                  
                  <div style={{ paddingBottom: '30px' }}> </div>
                  <label htmlFor="image">
                  <Button variant="contained" color="#333" component="span">  Upload Movie's Picture  </Button>
                  {isImageUploaded && <p style={{ paddingLeft: '40px' }}>Image Uploaded</p>}
                  </label>
                  
                  <DialogActions >

                  <Button onClick={handleClose} color="#333">  Cancel  </Button>
                  <Button type="submit" color="#333"> Add </Button>

                  </DialogActions>
                  </form>
                  </DialogContent>
                  </Dialog>

      {/*Update dialog*/} 

                  <Dialog open={updateDialogOpen} onClose={handleUpdateCancel} aria-labelledby="form-dialog-title">
                  <DialogTitle id="form-dialog-title" > <a style={{ fontWeight: 'bold', color: '#333' }}>Update Movie</a></DialogTitle>
                  <DialogContent>

                  <form onSubmit={handleUpdateMovie}>

                  <TextField autoFocus  margin="dense" id="title" label="Title" type="text" fullWidth required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  />

                  <TextField  margin="dense" id="genre" label="Genre" type="text" fullWidth required
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  />

                  <TextField margin="dense" id="rate" label="Rate" type="number" fullWidth required
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  inputProps={{min: 0, max: 10, defaultValue: 0
                  }}
                  readOnly={true}
                  />

                  <TextField margin="dense" id="description" label="Description" type="text" fullWidth required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  />

                  <TextField margin="dense" id="director" label="Director" type="text" fullWidth required
                  value={director}
                  onChange={(e) => setDirector(e.target.value)}
                  />

                  <TextField margin="dense" id="releaseDate" label="ReleaseDate" type="number" fullWidth required
                  value={releaseDate}
                  onChange={(e) => setReleaseDate(e.target.value)}
                  inputProps={{min: 1900,max: 2023, defaultValue: 2023}}
                  />

                  <TextField margin="dense" id="duration" label="Duration" type="number" fullWidth required
                  inputProps={{min: 30,max: 300,defaultValue: 100}}
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  />

                  <input accept="image/*" id="image" type="file"  style={{ display: 'none' }}
                  onChange={handleFileChange}
                  />

                  <div style={{ paddingBottom: '30px' }}> </div>
                  <label htmlFor="image">
                  <Button variant="contained" color="#333" component="span">Upload Movie's Picture </Button>
                  {isImageUploaded && <p style={{ paddingLeft: '40px' }}>Image Uploaded</p>}
                  </label>

                  <DialogActions >
                  <Button onClick={handleUpdateCancel} color="#333"> Cancel </Button>
                  <Button type="submit" color="#333"> Update </Button>
                  </DialogActions>
                      
                  </form>
                  
                  </DialogContent>
                  </Dialog>

                  <div> 
                  </div>

  {/*Movie Details dialog*/}             

                  <Dialog open={openPreview} onClose={handleClosePreview}>
                  <DialogContent>
                  <p>
                  <img src={`http://localhost:5000${selectedMovie?.image}`} alt={selectedMovie?.title} style={{ maxWidth: "35%", display: 'block',margin: '0 auto',}}  />
                  </p>
                  <p > <a style={{ fontWeight: 'bold', color: '#333' }} >Movie : </a> {selectedMovie?.title} </p>
                  <p> <a style={{ fontWeight: 'bold', color: '#333' }} > Genrtitlee:</a> {selectedMovie?.genre} </p> 
                  <p> <a style={{ fontWeight: 'bold', color: '#333' }} >Rate: </a> {selectedMovie?.rate}  <Star  style={{ color: '#F5C518' }} ></Star> </p> 
                  <p> <a style={{ fontWeight: 'bold', color: '#333' }} >Description: </a> {selectedMovie?.description} </p>
                  <p> <a style={{ fontWeight: 'bold', color: '#333' }} >Duration: </a> {selectedMovie?.duration} mins </p>
                  <p> <a style={{ fontWeight: 'bold', color: '#333' }} >ReleaseDate: </a > {selectedMovie?.releaseDate} </p>
                  <p> <a style={{ fontWeight: 'bold', color: '#333' }} >Director: </a> {selectedMovie?.director} </p>
                      
                  </DialogContent>
                  <DialogActions>
                  <Button onClick={handleClosePreview} color="#333">Close</Button>
                  </DialogActions>
                  </Dialog>

    {/*Delete Movie Dialog*/} 

                  <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
                  <DialogTitle style={{ fontWeight: 'bold', color: 'red' }} >Confirm Delete</DialogTitle>
                  <DialogContent>
                  <DialogContent style={{ paddingBottom: '30px' }}>
                   Are you sure you want to delete this movie ?
                  </DialogContent  >
                  </DialogContent>
                  <DialogActions>
                  <Button onClick={handleDeleteCancel} color="#333" > Cancel </Button>
                  <Button onClick={() => handleDelete(selectedMovie?._id)} color="#333" > Delete </Button>
                  </DialogActions>
                  </Dialog>
               </div>
             </div>
           <div>
        </div>
      <div> 
   </div>
</div>
        
      ) : 

      /*Dispaly loading if the user is not found*/
      (
        <p>Loading...</p>
      )}
</div>
  );
};
