import React, { useContext, useEffect, useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import { AccountCircle } from '@material-ui/icons';
import { ButtonGroup } from '@material-ui/core';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import HomeIcon from '@material-ui/icons/Home';
import Badge from '@material-ui/core/Badge';
import UserContext from '../../context/UserContext';
import DataContext from '../../context/DataContext';
import LocalStorageService from "../../services/localStorage"
import { useHistory } from 'react-router-dom';
import axios from "../../config/axios";


const useStyles = makeStyles((theme) => ({
   grow: {
      flexGrow: 1,
   },
   menuButton: {
      marginRight: theme.spacing(2),
   },
   title: {
      display: 'none',
      [theme.breakpoints.up('sm')]: {
         display: 'block',
      },
   },
   topMenu: {
      background: 'secondary'
   },
   bottomMenu: {
      background: '#f5f5f5'
   }
}));

export default function NavBar() {
   const classes = useStyles();
   const history = useHistory();
   const [allProductType, setAllProductType] = useState([]);
   const { role, setRole } = useContext(UserContext);
   const { setProducts } = useContext(DataContext);

   const [anchorEl, setAnchorEl] = useState(null);
   const open = Boolean(anchorEl);

   const handleMenu = (event) => {
      setAnchorEl(event.currentTarget);
   };
   const handleClose = () => {
      setAnchorEl(null);
   };
   const handleProfile = () => {
      setAnchorEl(null);
      alert('profile click')
   };
   const handleLogout = () => {
      setAnchorEl(null);
      // console.log('logout');
      LocalStorageService.clearToken();
      setRole(LocalStorageService.getRole());
      history.push("/");
   };

   const handleLogin = () => {
      setAnchorEl(null);
      history.push("/login");
   };

   const hadleMenubar = (id) => {
      if(id === '0'){
         fetchProducts();
      } else {
         fetchProductByType(id);
      }
   };

   const gotoCart = () => {
      history.push("/cart");
   };

   const gotoHome = () => {
      history.push("/");
   }

   const fetchProducts = async () => {
      const res = await axios.get("/products");
      setProducts(res.data.products);
   }

   const fetchProductByType = async (id) => {
      const res = await axios.get(`/products/allProductType_id/${id}`);
      setProducts(res.data.allProductType_id);
   }

   //get all type product to create menubars
   const fetchAllProductType = async () => {
      const res = await axios.get("/products/allProductType");
      setAllProductType(res.data.productTypes);
      console.log(res.data.productTypes);
   }

   useEffect(() => {
      fetchAllProductType();
   }, [])


   return (
      <div className={classes.root} >
         <AppBar position="static">
            <Toolbar className={classes.topMenu}>
               <IconButton
                  edge="start"
                  className={classes.menuButton}
                  color="inherit"
                  aria-label="open drawer"
               >
                  <MenuIcon />
               </IconButton>
               <Typography className={classes.title} variant="h6" noWrap>
                  ShopShop
                    </Typography>
               <div className={classes.grow} />
               <IconButton
                  color="inherit"
               >
                  <HomeIcon onClick={gotoHome} />
               </IconButton>

               <IconButton aria-label="show 4 new mails" color="inherit" >
                  <Badge color="secondary">
                     {/* <Badge badgeContent={4} color="secondary"> */}
                     <ShoppingCartIcon onClick={gotoCart} />
                  </Badge>
               </IconButton>

               <IconButton
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
               >
                  <AccountCircle />
               </IconButton>
               <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                     vertical: 'top',
                     horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                     vertical: 'top',
                     horizontal: 'right',
                  }}
                  open={open}
                  onClose={handleClose}
               >
                  {/* <MenuItem onClick={handleProfile}>My profile</MenuItem> */}
                  {role === 'USER' ?
                     <MenuItem onClick={handleLogout}>Logout</MenuItem>
                     :
                     <MenuItem onClick={handleLogin}>Login</MenuItem>
                  }
               </Menu>
            </Toolbar>
            <Toolbar className={classes.bottomMenu}>
               <ButtonGroup variant="text" color="primary" aria-label="text primary button group">
                  <Button key={0} onClick={() => hadleMenubar('0')}>
                     All
                  </Button>
                  {allProductType.map((menu) => (
                     <Button
                        key={menu.id}
                        onClick={() => hadleMenubar(menu.id)}
                     >
                        {menu.name}
                     </Button>
                  ))}
               </ButtonGroup>
            </Toolbar>
         </AppBar>
      </div>
   );
}